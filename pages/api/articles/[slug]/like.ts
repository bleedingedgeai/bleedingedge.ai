import { NextApiRequest, NextApiResponse } from "next";
import z from "zod";
import { withAuthentication } from "../../../../lib/middleware/withAuthentication";
import { withMethods } from "../../../../lib/middleware/withMethods";
import { withValidation } from "../../../../lib/middleware/withValidation";
import prisma from "../../../../lib/prisma";

const schema = z.object({
  postId: z.string(),
  userId: z.string(),
});

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const data = {
      postId: req.body.postId,
      userId: req.body.userId,
    };

    const like = await prisma.postLike.findUnique({
      where: { userId_postId: data },
    });

    if (like) {
      const deleted = await prisma.postLike.delete({
        where: { userId_postId: data },
      });
      res.status(200).json({ deleted: true, ...deleted });
      return;
    } else {
      const upvote = await prisma.postLike.create({ data });
      res.status(200).json(upvote);
      return;
    }
  }
}

export default withMethods(
  ["POST"],
  withAuthentication(withValidation(schema, handler))
);
