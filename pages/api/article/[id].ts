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

    const id = req.query.id as string;

    if (req.method === "DELETE") {
      await prisma.post.delete({ where: { id } });
      return res.status(204);
    }

    if (req.method === "PATCH") {
      const body = req.body;
      const patchedPost = await prisma.post.update({
        where: { id },
        data: {
          slug: slugify(body.title),
          postedAt: body.postedAt,
          title: body.title,
          summary: body.summary,
          source: body.source,
        },
      });
      return res.status(201).json(clean(patchedPost));
    }
  } catch (error) {
    res.status(500);
  }
}

export default withMethods(["PATCH", "DELETE"], handler);
