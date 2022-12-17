import {
  UseMutationResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

interface CommentMutationsProps {
  onCreate?: () => void;
  onUpdate?: () => void;
  onDelete?: () => void;
}

export function useArticleMutations({
  onCreate,
  onUpdate,
  onDelete,
}: CommentMutationsProps): {
  create: UseMutationResult;
  update: UseMutationResult;
  delete: UseMutationResult;
} {
  const ARTICLES_KEY = ["articles"];
  const queryClient = useQueryClient();

  ///////////////////////////////////////////////////////////////////
  // CREATE
  ///////////////////////////////////////////////////////////////////

  const createUpdate = useMutation({
    mutationKey: ARTICLES_KEY,
    mutationFn: (body: any) => {
      return fetch(`/api/article`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    },
    onMutate: async (newArticle) => {
      await queryClient.cancelQueries({ queryKey: ARTICLES_KEY });
      const previousArticles = queryClient.getQueryData(ARTICLES_KEY);

      queryClient.setQueryData(ARTICLES_KEY, (old: any) => {
        return [newArticle, ...old];
      });

      onCreate?.();
      return { previousArticles };
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(ARTICLES_KEY, context.previousArticles);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ARTICLES_KEY });
    },
  });
  ///////////////////////////////////////////////////////////////////
  // UPDATE
  ///////////////////////////////////////////////////////////////////

  const updateMutation = useMutation({
    mutationKey: ARTICLES_KEY,
    mutationFn: ({ body, articleId }: { body: any; articleId: string }) => {
      return fetch(`/api/article/${articleId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    },
    onMutate: async ({ body, articleId }) => {
      await queryClient.cancelQueries({ queryKey: ARTICLES_KEY });
      const previousArticles = queryClient.getQueryData(ARTICLES_KEY);

      queryClient.setQueryData(ARTICLES_KEY, (articles: any[]) => {
        return articles.map((article) => {
          if (article.id == articleId) {
            return { ...article, ...body, updatedAt: new Date() };
          }

          return article;
        });
      });

      onUpdate?.();
      return { previousArticles };
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(ARTICLES_KEY, context.previousArticles);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ARTICLES_KEY });
    },
  });

  ///////////////////////////////////////////////////////////////////
  // DELETE
  ///////////////////////////////////////////////////////////////////

  const deleteMutation = useMutation({
    mutationKey: ARTICLES_KEY,
    mutationFn: (articleId: string) => {
      return fetch(`/api/article/${articleId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
    },
    onMutate: async (articleId) => {
      await queryClient.cancelQueries({ queryKey: ARTICLES_KEY });
      const previousArticles = queryClient.getQueryData(ARTICLES_KEY);

      queryClient.setQueryData(ARTICLES_KEY, (articles: any[]) => {
        return articles.filter((article) => {
          return article.id !== articleId;
        });
      });

      onDelete?.();
      return { previousArticles };
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(ARTICLES_KEY, context.previousArticles);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ARTICLES_KEY });
    },
  });

  return {
    create: createUpdate,
    update: updateMutation,
    delete: deleteMutation,
  };
}
