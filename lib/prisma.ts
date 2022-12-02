import { PrismaClient } from "@prisma/client";
import { slugify } from "../helpers/string";

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

prisma.$use(async (params, next) => {
  if (
    (params.action === "create" || params.action === "update") &&
    ["Post"].includes(params.model)
  ) {
    const {
      args: { data },
    } = params;
    data.slug = slugify(data.title);
  }
  const result = await next(params);
  return result;
});

export default prisma;
