// import fs from "fs";
// import { Feed as RSSFeed } from "feed";
import { unstable_getServerSession } from "next-auth";
import { useState } from "react";
import Layout from "../components/Layout";
import SEO from "../components/SEO";
import Timeline from "../components/Timeline";
import prisma from "../lib/prisma";
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

  const [session, articles, tags] = await Promise.all([
    sessionRequest,
    articlesRequest,
    tagsRequest,
  ]);

  return {
    props: {
      session,
      articles: JSON.parse(JSON.stringify(articles)),
      tags,
    },
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
