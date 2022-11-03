import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { useRouter } from "next/router";
import React from "react";
import { QueryClient, dehydrate, useQuery } from "@tanstack/react-query";
import Ama from "../../components/Ama";
import Layout from "../../components/Layout";
import SEO from "../../components/SEO";
import prisma from "../../lib/prisma";
import { authOptions } from "../api/auth/[...nextauth]";

export function formatNestedComments(comments: Array<any>) {
  const map = new Map();

  const roots = [];

  for (let i = 0; i < comments.length; i++) {
    const commentId = comments[i]?.id;

    map.set(commentId, i);

    comments[i].children = [];

    if (typeof comments[i]?.parentId === "string") {
      const parentCommentIndex: number = map.get(comments[i]?.parentId);

      comments[parentCommentIndex].children.push(comments[i]);

      continue;
    }

    roots.push(comments[i]);
  }

  return roots;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const queryClient = new QueryClient();

  const sessionRequest = unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  const [session] = await Promise.all([sessionRequest]);

  // const liveArticleRequest = await prisma.post.findFirst({
  //   where: { live: true },
  //   include: {
  //     authors: true,
  //     comments: {
  //       distinct: ["authorId"],
  //       select: {
  //         author: true,
  //       },
  //     },
  //   },
  // });

  const post = await queryClient.fetchQuery(
    ["post", context.params.slug],
    async () => {
      const rawPost = await prisma.post.findUnique({
        where: {
          slug: String(context.params?.slug),
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
        return JSON.parse(JSON.stringify(rawPost));
      }

      const likes = await prisma.postLike.findMany({
        where: {
          userId: session?.user?.id,
          postId: rawPost.id,
        },
      });
      return JSON.parse(
        JSON.stringify({
          ...rawPost,
          liked: likes.find((like) => like.postId === rawPost.id),
        })
      );
    }
  );

  await queryClient.fetchQuery(["comments", post.id], async () => {
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

    if (!session) {
      return JSON.parse(JSON.stringify(rawComments));
    }

    const likes = await prisma.commentLike.findMany({
      where: {
        userId: session.user.id,
        commentId: {
          in: rawComments.map((comment) => comment.id),
        },
      },
    });
    const comments = rawComments.map((comment) => {
      return {
        ...comment,
        liked: likes.find((like) => like.commentId === comment.id),
      };
    });

    return JSON.parse(JSON.stringify(comments));
  });

  return {
    props: {
      session,
      article: JSON.parse(JSON.stringify(post)),
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default function AmaPage({ article }) {
  const router = useRouter();

  const { data: commentsFromQuery } = useQuery({
    queryKey: ["comments", article.id],
    queryFn: async () => {
      return await (await fetch(`/api/ama/${article.slug}/comments`)).json();
    },
  });
  const { data: articleFromQuery } = useQuery({
    queryKey: ["post", router.query.slug],
    queryFn: async () => {
      return await (await fetch(`/api/ama/${article.slug}`)).json();
    },
  });

  return (
    <>
      <SEO title="bleeding edge" />
      <Layout>
        <Ama article={articleFromQuery} comments={commentsFromQuery} />
      </Layout>
    </>
  );
}
