// pages/api/post/index.ts

import { NextApiRequest } from "next";
import { unstable_getServerSession } from "next-auth";
import prisma from "../../../lib/prisma";
import { authOptions } from "../auth/[...nextauth]";

export default async function handle(req: NextApiRequest, res) {
  if (req.method === "GET") {
    let comment = await prisma.comment.findMany({
      where: {
        postId: "cl9uumm4200049au1xncjc2h3",
      },
      include: {
        author: true,
        children: {
          include: {
            children: true,
            author: true,
          },
        },
      },
    });
    res.json(comment);
    return;
  }

  if (req.method === "POST") {
    // const session = await getSession({ req });
    const session = await unstable_getServerSession(req, res, authOptions);

    console.log(session);
    const result = await prisma.comment.create({
      data: {
        content: req.body.content,
        score: 1,
        author: {
          connect: {
            email: "brotzky@gmail.com",
          },
        },
        parent: {
          connect: {
            id: req.body.parentId as string,
          },
        },
        post: {
          connect: {
            id: req.body.postId as string,
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
