import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { useRouter } from "next/router";
import React from "react";
import { QueryClient, dehydrate, useQuery } from "@tanstack/react-query";
import Ama from "../../components/Ama/Ama";
import Layout from "../../components/Layout";
import SEO from "../../components/SEO";
import { clean } from "../../helpers/json";
import prisma from "../../lib/prisma";
import { authOptions } from "../api/auth/[...nextauth]";

export function formatNestedComments(comments: Array<any>) {
  const map = new Map();
  const roots = [];

  for (let i = 0; i < comments.length; i++) {
    const commentId = comments[i]?.id;
    map.set(commentId, i);
    comments[i].children = [];

    if (typeof comments[i]?.parentId === "string") {
      const parentCommentIndex: number = map.get(comments[i]?.parentId);
      comments[parentCommentIndex].children.push(comments[i]);
      continue;
    }

    roots.push(comments[i]);
  }

  return roots;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  context.res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59"
  );

  const queryClient = new QueryClient();

  const sessionRequest = unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  const [session] = await Promise.all([sessionRequest]);

  const post = await queryClient.fetchQuery(
    ["article", context.params.slug],
    async () => {
      const rawPost = await prisma.post.findUnique({
        where: {
          slug: String(context.params?.slug),
        },
        include: {
          authors: true,
          _count: {
            select: { comments: true, likes: true },
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
        return clean(rawPost);
      }

      const likes = await prisma.postLike.findMany({
        where: {
          userId: session?.user?.id,
          postId: rawPost.id,
        },
      });
      return clean({
        ...rawPost,
        liked: likes.find((like) => like.postId === rawPost.id),
      });
    }
  );

  await queryClient.fetchQuery(["comments", post.id], async () => {
    const rawComments = await prisma.comment.findMany({
      where: {
        postId: post.id,
      },
      include: {
        author: true,
        _count: {
          select: { likes: true },
        },
      },
    });

    if (!session) {
      return clean(rawComments);
    }

    const likes = await prisma.commentLike.findMany({
      where: {
        userId: session.user.id,
        commentId: {
          in: rawComments.map((comment) => comment.id),
        },
      },
    });
    const comments = rawComments.map((comment) => {
      return {
        ...comment,
        liked: likes.find((like) => like.commentId === comment.id),
      };
    });

    return clean(comments);
  });

  return {
    props: {
      session,
      article: clean(post),
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default function AmaPage({ article }) {
  const router = useRouter();
  const { data: commentsFromQuery } = useQuery({
    queryKey: ["comments", article.id],
    queryFn: async () => {
      return await (
        await fetch(`/api/articles/${article.slug}/comments`)
      ).json();
    },
  });
  const { data: articleFromQuery } = useQuery({
    queryKey: ["article", router.query.slug],
    queryFn: async () => {
      return await (await fetch(`/api/articles/${article.slug}`)).json();
    },
  });

  return (
    <>
      <SEO
        title={`bleeding edge | ${articleFromQuery.title}`}
        description={article.summary}
      />
      <Layout>
        <Ama article={articleFromQuery} comments={commentsFromQuery} />
      </Layout>
    </>
  );
}

const staticArticle = {
  id: "_static-1",
  slug: "sam-altman-and-brad-lightcap-answer-questions-about-ai-and-their-new-ai-fund",
  published: true,
  live: true,
  format: "highlight",
  postedAt: "2018-02-16T01:05:00.000Z",
  title:
    "Sam Altman and Brad Lightcap answer questions about AI and their new AI Fund",
  summary: "INSERT SUMMARY",
  content: null,
  source: "https://twitter.com/sama/status/1588622966115684352",
  score: 0,
  createdAt: "2022-11-06T21:14:56.210Z",
  updatedAt: "2022-11-06T23:53:12.474Z",
  authors: [
    {
      id: "_placeholder-sama",
      name: "Sam Altman",
      username: "sama",
      image:
        "https://pbs.twimg.com/profile_images/804990434455887872/BG0Xh7Oa_normal.jpg",
    },
    {
      id: "_placeholder-bradlightcap",
      name: "Brad Lightcap",
      username: "bradlightcap",
      image:
        "https://pbs.twimg.com/profile_images/800079870411685888/hX3vlya7_normal.jpg",
    },
  ],
  comments: [
    {
      id: "_comment-1",
      content:
        "<p>We’re doubling down on AI for email - writing / replying, prioritization, NLP-enabled querying (eg what time is my flight on Monday). What do you guys think?</p>",
      authorId: "_SohelSanghani",
      postId: "_static-1",
      parentId: null,
      createdAt: "2022-11-04T00:01:28.679Z",
      updatedAt: "2022-11-04T00:01:28.679Z",
      author: {
        id: "_SohelSanghani",
        name: "Sohel Sanghani",
        username: "SohelSanghani",
        image:
          "https://pbs.twimg.com/profile_images/1053607172708298752/n6ODsC3g_normal.jpg",
      },
      _count: {
        likes: 2,
      },
    },
    {
      id: "_comment-2",
      content:
        "<p>Any opportunities for others to get involved who aren’t currently working on an idea with a cofounder? Perhaps a list of individuals that are open to teaming up with groups that are accepted into the program?</p>",
      authorId: "_demaria_michael",
      postId: "_static-1",
      parentId: null,
      createdAt: "2022-11-04T00:01:28.679Z",
      updatedAt: "2022-11-04T00:01:28.679Z",
      author: {
        id: "_demaria_michael",
        name: "Michael DeMaria",
        username: "demaria_michael",
        image:
          "https://pbs.twimg.com/profile_images/1446355735172976645/iC5LxoyV_normal.jpg",
      },
      _count: {
        likes: 2,
      },
    },
    {
      id: "_comment-3",
      content:
        "<p>For those of you running AI/ML departments at startups, how do you handle the tension between wanting to be very transparent about problems/how you’re solving them to attract talent and not wanting to just hand over the recipe every cool thing you’ve built to your competitors?</p>",
      authorId: "_PiquantParvenu",
      postId: "_static-1",
      parentId: null,
      createdAt: "2022-11-04T00:01:37.849Z",
      updatedAt: "2022-11-04T00:01:37.849Z",
      author: {
        id: "_PiquantParvenu",
        name: "Piq",
        username: "PiquantParvenu",
        image:
          "https://pbs.twimg.com/profile_images/1565221441057853441/dM6yUwig_normal.jpg",
      },
      _count: {
        likes: 0,
      },
    },
    {
      id: "_comment-4",
      content:
        '<p>👋 hi there from <a target="_blank" rel="noopener noreferrer nofollow" class="css-4rbku5 css-18t94o4 css-901oao css-16my406 r-1cvl2hr r-1loqt21 r-poiln3 r-bcqeeo r-qvutc0" href="https://twitter.com/coqui_ai">@coqui_ai</a></p><p> what are the terms of the investment?</p>',
      authorId: "__josh_meyer_",
      postId: "_static-1",
      parentId: null,
      createdAt: "2022-11-04T00:01:40.522Z",
      updatedAt: "2022-11-04T00:01:40.522Z",
      author: {
        id: "__josh_meyer_",
        name: "Josh Meyer 🐸💬",
        username: "_josh_meyer_",
        image:
          "https://pbs.twimg.com/profile_images/1520520845919092736/iXLJk_su_normal.jpg",
      },
      _count: {
        likes: 0,
      },
    },
    {
      id: "_comment-5",
      content: "<p>10% but they are experimenting with it</p>",
      authorId: "_altryne",
      postId: "_static-1",
      parentId: "_comment-4",
      createdAt: "2022-11-04T00:04:18.541Z",
      updatedAt: "2022-11-04T00:04:18.541Z",
      author: {
        id: "_altryne",
        name: "Altryne - targum.video",
        username: "altryne",
        image:
          "https://pbs.twimg.com/profile_images/1562195233693380610/IuNqAMFz_normal.jpg",
      },
      _count: {
        likes: 2,
      },
    },
    {
      id: "_comment-6",
      content:
        "<p>other terms? e.g. are you looking for board seats? @sama</p>",
      authorId: "__josh_meyer_",
      postId: "_static-1",
      parentId: "_comment-5",
      createdAt: "2022-11-04T00:01:40.522Z",
      updatedAt: "2022-11-04T00:01:40.522Z",
      author: {
        id: "__josh_meyer_",
        name: "Josh Meyer 🐸💬",
        username: "_josh_meyer_",
        image:
          "https://pbs.twimg.com/profile_images/1520520845919092736/iXLJk_su_normal.jpg",
      },
      _count: {
        likes: 1,
      },
    },
    {
      id: "_comment-7",
      content: "<p>no board seats! no other terms of note</p>",
      authorId: "_placeholder-sama",
      postId: "_static-1",
      parentId: "_comment-6",
      createdAt: "2022-11-04T00:01:40.522Z",
      updatedAt: "2022-11-04T00:01:40.522Z",
      author: {
        id: "_placeholder-sama",
        name: "Sam Altman",
        username: "sama",
        image:
          "https://pbs.twimg.com/profile_images/804990434455887872/BG0Xh7Oa_normal.jpg",
      },
      _count: {
        likes: 0,
      },
    },
    {
      id: "_comment-8",
      content: "<p>the shortest TS in the history of the valley 😂</p>",
      authorId: "__josh_meyer_",
      postId: "_static-1",
      parentId: "_comment-7",
      createdAt: "2022-11-04T00:01:40.522Z",
      updatedAt: "2022-11-04T00:01:40.522Z",
      author: {
        id: "__josh_meyer_",
        name: "Josh Meyer 🐸💬",
        username: "_josh_meyer_",
        image:
          "https://pbs.twimg.com/profile_images/1520520845919092736/iXLJk_su_normal.jpg",
      },
      _count: {
        likes: 0,
      },
    },
    {
      id: "_comment-9",
      content:
        "<p>Does this mean OpenAI is giving up on the goal of AGI, or that the company doesn't know how to spend the extra $10 million, so its investing it in other AI companies instead?</p>",
      authorId: "_gazorp5",
      postId: "_static-1",
      parentId: null,
      createdAt: "2022-11-04T00:01:40.522Z",
      updatedAt: "2022-11-04T00:01:40.522Z",
      author: {
        id: "_gazorp5",
        name: "/",
        username: "gazorp5",
        image: null,
      },
      _count: {
        likes: 2,
      },
    },
    {
      id: "_comment-10",
      content:
        "<p>we will remain very focused on AGI, but we think there will be a _gigantic_ amount of value unlocked for the world along the way. we want to enable startups to go after it.</p>",
      authorId: "_placeholder-sama",
      postId: "_static-1",
      parentId: "_comment-9",
      createdAt: "2022-11-04T00:01:40.522Z",
      updatedAt: "2022-11-04T00:01:40.522Z",
      author: {
        id: "_placeholder-sama",
        name: "Sam Altman",
        username: "sama",
        image:
          "https://pbs.twimg.com/profile_images/804990434455887872/BG0Xh7Oa_normal.jpg",
      },
      _count: {
        likes: 24,
      },
    },
    {
      id: "_comment-11",
      content:
        "<p>No doubt that there's going to be a lot of valuable AI companies, but why OpenAI, if it doesn't fulfill the original mission of AGI?</p>",
      authorId: "_gazorp5",
      postId: "_static-1",
      parentId: "_comment-10",
      createdAt: "2022-11-04T00:01:40.522Z",
      updatedAt: "2022-11-04T00:01:40.522Z",
      author: {
        id: "_gazorp5",
        name: "/",
        username: "gazorp5",
        image: null,
      },
      _count: {
        likes: 0,
      },
    },
    {
      id: "_comment-12",
      content:
        "<p>Yes, question! I How is your program related to YC. Are you a separate entity? Are you still active advising YC founders?</p>",
      authorId: "lofelle",
      postId: "_static-1",
      parentId: null,
      createdAt: "2022-11-04T00:01:40.522Z",
      updatedAt: "2022-11-04T00:01:40.522Z",
      author: {
        id: "lofelle",
        name: "/",
        username: "Margaret",
        image:
          "https://pbs.twimg.com/profile_images/1560476986346176512/1DJlY_lc_400x400.jpg",
      },
      _count: {
        likes: 6,
      },
    },
    {
      id: "_comment-13",
      content:
        "<p>not related to YC. YC is the best accelerator in the world and i expect it to remain that way for a long time; this is very specifically to help startups rapidly come up to speed on what's about to happen with AI.</p>",
      authorId: "_placeholder-sama",
      postId: "_static-1",
      parentId: "_comment-12",
      createdAt: "2022-11-04T00:01:40.522Z",
      updatedAt: "2022-11-04T00:01:40.522Z",
      author: {
        id: "_placeholder-sama",
        name: "Sam Altman",
        username: "sama",
        image:
          "https://pbs.twimg.com/profile_images/804990434455887872/BG0Xh7Oa_normal.jpg",
      },
      _count: {
        likes: 15,
      },
    },
    {
      id: "_comment-14",
      content:
        "<p>Yes, question! I How is your program related to YC. Are you a separate entity? Are you still active advising YC founders?</p>",
      authorId: "lofelle",
      postId: "_static-1",
      parentId: "_comment-13",
      createdAt: "2022-11-04T00:01:40.522Z",
      updatedAt: "2022-11-04T00:01:40.522Z",
      author: {
        id: "lofelle",
        name: "Margaret",
        username: "lofelle",
        image:
          "https://pbs.twimg.com/profile_images/1560476986346176512/1DJlY_lc_400x400.jpg",
      },
      _count: {
        likes: 6,
      },
    },
    {
      id: "_comment-15",
      content:
        "<p>@sama can one attend both? You overlap by merely a couple of weeks.</p>",
      authorId: "nadavwiz",
      postId: "_static-1",
      parentId: "_comment-13",
      createdAt: "2022-11-04T00:01:40.522Z",
      updatedAt: "2022-11-04T00:01:40.522Z",
      author: {
        id: "nadavwiz",
        name: "Wiz",
        username: "nadavwiz",
        image:
          "https://pbs.twimg.com/profile_images/1565861869474177024/oYgB2tj2_400x400.jpg",
      },
      _count: {
        likes: 6,
      },
    },
  ],
  _count: {
    comments: 5,
    likes: 1,
  },
};
