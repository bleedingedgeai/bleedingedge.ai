import { NextApiRequest, NextApiResponse } from "next";
import { verifySignature } from "@upstash/qstash/nextjs";
import { slugify } from "../../helpers/string";
import { withMethods } from "../../lib/middleware/withMethods";
import prisma from "../../lib/prisma";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const articles = await prisma.post.findMany({
      where: { authors: { some: {} } },
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

    const baseUrl = `${process.env.NEXT_PUBLIC_URL}/ama`;
    const endpoints = [baseUrl];
    const requests = [fetch(baseUrl)];

    articles.forEach((article) => {
      const endpoint = `${baseUrl}/${slugify(article.title)}`;
      endpoints.push(endpoint);
      requests.push(fetch(endpoint));
    });

    await Promise.all(requests);

    res.status(200).json({
      success: true,
      url: process.env.NEXT_PUBLIC_URL,
      endpoints,
    });
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
}

export default verifySignature(handler);

export const config = {
  api: {
    bodyParser: false,
  },
};
