import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { clean } from "../../../../../helpers/json";
import { withMethods } from "../../../../../lib/middleware/withMethods";
import prisma from "../../../../../lib/prisma";
import { authOptions } from "../../../auth/[...nextauth]";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await unstable_getServerSession(req, res, authOptions);

    if (req.method === "POST") {
      if (!session) {
        return res.status(403).end();
      }

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

    if (req.method === "GET") {
      const slug = req.query.slug as string;

      const rawPost = await prisma.post.findUnique({
        where: { slug },
      });

      if (!rawPost) {
        return res.status(200);
      }

      const likes = await prisma.postLike.findMany({
        where: {
          userId: session?.user?.id,
          postId: rawPost.id,
        },
      });

      const post = clean({
        ...rawPost,
        liked: likes.find((like) => like.postId === rawPost.id),
      });

      const rawComments = await prisma.comment.findMany({
        where: {
          postId: post.id,
        },
        include: {
          author: true,
          _count: {
            select: { likes: true },
          },
        },
      });
      const commentLikes = await prisma.commentLike.findMany({
        where: {
          userId: session?.user?.id,
          commentId: {
            in: rawComments.map((comment) => comment.id),
          },
        },
      });

      const commentsWithLikes = rawComments.map((comment) => {
        return {
          ...comment,
          liked: commentLikes.find((like) => like.commentId === comment.id),
        };
      });

      return res.status(200).json(clean(commentsWithLikes));
    }
  } catch (error) {
    res.status(500);
  }
}

export default withMethods(["GET", "POST"], handler);
