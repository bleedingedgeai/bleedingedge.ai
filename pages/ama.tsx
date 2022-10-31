import fs from "fs";
import { Feed as RSSFeed } from "feed";
import { useState } from "react";
import Layout from "../components/Layout";
import SEO from "../components/SEO";
import TimelineAma from "../components/TimelineAma";
import { IArticle, getArticles } from "../db/articles";
import { getTags } from "../db/tags";
import prisma from "../lib/prisma";
import { Sort } from ".";

export async function getStaticProps() {
  const articlesRequest = getArticles({ tags: [] });
  const tagsRequest = getTags();

  const [tags] = await Promise.all([articlesRequest, tagsRequest]);

  const article = await prisma.post.findMany({
    where: { author: { some: {} } },
    include: {
      author: true,
      _count: {
        select: { comments: true },
      },
    },
  });

  console.log(article);
  return {
    props: {
      articles: JSON.parse(JSON.stringify(article)),
      tags,
    },
    revalidate: 60, // In seconds
  };
}

export default function Ama(props) {
  const [sort, setSort] = useState<Sort>("Latest");

  return (
    <>
      <SEO title="bleeding edge" />
      <Layout tags={props.tags} sort={sort} setSort={setSort}>
        <TimelineAma sort={sort} articles={props.articles} />
      </Layout>
    </>
  );
}
