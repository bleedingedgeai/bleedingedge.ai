import { unstable_getServerSession } from "next-auth";
import { useState } from "react";
import styled from "styled-components";
import { Post, PostLike, Tag, User } from "@prisma/client";
import { QueryClient, dehydrate, useQuery } from "@tanstack/react-query";
import FilterAndSort from "../components/FilterAndSort";
import FilterAndSortMobile from "../components/FilterAndSortMobile";
import Layout from "../components/Layout";
import SEO from "../components/SEO";
import TimelineAma from "../components/TimelineAma";
import { staticAmas } from "../db/static";
import { clean } from "../helpers/json";
import prisma from "../lib/prisma";
import { ArticleWithLike } from "../prisma/types";
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
  const [session, tags] = await Promise.all([sessionRequest, tagsRequest]);

  const queryClient = new QueryClient();
  await queryClient.fetchQuery(["articles"], async () => {
    const rawPosts = await prisma.post.findMany({
      where: { authors: { some: {} }, published: true },
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

    if (!session) {
      return clean([...rawPosts, ...staticAmas]);
    }

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

    return clean([...posts, ...staticAmas]);
  });

  return {
    props: {
      session,
      tags,
      dehydratedState: dehydrate(queryClient),
    },
  };
}

export default function Ama({ tags }: { tags: Tag[] }) {
  const [sort, setSort] = useState<Sort>("Latest");

  const { data: articleFromQuery } = useQuery<ArticleWithLike[]>({
    queryKey: ["articles"],
    queryFn: async () => {
      return await (await fetch(`/api/articles`)).json();
    },
  });

  return (
    <>
      <SEO title="AMAs | bleeding edge" image="/assets/meta/be-meta-AMA.jpg" />
      <Layout>
        <FilterAndSortSticky>
          <FilterAndSort tags={tags} sort={sort} setSort={setSort} />
        </FilterAndSortSticky>
        <TimelineAma articles={articleFromQuery} />
      </Layout>
      <FilterAndSortMobile tags={tags} sort={sort} setSort={setSort} />
    </>
  );
}

const FilterAndSortSticky = styled.div`
  position: sticky;
  top: 40px;
  z-index: 210000;
  margin-right: -18px;

  ${mq.desktopSmall} {
    top: 121px;
  }

  ${mq.phablet} {
    top: 112px;
  }
`;
