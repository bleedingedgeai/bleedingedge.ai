import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import sanitize from "sanitize-html";
import { clean } from "../../../../../../helpers/json";
import { withMethods } from "../../../../../../lib/middleware/withMethods";
import prisma from "../../../../../../lib/prisma";
import { authOptions } from "../../../../auth/[...nextauth]";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const commentId = req.query.commentId as string;
    if (req.method === "GET") {
      const session = await unstable_getServerSession(req, res, authOptions);

      const comment = await prisma.comment.findUnique({
        where: {
          id: commentId,
        },
        include: {
          author: true,
          _count: {
            select: { likes: true },
          },
        },
      });

      if (!session) {
        return res.status(200).json(clean(comment));
      }

      const like = await prisma.commentLike.findUnique({
        where: {
          userId_commentId: {
            commentId: commentId,
            userId: session?.user.id,
          },
        },
      });

      return res.status(200).json(
        clean({
          ...comment,
          liked: like,
        })
      );
    }

    const session = await unstable_getServerSession(req, res, authOptions);

    // Required to have auth with PATCH and DELETE methods
    if (!session) {
      return res.status(403).end();
    }

    const author = await prisma.comment
      .findUnique({ where: { id: commentId } })
      .author();

    if (author.id !== session.user.id) {
      return res.status(403).end();
    }

    if (req.method === "PATCH") {
      const udpatedComment = await prisma.comment.update({
        where: { id: commentId },
        data: {
          content: sanitize(req.body.content),
        },
      });
      return res.status(200).json(clean(udpatedComment));
    }

    if (req.method === "DELETE") {
      const deletedComment = await prisma.comment.update({
        where: { id: commentId },
        data: {
          content: null,
          author: {
            disconnect: true,
          },
        },
      });
      return res.status(200).json(clean(deletedComment));
    }
  } catch (error) {
    res.status(500);
  }
}

export default withMethods(["GET", "PATCH", "DELETE"], handler);
