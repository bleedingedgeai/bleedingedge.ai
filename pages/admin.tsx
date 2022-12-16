import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { useState } from "react";
import styled from "styled-components";
import { Tag } from "@prisma/client";
import FilterAndSortMobile from "../components/FilterAndSortMobile";
import Layout from "../components/Layout";
import SEO from "../components/SEO";
import { clean } from "../helpers/json";
import prisma from "../lib/prisma";
import { ArticleHome } from "../prisma/types";
import { authOptions } from "./api/auth/[...nextauth]";

export const ADMINS = ["lachygroom", "brotzky_", "tcosta_co", "davidtsong"];

export const getServerSideProps: GetServerSideProps = async (context) => {
  // const queryClient = new QueryClient();

  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!session || !ADMINS.includes(session.user.username)) {
    return {
      notFound: true,
    };
  }

  const articlesRequest = prisma.post.findMany({
    include: {
      _count: {
        select: { comments: true },
      },
      authors: {
        select: { name: true },
      },
      tags: {},
    },
  });

  const tagsRequest = prisma.tag.findMany();
  const [articles, tags] = await Promise.all([articlesRequest, tagsRequest]);

  return {
    props: {
      articles: clean(articles),
      tags,
    },
  };
};

interface HomeProps {
  tags: Tag[];
  articles: ArticleHome[];
}

const sortByLatest = (a, b) => {
  return new Date(a.postedAt).getTime() - new Date(b.postedAt).getTime();
};

const sortByEarliest = (date1, date2) => {
  return new Date(date1).getTime() - new Date(date2).getTime();
};

export default function Home({ tags, articles }: HomeProps) {
  return (
    <>
      <SEO title="Admin | bleeding edge" />
      <Layout>
        {articles.sort(sortByLatest).map((a) => (
          <Article key={a.id}>
            <PostedAt>
              {new Intl.DateTimeFormat("en").format(new Date(a.postedAt))}
            </PostedAt>
            <span>{a.title}</span>
          </Article>
        ))}
      </Layout>
    </>
  );
}

const Article = styled.div`
  margin-bottom: 8px;
  display: flex;
`;

const PostedAt = styled.div`
  min-width: 90px;
  margin-right: 12px;
`;
