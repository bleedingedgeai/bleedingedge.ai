type Tag = string;

export const getTags = async (): Promise<Tag[]> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/tags`);
  return response.json();
};
