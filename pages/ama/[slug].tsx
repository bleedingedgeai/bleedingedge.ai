import { GetServerSideProps } from "next";
import React, { Fragment, useState } from "react";
import Ama from "../../components/Ama";
import Layout from "../../components/Layout";
import SEO from "../../components/SEO";
import prisma from "../../lib/prisma";
import { Sort } from "..";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const post = await prisma.post.findUnique({
    where: {
      slug: String(params?.slug),
    },
    include: {
      author: true,
    },
  });

  const comments = await prisma.comment.findMany({
    where: {
      postId: post.id,
    },
    include: {
      author: true,
      children: {
        include: {
          author: true,
          children: {
            include: {
              author: true,
              children: {
                include: {
                  children: true,
                  author: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return {
    props: {
      article: JSON.parse(JSON.stringify(post)),
      comments: JSON.parse(JSON.stringify(comments)),
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
