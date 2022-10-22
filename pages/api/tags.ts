import Airtable from "airtable";
import { NextApiRequest, NextApiResponse } from "next";

Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.AIRTABLE_API_KEY,
});

const base: Airtable.Base = Airtable.base(process.env.AIRTABLE_BASE_ID);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const response = (await new Promise((resolve, reject) => {
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
  const allTags = response.reduce((prev, tags) => [...prev, ...tags], []);

  const tags = allTags
    .filter((item, pos) => allTags.indexOf(item) == pos) // Remove duplicates
    .sort((a, b) => a.localeCompare(b)); // sort tags alphabetically

  res.status(200).json(tags);
}
