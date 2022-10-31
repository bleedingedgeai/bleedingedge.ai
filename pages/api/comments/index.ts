// pages/api/post/index.ts

import { NextApiRequest } from "next";
import prisma from "../../../lib/prisma";

export default async function handle(req: NextApiRequest, res) {
  if (req.method === "POST") {
    const { content, postId, userId, parentId } = req.body;

    const comment = await prisma.comment.create({
      data: {
        content: content,
        post: {
          connect: {
            id: postId,
          },
        },
        author: {
          connect: {
            id: userId,
          },
        },
        ...(parentId && {
          parent: {
            connect: {
              id: parentId,
            },
          },
        }),
      },
    });

    res.json(comment);
    return;
  }
}
