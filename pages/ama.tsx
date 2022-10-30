import fs from "fs";
import { Feed as RSSFeed } from "feed";
import Feed from "../components/Feed";
import SEO from "../components/SEO";
import { IArticle, getArticles } from "../db/articles";
import { getTags } from "../db/tags";

export async function getStaticProps() {
  const articlesRequest = getArticles({ tags: [] });
  const tagsRequest = getTags();

  const [articles, tags] = await Promise.all([articlesRequest, tagsRequest]);

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
