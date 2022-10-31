import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const data = {
      postId: req.body.postId,
      userId: req.body.userId,
    };

    const like = await prisma.postVote.findUnique({
      where: { userId_postId: data },
    });

    if (like) {
      const deleted = await prisma.postVote.delete({
        where: { userId_postId: data },
      });
      res.status(200).json({ deleted: true, ...deleted });
      return;
    } else {
      const upvote = await prisma.postVote.create({ data });
      res.status(200).json(upvote);
      return;
    }
  }

  return res.status(400).json({ error: "Method not allowed" });
}
