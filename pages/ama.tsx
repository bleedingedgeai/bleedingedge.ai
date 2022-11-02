import { unstable_getServerSession } from "next-auth";
import { useState } from "react";
import styled from "styled-components";
import { QueryClient, dehydrate, useQuery } from "@tanstack/react-query";
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
  const queryClient = new QueryClient();
  const sessionRequest = unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  const tagsRequest = prisma.tag.findMany({});
  const [session, tags] = await Promise.all([sessionRequest, tagsRequest]);

  const articlesRequest = prisma.post.findMany({
    where: { authors: { some: {} } },
    include: {
      authors: true,
      _count: {
        select: { comments: true, likes: true },
      },
    },
  });

  await queryClient.fetchQuery(["ama"], async () => {
    const rawPosts = await prisma.post.findMany({
      where: { authors: { some: {} } },
      include: {
        authors: true,
        _count: {
          select: { comments: true, likes: true },
        },
      },
    });
    const likes = await prisma.postLike.findMany({
      where: {
        userId: session.user.id,
        postId: {
          in: rawPosts.map((comment) => comment.id),
        },
      },
    });
    const posts = rawPosts.map((post) => {
      return {
        ...post,
        liked: likes.find((like) => like.postId === post.id),
      };
    });

    return JSON.parse(JSON.stringify(posts));
  });

  return {
    props: {
      session,
      tags,
      dehydratedState: dehydrate(queryClient),
    },
  };
}

export default function Ama({ tags }) {
  const [sort, setSort] = useState<Sort>("Latest");

  const { data: articleFromQuery } = useQuery<any>({
    queryKey: ["ama"],
    queryFn: async () => {},
  });

  return (
    <>
      <SEO
        title="bleeding edge | Ask me anything"
        image="/assets/meta/be-meta-AMA.jpg"
      />
      <Layout>
        <FilterAndSortSticky>
          <FilterAndSort tags={tags} sort={sort} setSort={setSort} />
        </FilterAndSortSticky>
        <TimelineAma sort={sort} articles={articleFromQuery} />
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
