import { useState } from "react";
import styled from "styled-components";
import Banner from "../../components/Banner";
import FilterAndSort from "../../components/FilterAndSort";
import FilterAndSortMobile from "../../components/FilterAndSortMobile";
import Layout from "../../components/Layout";
import SEO from "../../components/SEO";
import Timeline from "../../components/Timeline";
import prisma from "../../lib/prisma";
import { mq } from "../../styles/mediaqueries";
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

  const liveArticleRequest = await prisma.post.findFirst({
    where: { live: true },
    include: {
      authors: true,
    },
  });

  try {
    const [articles, liveArticle, tags] = await Promise.all([
      getArticles,
      liveArticleRequest,
      getTags,
    ]);
    return {
      props: {
        articles: JSON.parse(JSON.stringify(articles)),
        liveArticle: JSON.parse(JSON.stringify(liveArticle)),
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

export default function Tag({ tag, tags, articles, liveArticle }) {
  const [sort, setSort] = useState<Sort>("Latest");

  return (
    <>
      <SEO title={`bleeding edge | ${tag}`} />
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
