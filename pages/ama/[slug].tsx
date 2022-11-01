import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
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

  const post = await prisma.post.findUnique({
    where: {
      slug: String(context.params?.slug),
    },
    include: {
      authors: true,
      _count: {
        select: { comments: true, votes: true },
      },
    },
  });

  const sessionRequest = unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  const [session] = await Promise.all([sessionRequest]);

  // const likes = await prisma.commentVote.findMany({
  //   where: {
  //     userId: (session?.user as any)?.id,
  //     commentId: { in: comments.map((comment) => comment.id) },
  //   },
  // });

  await queryClient.fetchQuery(["comments", post.id], async () => {
    const result = await prisma.comment.findMany({
      where: {
        postId: post.id,
      },
      include: {
        author: true,
        _count: {
          select: { votes: true },
        },
      },
    });

    return JSON.parse(JSON.stringify(result));
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
  const test = useQuery({
    queryKey: ["comments", article.id],
    queryFn: async () => {},
  });

  return (
    <>
      <SEO title="bleeding edge" />
      <Layout>
        <Ama article={article} comments={test.data} />
      </Layout>
    </>
  );
}
