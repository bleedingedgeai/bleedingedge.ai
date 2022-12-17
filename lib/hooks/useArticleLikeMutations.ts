import { useRouter } from "next/router";
import {
  UseMutationResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

interface CommentMutationsProps {
  onLike?: () => void;
}

export function useArticleLikeMutations({ onLike }: CommentMutationsProps): {
  like: UseMutationResult;
} {
  const router = useRouter();
  const ARTICLE_KEY = ["article", router.query.slug];
  const queryClient = useQueryClient();

  ///////////////////////////////////////////////////////////////////
  // LIKE
  ///////////////////////////////////////////////////////////////////

  const likeMutation = useMutation({
    mutationKey: ARTICLE_KEY,
    mutationFn: ({ postId, userId, slug }: any) => {
      return fetch(`/api/articles/${slug}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, userId }),
      });
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ARTICLE_KEY });
      const previousArticle = queryClient.getQueryData(ARTICLE_KEY);

      queryClient.setQueryData(ARTICLE_KEY, (old: any) => {
        const shouldLike = !old.liked;

        return {
          ...old,
          _count: {
            ...old._count,
            likes: shouldLike ? old._count.likes + 1 : old._count.likes - 1,
          },
          liked: shouldLike,
        };
      });

      onLike?.();
      return { previousArticle };
    },
    onError: (err, newLike, context) => {
      queryClient.setQueryData(ARTICLE_KEY, context.previousArticle);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ARTICLE_KEY });
    },
  });

  return {
    like: likeMutation,
  };
}
