import { useState } from "react";
import Layout from "../../components/Layout";
import SEO from "../../components/SEO";
import Timeline from "../../components/Timeline";
import prisma from "../../lib/prisma";
import { Sort } from "..";

export async function getStaticPaths() {
  const tags = await prisma.tag.findMany();
  const paths = tags.map((tag) => ({ params: { tag: tag.name } }));

  return { paths, fallback: false };
}

// This also gets called at build time
export async function getStaticProps({ params }) {
  const getArticles = prisma.post.findMany({
    where: {
      tags: { some: { name: params.tag } },
    },
    include: {
      _count: {
        select: {
          comments: true,
        },
      },
      authors: true,
    },
  });

  const getTags = prisma.tag.findMany();

  try {
    const [articles, tags] = await Promise.all([getArticles, getTags]);
    return {
      props: {
        articles: JSON.parse(JSON.stringify(articles)),
        tags,
        tag: params.tag,
      },
      revalidate: 60, // In seconds
    };
  } catch (error) {
    return {
      props: {
        articles: [],
        tags: [],
        tag: params.tag,
      },
      revalidate: 60, // In seconds
    };
  }
}

export default function Home({ tag, tags, articles }) {
  const [sort, setSort] = useState<Sort>("Latest");

  return (
    <>
      <SEO title={`bleeding edge | ${tag}`} />
      <Layout tags={tags} sort={sort} setSort={setSort}>
        <Timeline sort={sort} articles={articles} />
      </Layout>
    </>
  );
}
