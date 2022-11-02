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

    await prisma.commentLike.create({
      data: {
        commentId: comment.id,
        userId: userId,
      },
    });

    const commentWithLike = {
      ...comment,
      _count: {
        likes: 1,
      },
      liked: true,
    };

    res.json(commentWithLike);
    return;
  }
  if (req.method === "GET") {
    // const { content, postId, } = req.body;

    // const result = await prisma.comment.findMany({
    //   where: {
    //     slug: req.body.slug,
    //   },
    //   include: {
    //     author: true,
    //     _count: {
    //       select: { votes: true },
    //     },
    //   },
    // });
    res.json();
    return;
  }
}
