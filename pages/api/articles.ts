import Airtable from "airtable";
import { NextApiRequest } from "next";

Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.AIRTABLE_API_KEY,
});

const base: Airtable.Base = Airtable.base(process.env.AIRTABLE_BASE_ID);

export interface Article {
  title: string;
  blurb: string;
  posted_at: Date;
  url: string;
  tags: string[];
  format: string[];
}

export default async function handler(req: NextApiRequest, res) {
  const tags = (req.query.tags as string)?.split(",");

  const articles = await new Promise((resolve) => {
    const articles = [];
    const select = {
      filterByFormula: ``,
      offset: 0,
    };

    if (tags) {
      if (tags.length === 1) {
        select.filterByFormula = `FIND("${tags[0]}", tags)`;
      } else {
        select.filterByFormula = `OR(${tags
          .map((tag) => `FIND("${tag}", tags)`)
          .join(",")})`;
      }
    }

    base("articles")
      .select(select)
      .eachPage(function page(records) {
        records.map((record) => {
          articles.push({
            title: record.get("title"),
            blurb: record.get("blurb") || null,
            posted_at: record.get("posted_at"),
            url: record.get("url"),
            tags: record.get("tags") || null,
            format: record.get("format") || null,
          });
        });
        resolve(articles.filter((a) => a.title && a.posted_at));
      });
  });

  res.status(200).json(articles);
}
