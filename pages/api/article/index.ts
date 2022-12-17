import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { clean } from "../../../helpers/json";
import { slugify } from "../../../helpers/string";
import { withMethods } from "../../../lib/middleware/withMethods";
import prisma from "../../../lib/prisma";
import { ADMINS } from "../../admin";
import { authOptions } from "../auth/[...nextauth]";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await unstable_getServerSession(req, res, authOptions);
    if (!session || !ADMINS.includes(session.user.username)) {
      return res.status(401);
    }

    if (req.method === "GET") {
      const posts = await prisma.post.findMany({});
      return res.status(200).json(clean(posts));
    }
    if (req.method === "POST") {
      const body = req.body;
      const data = {
        slug: slugify(body.title),
        format: body.format,
        postedAt: body.postedAt,
        title: body.title,
        summary: body.summary,
        source: body.source,
      };

      const post = await prisma.post.create({ data });
      return res.status(200).json(clean(post));
    }
  } catch (error) {
    res.status(500);
  }
}

export default withMethods(["GET", "POST"], handler);
