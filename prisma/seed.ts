import Airtable from "airtable";
import { PrismaClient } from "@prisma/client";

export function slugify(string) {
  const a =
    "àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìıİłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;";
  const b =
    "aaaaaaaaaacccddeeeeeeeegghiiiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------";
  const p = new RegExp(a.split("").join("|"), "g");

  return string
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(p, (c) => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^\w\-]+/g, "") // Remove all non-word characters
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}

export interface Article {
  title: string;
  blurb: string;
  postedAt: Date;
  url: string;
  tags: string[];
  format: string;
}

const prisma = new PrismaClient();

Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.AIRTABLE_API_KEY,
});

const base: Airtable.Base = Airtable.base(process.env.AIRTABLE_BASE_ID);

async function main() {
  try {
    await prisma.tag.deleteMany({});
    await prisma.post.deleteMany({});
  } catch (error) {
    console.error(error);
  }

  const articles: Article[] = await new Promise((resolve, reject) => {
    const articles = [];
    const select = {
      filterByFormula: ``,
      offset: 0,
    };

    base("articles")
      .select(select)
      .eachPage(
        (records, fetchNextPage) => {
          records.map((record) => {
            articles.push({
              title: record.get("title"),
              blurb: record.get("blurb") || null,
              postedAt: record.get("posted_at"),
              url: record.get("url"),
              tags: record.get("tags") || [],
              format: record.get("format") || null,
              thanks_to: record.get("thanks_to") || null,
            });
          });
          fetchNextPage();
        },
        function done(err) {
          if (err) {
            console.error(err);
            reject();
            return;
          }

          resolve(articles);
        }
      );
  });

  const response = (await new Promise((resolve) => {
    const tags = [];
    const select = { filterByFormula: ``, offset: 0 };
    base("articles")
      .select(select)
      .eachPage(function page(records) {
        records.map((record) => {
          tags.push(record.get("tags") || []);
        });
        resolve(tags);
      });
  })) as string[][];

  // Flatten the list of arrays
  const reducedTags = response.reduce((prev, tags) => [...prev, ...tags], []);

  const allTags = reducedTags
    .filter((item, pos) => reducedTags.indexOf(item) == pos) // Remove duplicates
    .sort((a, b) => a.localeCompare(b)); // sort tags alphabetically

  await prisma.tag.createMany({
    data: allTags.map((t) => ({ name: t })),
  });
  const createdTags = await prisma.tag.findMany({});

  const createArticles = articles.map((a) => {
    const tags = {
      connect: a.tags?.map((t) => ({
        id: createdTags.find((ct) => ct.name === t)?.id,
      })),
    };

    return prisma.post.create({
      data: {
        published: true,
        postedAt: a.postedAt,
        title: a.title,
        slug: slugify(a.title),
        summary: a.blurb,
        format: a.format,
        source: a.url,
        score: 0,
        ...(a.tags.length > 0 ? { tags } : {}),
      },
    });
  });

  const res = await Promise.all(createArticles);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
