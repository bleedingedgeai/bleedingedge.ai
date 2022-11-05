import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { withMethods } from "../../../lib/middleware/withMethods";
import prisma from "../../../lib/prisma";
import { authOptions } from "../auth/[...nextauth]";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await unstable_getServerSession(req, res, authOptions);
    const rawPosts = await prisma.post.findMany({
      where: { authors: { some: {} } },
      include: {
        authors: true,
        _count: {
          select: {
            comments: {
              where: {
                authorId: {
                  not: null,
                },
              },
            },
            likes: true,
          },
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
  } catch (error) {
    res.status(500);
  }
}

export default withMethods(["GET"], handler);
