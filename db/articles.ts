export interface IArticle {
  title: string;
  summary: string;
  postedAt: Date;
  source: string;
  tags: string[];
  format: string;
  thanks_to: string;
}

export const getArticles = async ({
  tags,
}: {
  tags: string[];
}): Promise<IArticle[]> => {
  const tagsParam = tags.length > 0 ? `?tags=${tags.join(",")}` : "";

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/articles${tagsParam}`
  );

  return response.json();
};
