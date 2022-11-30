import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { QueryClient, dehydrate, useQuery } from "@tanstack/react-query";
import Ama from "../../components/Ama/Ama";
import Layout from "../../components/Layout";
import SEO from "../../components/SEO";
import { staticAmas } from "../../db/static";
import { clean } from "../../helpers/json";
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

  const slug = context.params.slug as string;
  const staticPost = staticAmas.find((a) => slug === a.slug);

  const post = await queryClient.fetchQuery(
    ["article", context.params.slug],
    async () => {
      if (staticPost) {
        return staticPost;
      }

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
        return clean(rawPost);
      }

      const likes = await prisma.postLike.findMany({
        where: {
          userId: session?.user?.id,
          postId: rawPost.id,
        },
      });
      return clean({
        ...rawPost,
        liked: likes.find((like) => like.postId === rawPost.id),
      });
    }
  );

  await queryClient.fetchQuery(["comments", post.id], async () => {
    if (staticPost) {
      return staticPost.comments;
    }

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
      return clean(rawComments);
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

    return clean(comments);
  });

  return {
    props: {
      session,
      article: clean(post),
      dehydratedState: dehydrate(queryClient),
    },
  };
};

const generateOgImagePath = (article) => {
  const params = new URLSearchParams();
  params.set("title", article.title);
  params.set("hosts", article.authors.map((author) => author.name).join(","));
  params.set(
    "avatars",
    article.authors
      .map((author) => {
        if (author.image.includes("pbs.twimg")) {
          return author.image;
        }

        return "";
      })
      .join(",")
  );
  return `/api/og?${params.toString()}`;
};

export default function AmaPage({ article }) {
  const { data: commentsFromQuery } = useQuery({
    queryKey: ["comments", article.id],
    queryFn: async () => {
      return await (
        await fetch(`/api/articles/${article.slug}/comments`)
      ).json();
    },
  });
  const { data: articleFromQuery } = useQuery({
    queryKey: ["article", article.slug],
    queryFn: async () => {
      return await (await fetch(`/api/articles/${article.slug}`)).json();
    },
  });

  return (
    <>
      <SEO
        title={`${articleFromQuery.title} | bleeding edge`}
        description={article.summary}
        image={generateOgImagePath(article)}
      />
      <Layout>
        <Ama article={articleFromQuery} comments={commentsFromQuery} />
      </Layout>
    </>
  );
}
