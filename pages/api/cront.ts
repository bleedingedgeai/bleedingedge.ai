import { NextApiRequest, NextApiResponse } from "next";
import { verifySignature } from "@upstash/qstash/nextjs";

// key = 2e39d6c2-872c-4ec0-9b64-14b53c0c2490

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      res.status(200).json({ success: true });
    } catch (err) {
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}

export default verifySignature(handler);

export const config = {
  api: {
    bodyParser: false,
  },
};
