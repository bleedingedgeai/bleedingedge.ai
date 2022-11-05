import { NextApiRequest, NextApiResponse } from "next";
import z from "zod";
import { withAuthentication } from "../../../../../../lib/middleware/withAuthentication";
import { withMethods } from "../../../../../../lib/middleware/withMethods";
import { withValidation } from "../../../../../../lib/middleware/withValidation";
import prisma from "../../../../../../lib/prisma";

const schema = z.object({
  commentId: z.string(),
  userId: z.string(),
});

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const data = {
      commentId: req.body.postId,
      userId: req.body.userId,
    };

    const like = await prisma.commentLike.findUnique({
      where: { userId_commentId: data },
    });

    if (like) {
      const deleted = await prisma.commentLike.delete({
        where: { userId_commentId: data },
      });
      res.status(200).json({ deleted: true, ...deleted });
      return;
    } else {
      const upvote = await prisma.commentLike.create({ data });
      res.status(200).json(upvote);
      return;
    }
  }
}

export default withMethods(
  ["POST"],
  withAuthentication(withValidation(schema, handler))
);
