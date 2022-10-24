import { NextApiRequest, NextApiResponse } from "next";
import Client from "@sendgrid/client";
import { ClientRequest } from "@sendgrid/client/src/request";

Client.setApiKey(process.env.SENDGRID_API_KEY);

type HttpMethod =
  | "get"
  | "GET"
  | "post"
  | "POST"
  | "put"
  | "PUT"
  | "patch"
  | "PATCH"
  | "delete"
  | "DELETE";

// The most basic email validation
export function validateEmail(email) {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const body = JSON.parse(req.body);

    if (!validateEmail(body.email)) {
      return res.status(400).json({ error: "Invalid email" });
    }

    const request: ClientRequest = {
      method: "PUT" as HttpMethod,
      url: "/v3/marketing/contacts",
      body: JSON.stringify({
        list_ids: ["89e0ddb1-caa4-489a-a168-686a4f4e406f"], // bleeding edge contact list
        contacts: [{ email: body.email }],
      }),
    };
    const [response] = await Client.request(request);

    if (response.statusCode < 300) {
      return res.status(200).json({ message: "Subscribed" });
    }
  }

  res.status(400).json({ error: "Method not allowed" });
}
