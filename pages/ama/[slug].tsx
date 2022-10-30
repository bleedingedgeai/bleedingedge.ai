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
      author: {
        select: { name: true },
      },
    },
  });

  console.log(post.id);
  const comments = await prisma.comment.findMany({
    where: {
      postId: post.id,
    },
    include: {
      author: true,
      children: {
        include: {
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
          author: true,
        },
      },
    },
  });

  return {
    props: {
      post: JSON.parse(JSON.stringify(post)),
      comments: JSON.parse(JSON.stringify(comments)),
    },
  };
};

export default function AmaPage(props) {
  const [sort, setSort] = useState<Sort>("Latest");

  return (
    <>
      <SEO title="bleeding edge" />
      <Layout
        tags={props.tags}
        articles={props.articles}
        sort={sort}
        setSort={setSort}
      >
        <Ama post={props.post} comments={props.comments} />
      </Layout>
    </>
  );
}
