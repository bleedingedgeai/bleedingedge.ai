import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import prisma from "../../../lib/prisma";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions);
  const rawPosts = await prisma.post.findMany({
    where: { authors: { some: {} } },
    include: {
      authors: true,
      _count: {
        select: { comments: true, likes: true },
      },
      comments: {
        distinct: ["authorId"],
        select: {
          author: true,
        },
      },
    },
  });

  if (!session) {
    return res.status(200).json(JSON.parse(JSON.stringify(rawPosts)));
  }

  const likes = await prisma.postLike.findMany({
    where: {
      userId: session.user.id,
      postId: {
        in: rawPosts.map((comment) => comment.id),
      },
    },
  });
  const posts = rawPosts.map((post) => {
    return {
      ...post,
      liked: likes.find((like) => like.postId === post.id),
    };
  });

  return res.status(200).json(JSON.parse(JSON.stringify(posts)));
}
