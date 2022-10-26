import fs from "fs";
import { Feed as RSSFeed } from "feed";
import Feed from "../components/Feed";
import SEO from "../components/SEO";
import { IArticle, getArticles } from "../db/articles";
import { getTags } from "../db/tags";

async function generateFeed(articles: IArticle[]) {
  const siteURL = process.env.VERCEL_URL;

  const date = new Date();
  const feed = new RSSFeed({
    title: "bleeding edge",
    description: "bleeding edge is a feed of noteworthy developments in AI.n",
    id: siteURL,
    link: siteURL,
    image: `${siteURL}/assets/meta/be-meta.jpg`,
    favicon: `${siteURL}/favicon/favicon-light@2x.png`,
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
