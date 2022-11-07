import { useState } from "react";
import styled from "styled-components";
import FilterAndSort from "../../../components/FilterAndSort";
import FilterAndSortMobile from "../../../components/FilterAndSortMobile";
import Layout from "../../../components/Layout";
import SEO from "../../../components/SEO";
import TimelineAma from "../../../components/TimelineAma";
import prisma from "../../../lib/prisma";
import { mq } from "../../../styles/mediaqueries";
import { Sort } from "../..";

export async function getServerSideProps(req, res) {
  const getArticles = prisma.post.findMany({
    where: {
      tags: { some: { name: req.query.tag } },
      authors: { some: {} },
    },
    include: {
      authors: true,
      _count: {
        select: {
          comments: {
            where: {
              authorId: {
                not: null,
              },
            },
          },
          likes: true,
        },
      },
      comments: {
        distinct: ["authorId"],
        select: {
          author: true,
        },
      },
    },
  });

  const getTags = prisma.tag.findMany();

  try {
    const [articles, tags] = await Promise.all([getArticles, getTags]);

    return {
      props: {
        articles: JSON.parse(JSON.stringify(articles)),
        tags,
        tag: req.query.tag,
      },
    };
  } catch (error) {
    return {
      props: {
        articles: [],
        tags: [],
        tag: req.query.tag,
      },
    };
  }
}

export default function AMATag({ tag, tags, articles }) {
  const [sort, setSort] = useState<Sort>("Latest");

  return (
    <>
      <SEO title={`bleeding edge | ${tag} AMAs`} />
      <Layout>
        <FilterAndSortSticky>
          <FilterAndSort tags={tags} sort={sort} setSort={setSort} />
        </FilterAndSortSticky>
        <TimelineAma sort={sort} articles={articles} />
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
