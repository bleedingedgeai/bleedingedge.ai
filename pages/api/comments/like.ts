import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const data = {
      commentId: req.body.commentId,
      userId: req.body.userId,
    };

    const like = await prisma.commentLike.findUnique({
      where: { userId_commentId: data },
    });

    if (like) {
      const deleted = await prisma.commentLike.delete({
        where: { userId_commentId: data },
      });
      res.status(200).json(deleted);
      return;
    } else {
      const upvote = await prisma.commentLike.create({ data });
      res.status(200).json(upvote);
      return;
    }
  }

  return res.status(400).json({ error: "Method not allowed" });
}
