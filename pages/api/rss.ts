import { Feed } from "feed";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";

async function generateFeed(articles) {
  const siteURL = process.env.NEXT_PUBLIC_URL;

  const date = new Date();
  const feed = new Feed({
    title: "bleeding edge",
    description: "bleeding edge is a feed of noteworthy developments in AI.n",
    id: siteURL,
    link: siteURL,
    image: `${siteURL}favicon/favicon-rss.jpg`,
    favicon: `${siteURL}favicon/favicon-rss.jpg`,
    copyright: `All rights reserved ${date.getFullYear()}, Jatin Sharma`,
    updated: date,
    generator: "Feed for bleedingedge.ai",
    feedLinks: {
      rss2: `${siteURL}/rss/feed.xml`, // xml format
      json: `${siteURL}/rss/feed.json`, // json fromat
    },
    author: {
      name: "Lachy Groom",
      email: "lachy@bleedingedge.ai",
      link: "https://twitter.com/bleedingedge.ao",
    },
  });

  articles.forEach((article) => {
    feed.addItem({
      title: article.title,
      id: article.source,
      link: article.source,
      description: article.summary,
      date: new Date(article.postedAt),
    });
  });

  return {
    json: feed.json1(),
    xml: feed.rss2(),
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const articles = await prisma.post.findMany({
      where: { published: true },
      include: {
        authors: {
          select: { name: true },
        },
      },
    });

    const { format } = req.query;
    const { json, xml } = await generateFeed(articles);

    if (format === "json") {
      res.setHeader("Content-Type", "application/json");
      return res.status(200).send(json);
    }

    res.setHeader("Content-Type", "text/xml");
    return res.status(200).send(xml);
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
}
