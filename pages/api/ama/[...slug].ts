import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import prisma from "../../../lib/prisma";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions);

  const [slug, comments, commentId] = req.query.slug as any;

  if (commentId) {
    if (req.method === "PUT") {
      const comment = await prisma.comment.update({
        where: {
          id: commentId,
        },
        data: {
          author: {
            disconnect: true,
          },
        },
      });
      return res.status(200).json(JSON.parse(JSON.stringify(comment)));
    }

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
      return res.status(200).json(JSON.parse(JSON.stringify(comment)));
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
      JSON.parse(
        JSON.stringify({
          ...comment,
          liked: like,
        })
      )
    );
  }

  if (comments) {
    if (slug) {
      const rawPost = await prisma.post.findUnique({
        where: {
          slug,
        },
      });

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

      const comments = JSON.parse(JSON.stringify(commentsWithLikes));

      return res.status(200).json(comments);
    }
  }

  if (slug) {
    const rawPost = await prisma.post.findUnique({
      where: {
        slug,
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
  }

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
}
