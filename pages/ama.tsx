import { unstable_getServerSession } from "next-auth";
import { useState } from "react";
import Layout from "../components/Layout";
import SEO from "../components/SEO";
import TimelineAma from "../components/TimelineAma";
import { getTags } from "../db/tags";
import prisma from "../lib/prisma";
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
        select: { comments: true },
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

export default function Ama(props) {
  const [sort, setSort] = useState<Sort>("Latest");

  return (
    <>
      <SEO title="bleeding edge" />
      <Layout tags={props.tags} sort={sort} setSort={setSort}>
        <TimelineAma sort={sort} articles={props.articles} />
      </Layout>
    </>
  );
}
