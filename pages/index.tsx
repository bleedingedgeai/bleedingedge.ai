import fs from "fs";
import { Feed as RSSFeed } from "feed";
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

async function generateFeed(articles) {
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
  const articlesRequest = await prisma.post.findMany({
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
  const tagsRequest = prisma.tag.findMany();

  const liveArticleRequest = await prisma.post.findFirst({
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

  const [articles, liveArticle, tags] = await Promise.all([
    articlesRequest,
    liveArticleRequest,
    tagsRequest,
  ]);

  await generateFeed(articles);

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
