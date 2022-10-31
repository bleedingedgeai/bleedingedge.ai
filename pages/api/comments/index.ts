// pages/api/post/index.ts

import { NextApiRequest } from "next";
import { unstable_getServerSession } from "next-auth";
import prisma from "../../../lib/prisma";
import { authOptions } from "../auth/[...nextauth]";

export default async function handle(req: NextApiRequest, res) {
  if (req.method === "POST") {
    const result = await prisma.comment.create({
      data: {
        content: req.body.content,
        score: 1,
        author: {
          connect: {
            id: req.body.userId,
          },
        },
        parent: {
          connect: {
            id: req.body.parentId || req.body.postId,
          },
        },
        post: {
          connect: {
            id: req.body.postId,
          },
        },
      },
      include: {
        children: {
          include: {
            children: true,
          },
        },
      },
    });

    res.json(result);
    return;
  }
}
