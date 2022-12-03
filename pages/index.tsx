import { useState } from "react";
import styled from "styled-components";
import { Tag } from "@prisma/client";
import Banner from "../components/Banner";
import FilterAndSort from "../components/FilterAndSort";
import FilterAndSortMobile from "../components/FilterAndSortMobile";
import Layout from "../components/Layout";
import SEO from "../components/SEO";
import Timeline from "../components/Timeline";
import { clean } from "../helpers/json";
import prisma from "../lib/prisma";
import { ArticleHome, ArticleLive } from "../prisma/types";
import { mq } from "../styles/mediaqueries";

export async function getStaticProps() {
  const articlesRequest = prisma.post.findMany({
    where: { published: true },
    include: {
      _count: {
        select: { comments: true },
      },
      authors: {
        select: { name: true },
      },
    },
  });

  const liveArticleRequest = prisma.post.findFirst({
    where: { live: true },
    include: {
      authors: true,
      comments: {
        distinct: ["authorId"],
        select: {
          author: true,
        },
      },
    },
  });

  const tagsRequest = prisma.tag.findMany();
  const [articles, liveArticle, tags] = await Promise.all([
    articlesRequest,
    liveArticleRequest,
    tagsRequest,
  ]);

  return {
    props: {
      articles: clean(articles),
      liveArticle: clean(liveArticle),
      tags,
    },
    revalidate: 60,
  };
}

export type Sort = "Latest" | "Earliest";

interface HomeProps {
  tags: Tag[];
  articles: ArticleHome[];
  liveArticle: ArticleLive;
}

export default function Home({ tags, articles, liveArticle }: HomeProps) {
  const [sort, setSort] = useState<Sort>("Latest");

  return (
    <>
      <SEO title="bleeding edge" />
      <Layout>
        {Boolean(liveArticle) && <Banner article={liveArticle} />}
        <FilterAndSortSticky>
          <FilterAndSort tags={tags} sort={sort} setSort={setSort} />
        </FilterAndSortSticky>
        <Timeline sort={sort} articles={articles} />
      </Layout>
      <FilterAndSortMobile tags={tags} sort={sort} setSort={setSort} />
    </>
  );
}

const FilterAndSortSticky = styled.div`
  position: sticky;
  top: 40px;
  z-index: 210000;

  ${mq.desktopSmall} {
    top: 121px;
  }

  ${mq.phablet} {
    top: 112px;
  }
`;
