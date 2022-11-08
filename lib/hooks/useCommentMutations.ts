import { useSession } from "next-auth/react";
import {
  UseMutationResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

interface CommentMutationsProps {
  article: any;
  onLike?: () => void;
  onCreate?: () => void;
  onUpdate?: () => void;
  onDelete?: () => void;
}

export function useCommentMutations({
  article,
  onLike,
  onCreate,
  onUpdate,
  onDelete,
}: CommentMutationsProps): {
  create: UseMutationResult;
  update: UseMutationResult;
  delete: UseMutationResult;
  like: UseMutationResult;
} {
  const COMMENTS_KEY = ["comments", article.id];
  const queryClient = useQueryClient();
  const session = useSession();

  ///////////////////////////////////////////////////////////////////
  // CREATE
  ///////////////////////////////////////////////////////////////////

  const createMutation = useMutation({
    mutationKey: COMMENTS_KEY,
    mutationFn: (newComment: any) => {
      return fetch(`/api/articles/${article.slug}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newComment),
      });
    },
    onMutate: async (newComment) => {
      await queryClient.cancelQueries({ queryKey: COMMENTS_KEY });
      const previousComments = queryClient.getQueryData(COMMENTS_KEY);

      if (!session?.data) {
        return { previousComments };
      }

      queryClient.setQueryData(COMMENTS_KEY, (old) => [
        ...(old as any),
        {
          ...newComment,
          updatedAt: new Date(),
          createdAt: new Date(),
          _count: { likes: 0 },
          liked: false,
          author: {
            name: session?.data.user.name,
            username: session?.data.user.username,
            id: session?.data.user.id,
            image: session?.data.user.image,
          },
        },
      ]);

      onCreate?.();
      return { previousComments };
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(COMMENTS_KEY, context.previousComments);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: COMMENTS_KEY });
    },
  });

  ///////////////////////////////////////////////////////////////////
  // UPDATE
  ///////////////////////////////////////////////////////////////////

  const updateMutation = useMutation({
    mutationKey: COMMENTS_KEY,
    mutationFn: ({ content, commentId }: any) => {
      return fetch(`/api/articles/${article.slug}/comments/${commentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId, content }),
      });
    },
    onMutate: async ({ commentId, content }) => {
      await queryClient.cancelQueries({ queryKey: COMMENTS_KEY });
      const previousComments = queryClient.getQueryData(COMMENTS_KEY);

      if (!session?.data) {
        return { previousComments };
      }

      queryClient.setQueryData(COMMENTS_KEY, (comments: any) => {
        return comments.map((comment) => {
          if (comment.id == commentId) {
            return { ...comment, content, updatedAt: new Date() };
          }

          return comment;
        });
      });

      onUpdate?.();
      return { previousComments };
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(COMMENTS_KEY, context.previousComments);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: COMMENTS_KEY });
    },
  });

  ///////////////////////////////////////////////////////////////////
  // DELETE
  ///////////////////////////////////////////////////////////////////

  const deleteMutation = useMutation({
    mutationKey: COMMENTS_KEY,
    mutationFn: (commentId: string) => {
      return fetch(`/api/articles/${article.slug}/comments/${commentId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
    },
    onMutate: async (commentId) => {
      await queryClient.cancelQueries({ queryKey: COMMENTS_KEY });
      const previousComments = queryClient.getQueryData(COMMENTS_KEY);

      queryClient.setQueryData(COMMENTS_KEY, (comments: any) => {
        return comments.map((comment) => {
          if (comment.id == commentId) {
            comment.authorId = null;
            delete comment.author;

            return comment;
          }

          return comment;
        });
      });

      onDelete?.();
      return { previousComments };
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(COMMENTS_KEY, context.previousComments);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: COMMENTS_KEY });
    },
  });

  ///////////////////////////////////////////////////////////////////
  // LIKE
  ///////////////////////////////////////////////////////////////////

  const likeMutation = useMutation({
    mutationKey: COMMENTS_KEY,
    mutationFn: ({ commentId, userId }: any) => {
      return fetch(`/api/articles/${article.slug}/comments/${commentId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId, userId }),
      });
    },
    onMutate: async (newComment) => {
      await queryClient.cancelQueries({ queryKey: COMMENTS_KEY });
      const previousComments = queryClient.getQueryData(COMMENTS_KEY);

      queryClient.setQueryData(COMMENTS_KEY, (comments: any) => {
        return comments.map((comment) => {
          if (comment.id == newComment.commentId) {
            const shouldLike = !comment.liked;

            return {
              ...comment,
              _count: {
                ...comment._count,
                likes: shouldLike
                  ? comment._count.likes + 1
                  : comment._count.likes - 1,
              },
              liked: shouldLike,
            };
          }

          return comment;
        });
      });

      onLike?.();
      return { previousComments };
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(COMMENTS_KEY, context.previousComments);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: COMMENTS_KEY });
    },
  });

  return {
    like: likeMutation,
    create: createMutation,
    update: updateMutation,
    delete: deleteMutation,
  };
}
