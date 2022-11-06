import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import z from "zod";
import type { ZodSchema } from "zod";

export function withValidation<T extends ZodSchema>(
  schema: T,
  handler: NextApiHandler
) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    try {
      await schema.parse(req.body);

      return handler(req, res);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(422).json(error.issues);
      }

      return res.status(422).end();
    }
  };
}
