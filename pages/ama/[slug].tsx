import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import React, { useState } from "react";
import Ama from "../../components/Ama";
import Layout from "../../components/Layout";
import SEO from "../../components/SEO";
import prisma from "../../lib/prisma";
import { authOptions } from "../api/auth/[...nextauth]";
import { Sort } from "..";

function formComments(comments: Array<any>) {
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
  const post = await prisma.post.findUnique({
    where: {
      slug: String(context.params?.slug),
    },
    include: {
      authors: true,
    },
  });

  const sessionRequest = unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  const commentsRequest = prisma.comment.findMany({
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

  const tagsRequest = prisma.tag.findMany();

  const [session, comments, tags] = await Promise.all([
    sessionRequest,
    commentsRequest,
    tagsRequest,
  ]);

  const likes = await prisma.commentVote.findMany({
    where: {
      userId: (session?.user as any)?.id,
      commentId: { in: comments.map((comment) => comment.id) },
    },
  });

  return {
    props: {
      session,
      tags,
      article: JSON.parse(JSON.stringify(post)),
      comments: JSON.parse(JSON.stringify(formComments(comments))),
    },
  };
};

export default function AmaPage({ tags, comments, article }) {
  const [sort, setSort] = useState<Sort>("Latest");

  return (
    <>
      <SEO title="bleeding edge" />
      <Layout tags={tags} sort={sort} setSort={setSort}>
        <Ama article={article} comments={comments} />
      </Layout>
    </>
  );
}
