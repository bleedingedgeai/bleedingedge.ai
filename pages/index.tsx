import fs from "fs";
import { Feed as RSSFeed } from "feed";
import { useState } from "react";
import Layout from "../components/Layout";
import SEO from "../components/SEO";
import Timeline from "../components/Timeline";
import { IArticle, getArticles } from "../db/articles";
import { getTags } from "../db/tags";
import prisma from "../lib/prisma";

async function generateFeed(articles: IArticle[]) {
  const siteURL = process.env.NEXT_PUBLIC_URL;

  const date = new Date();
  const feed = new RSSFeed({
    title: "bleeding edge",
    description: "bleeding edge is a feed of noteworthy developments in AI.n",
    id: siteURL,
    link: siteURL,
    image: `${siteURL}favicon/favicon-rss.jpg`,
    favicon: `${siteURL}favicon/favicon-rss.jpg`,
    copyright: `All rights reserved ${date.getFullYear()}, Jatin Sharma`,
    updated: date,
    generator: "Feed for bleedingedge.ai",
    feedLinks: {
      rss2: `${siteURL}/rss/feed.xml`, // xml format
      json: `${siteURL}/rss/feed.json`, // json fromat
    },
    author: {
      name: "Lachy Groom",
      email: "lachy@bleedingedge.ai",
      link: "https://twitter.com/bleedingedge.ao",
    },
  });

  articles.forEach((article) => {
    feed.addItem({
      title: article.title,
      id: article.source,
      link: article.source,
      description: article.summary,
      date: new Date(article.postedAt),
    });
  });

  fs.mkdirSync("./public/rss", { recursive: true });
  fs.writeFileSync("./public/rss/feed.xml", feed.rss2());
  fs.writeFileSync("./public/rss/feed.json", feed.json1());
}

export async function getStaticProps() {
  const articlesRequest = getArticles({ tags: [] });
  const tagsRequest = getTags();

  const [articles, tags] = await Promise.all([articlesRequest, tagsRequest]);

  const feed = await prisma.post.findMany({
    where: { published: true },
    include: {
      author: {
        select: { name: true },
      },
    },
  });

  await generateFeed(articles);

  return {
    props: {
      articles: JSON.parse(JSON.stringify(feed)),
      tags,
    },
    revalidate: 60, // In seconds
  };
}

export type Sort = "Latest" | "Earliest";

export default function Home({ tags, articles }) {
  const [sort, setSort] = useState<Sort>("Latest");

  return (
    <>
      <SEO title="bleeding edge" />
      <Layout tags={tags} sort={sort} setSort={setSort}>
        <Timeline sort={sort} articles={articles} />
      </Layout>
    </>
  );
}
