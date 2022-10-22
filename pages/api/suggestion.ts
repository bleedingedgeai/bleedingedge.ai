import Airtable from "airtable";
import { NextApiRequest, NextApiResponse } from "next";
import { validateEmail } from "./subscribe";

Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.AIRTABLE_API_KEY,
});

const base: Airtable.Base = Airtable.base(process.env.AIRTABLE_BASE_ID);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    if (!req.body) {
      return res.status(400).json({ error: "Invalid body" });
    }

    const body = JSON.parse(req.body);

    if (!validateEmail(body.email)) {
      return res.status(400).json({ error: "Invalid email" });
    }

    if (!body.suggestion) {
      return res.status(400).json({ error: "Invalid suggestion" });
    }

    const response = await new Promise((resolve, reject) => {
      base("suggestions").create(
        [
          {
            fields: { email: body.email, suggestion: body.suggestion },
          },
        ],
        (err, records) => {
          if (err) {
            reject(err);
            return;
          }

          resolve(records.map((r) => r.id));
        }
      );
    });

    res.status(200).json(response);
    return;
  }

  res.status(400).json({ error: "Method not allowed" });
}
