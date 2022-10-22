export interface IArticle {
  title: string;
  blurb: string;
  posted_at: Date;
  url: string;
  tags: string[];
  format: string;
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
