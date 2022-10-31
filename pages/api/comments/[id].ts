// pages/api/post/index.ts

import { NextApiRequest } from "next";
import prisma from "../../../lib/prisma";

export default async function handle(req: NextApiRequest, res) {
  if (req.method === "GET") {
    let comment = await prisma.comment.findMany({
      where: {
        id: req.query.id as string,
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

  res.json();
}
