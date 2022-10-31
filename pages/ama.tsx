import { unstable_getServerSession } from "next-auth";
import { useState } from "react";
import styled from "styled-components";
import FilterAndSort from "../components/FilterAndSort";
import FilterAndSortMobile from "../components/FilterAndSortMobile";
import Layout from "../components/Layout";
import SEO from "../components/SEO";
import TimelineAma from "../components/TimelineAma";
import { getTags } from "../db/tags";
import prisma from "../lib/prisma";
import { mq } from "../styles/mediaqueries";
import { authOptions } from "./api/auth/[...nextauth]";
import { Sort } from ".";

export async function getServerSideProps(context) {
  const sessionRequest = unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  const tagsRequest = prisma.tag.findMany({});

  const articlesRequest = prisma.post.findMany({
    where: { authors: { some: {} } },
    include: {
      authors: true,
      _count: {
        select: { comments: true, votes: true },
      },
    },
  });

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

export default function Ama({ tags, articles }) {
  const [sort, setSort] = useState<Sort>("Latest");

  return (
    <>
      <SEO title="bleeding edge | Ask me anything" />
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
