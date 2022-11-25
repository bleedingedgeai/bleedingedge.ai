import { useState } from "react";
import styled from "styled-components";
import { Tag } from "@prisma/client";
import FilterAndSort from "../../../components/FilterAndSort";
import FilterAndSortMobile from "../../../components/FilterAndSortMobile";
import Layout from "../../../components/Layout";
import SEO from "../../../components/SEO";
import TimelineAma from "../../../components/TimelineAma";
import { clean } from "../../../helpers/json";
import prisma from "../../../lib/prisma";
import { ArticleWithLike } from "../../../prisma/types";
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
        articles: clean(articles),
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

interface AMATagProps {
  tag: Tag;
  tags: Tag[];
  articles: ArticleWithLike[];
}

export default function AMATag({ tag, tags, articles }: AMATagProps) {
  const [sort, setSort] = useState<Sort>("Latest");

  return (
    <>
      <SEO title={`${tag} AMAs | bleeding edge`} />
      <Layout>
        <FilterAndSortSticky>
          <FilterAndSort tags={tags} sort={sort} setSort={setSort} />
        </FilterAndSortSticky>
        <TimelineAma articles={articles} />
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
