<<<<<<< HEAD
// import fs from "fs";
// import { Feed as RSSFeed } from "feed";
import { unstable_getServerSession } from "next-auth";
import { useState } from "react";
import styled from "styled-components";
import Banner from "../components/Banner";
import FilterAndSort from "../components/FilterAndSort";
import FilterAndSortMobile from "../components/FilterAndSortMobile";
import Layout from "../components/Layout";
import SEO from "../components/SEO";
import Timeline from "../components/Timeline";
import prisma from "../lib/prisma";
import { mq } from "../styles/mediaqueries";
import { authOptions } from "./api/auth/[...nextauth]";

// async function generateFeed(articles: IArticle[]) {
//   const siteURL = process.env.NEXT_PUBLIC_URL;

//   const date = new Date();
//   const feed = new RSSFeed({
//     title: "bleeding edge",
//     description: "bleeding edge is a feed of noteworthy developments in AI.n",
//     id: siteURL,
//     link: siteURL,
//     image: `${siteURL}favicon/favicon-rss.jpg`,
//     favicon: `${siteURL}favicon/favicon-rss.jpg`,
//     copyright: `All rights reserved ${date.getFullYear()}, Jatin Sharma`,
//     updated: date,
//     generator: "Feed for bleedingedge.ai",
//     feedLinks: {
//       rss2: `${siteURL}/rss/feed.xml`, // xml format
//       json: `${siteURL}/rss/feed.json`, // json fromat
//     },
//     author: {
//       name: "Lachy Groom",
//       email: "lachy@bleedingedge.ai",
//       link: "https://twitter.com/bleedingedge.ao",
//     },
//   });

//   articles.forEach((article) => {
//     feed.addItem({
//       title: article.title,
//       id: article.source,
//       link: article.source,
//       description: article.summary,
//       date: new Date(article.postedAt),
//     });
//   });

//   fs.mkdirSync("./public/rss", { recursive: true });
//   fs.writeFileSync("./public/rss/feed.xml", feed.rss2());
//   fs.writeFileSync("./public/rss/feed.json", feed.json1());
// }

export async function getServerSideProps(context) {
  const sessionRequest = unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );
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
    },
  });

  const [session, articles, liveArticle, tags] = await Promise.all([
    sessionRequest,
    articlesRequest,
    liveArticleRequest,
    tagsRequest,
  ]);

  return {
    props: {
      session,
      articles: JSON.parse(JSON.stringify(articles)),
      liveArticle: JSON.parse(JSON.stringify(liveArticle)),
      tags,
    },
  };
}

export type Sort = "Latest" | "Earliest";

export default function Home({ tags, articles, liveArticle }) {
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
=======
import fs from "fs";
import { Feed as RSSFeed } from "feed";
import Feed from "../components/Feed";
import SEO from "../components/SEO";
import { IArticle, getArticles } from "../db/articles";
import { getTags } from "../db/tags";

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
      id: article.url,
      link: article.url,
      description: article.blurb,
      date: new Date(article.posted_at),
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

  await generateFeed(articles);

  return {
    props: {
      articles,
      tags,
    },
    revalidate: 60, // In seconds
  };
}

export default function Home(props) {
  return (
    <>
      <SEO title="bleeding edge" />
      <Feed tags={props.tags} articles={props.articles} />
    </>
  );
}
>>>>>>> 10f57a2021271330ad35f9d0df39bb867288f16e
