import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import sanitize from "sanitize-html";
import { staticAmas } from "../../../../../db/static";
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
          content: sanitize(content),
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
      const staticPost = staticAmas.find((a) => slug === a.slug);
      if (staticPost) {
        return res.status(200).json(staticPost.comments);
      }

      const rawPost = await prisma.post.findUnique({ where: { slug } });

      if (!rawPost) {
        return res.status(200);
      }

      const rawComments = await prisma.comment.findMany({
        where: {
          postId: rawPost.id,
        },
        include: {
          author: true,
          _count: {
            select: { likes: true },
          },
        },
      });

      if (!session) {
        return res.status(200).json(clean(rawComments));
      }

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
