import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { withMethods } from "../../../../lib/middleware/withMethods";
import prisma from "../../../../lib/prisma";
import { authOptions } from "../../auth/[...nextauth]";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await unstable_getServerSession(req, res, authOptions);

    const rawPost = await prisma.post.findUnique({
      where: {
        slug: req.query.slug as string,
      },
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
      res.status(200).json(rawPost);
    }

    const likes = await prisma.postLike.findMany({
      where: {
        userId: session?.user?.id,
        postId: rawPost.id,
      },
    });
    const post = JSON.parse(
      JSON.stringify({
        ...rawPost,
        liked: likes.find((like) => like.postId === rawPost.id),
      })
    );
    return res.status(200).json(post);
  } catch (error) {
    res.status(500);
  }
}

export default withMethods(["GET"], handler);
