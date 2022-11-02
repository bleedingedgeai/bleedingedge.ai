import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { useSession } from "next-auth/react";
import { Fragment, useCallback, useContext } from "react";
import styled from "styled-components";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clamp } from "../helpers/numbers";
import { theme } from "../styles/theme";
import Avatar from "./Avatar";
import Badge from "./Badge";
import IconAma from "./Icons/IconAma";
import IconDelete from "./Icons/IconDelete";
import IconEdit from "./Icons/IconEdit";
import IconLike from "./Icons/IconLike";
import IconLiked from "./Icons/IconLiked";
import IconReplied from "./Icons/IconReplied";
import IconReply from "./Icons/IconReply";
import { OverlayContext, OverlayType } from "./Overlay";

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo("en-US");

export default function Comments(props) {
  return <CommentsRecursive {...props} />;
}

function CommentsRecursive({
  article,
  comments,
  index: parentIndex = 0,
  parentId,
  setParentId,
}) {
  const session = useSession();
  const { showOverlay } = useContext(OverlayContext);

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: ["comments", article.id],
    mutationFn: (like: any) => {
      return fetch("/api/comments/like", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(like),
      });
    },
    onMutate: async (newComment) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: ["comments", article.id],
      });

      // Snapshot the previous value
      const previousComments = queryClient.getQueryData([
        "comments",
        article.id,
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData(["comments", article.id], (comments: any) => {
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

      // Return a context object with the snapshotted value
      return { previousComments };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(
        ["comments", article.id],
        context.previousComments
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", article.id] });
    },
  });

  const handleLike = (event: React.MouseEvent, comment) => {
    event.preventDefault();
    event.stopPropagation();
    if (session.status === "unauthenticated") {
      return showOverlay(OverlayType.AUTHENTICATION);
    }

    mutation.mutate({
      userId: session.data.user.id,
      commentId: comment.id,
    });
  };

  if (!comments) {
    return null;
  }

  return (
    <>
      {comments.map((comment) => {
        const isHost = article.authors.some((a) => a.id === comment.author.id);
        const isOwn = session?.data?.user.id === comment.author.id;
        const hasReplies = comment.children.length > 0;

        return (
          <Fragment key={comment.id + comment.content}>
            <Container
              style={{
                paddingLeft: clamp(parentIndex * 42, 0, 42),
                opacity: parentId ? (parentId === comment.id ? 1 : 0.36) : 1,
              }}
            >
              {hasReplies && (
                <Connection
                  style={{
                    paddingLeft: parentIndex * 42 + 9,
                  }}
                >
                  <ConnectionLine />
                </Connection>
              )}
              <Avatar
                src={comment.author.image}
                outline={isHost}
                highlight={isHost}
              />

              <div>
                <Author>
                  <Name>{comment.author.name}</Name> ·{" "}
                  {timeAgo.format(new Date(comment.updatedAt))}
                  {isHost && (
                    <BadgeContainer>
                      <Badge />
                    </BadgeContainer>
                  )}
                </Author>
                <Content isHost={isHost}>{comment.content}</Content>
                <Bottom>
                  <Actions>
                    <Action>
                      <StyledButton
                        onClick={(event) => handleLike(event, comment)}
                      >
                        {comment.liked ? <IconLiked /> : <IconLike />}{" "}
                        <span
                          style={
                            comment.liked ? { color: theme.colors.white } : {}
                          }
                        >
                          {comment._count?.likes}
                        </span>
                      </StyledButton>
                    </Action>
                    <Action>
                      <StyledButton onClick={() => setParentId(comment.id)}>
                        {hasReplies ? <IconReplied /> : <IconReply />}{" "}
                        <span>reply</span>
                      </StyledButton>
                    </Action>
                    {isOwn && (
                      <>
                        <Action>
                          <StyledButton onClick={() => setParentId(comment.id)}>
                            <IconEdit /> <span>Edit</span>
                          </StyledButton>
                        </Action>
                        <Action>
                          <StyledButton onClick={() => setParentId(comment.id)}>
                            <IconDelete /> <span>Delete</span>
                          </StyledButton>
                        </Action>
                      </>
                    )}
                  </Actions>
                </Bottom>
              </div>
            </Container>
            <CommentsRecursive
              comments={comment.children}
              index={parentIndex + 1}
              setParentId={setParentId}
              parentId={parentId}
              article={article}
            />
          </Fragment>
        );
      })}
    </>
  );
}

const Container = styled.div`
  position: relative;
  margin-bottom: 24px;
  display: grid;
  grid-template-columns: 18px 1fr;
  grid-gap: 24px;
  transition: opacity 0.25s ease;
`;

const Connection = styled.div`
  position: absolute;
  height: 100%;
`;

const ConnectionLine = styled.div`
  top: 18px;
  width: 1px;
  height: 100%;
  background: #202020;
`;

const ConnectionLineCurve = styled.div`
  top: -26px;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: #202020;
  position: absolute;
`;

const BadgeContainer = styled.span`
  margin-left: 12px;
`;

const Name = styled.span`
  color: ${(p) => p.theme.colors.off_white};
`;

const Content = styled.div<{ isHost: boolean }>`
  font-family: ${(p) => p.theme.fontFamily.nouvelle};
  font-size: 14px;
  line-height: 130%;
  color: ${(p) =>
    p.isHost ? p.theme.colors.white : p.theme.colors.light_grey};
  margin-bottom: 8px;
`;

const Author = styled.div`
  display: flex;
  font-size: 10px;
  line-height: 135%;
  color: ${(p) => p.theme.colors.light_grey};
  margin-bottom: 8px;
`;

const Actions = styled.div`
  display: grid;
  grid-template-columns: repeat(4, auto);
  grid-gap: 24px;
`;

const Action = styled.div``;

const Bottom = styled.div`
  display: flex;
  align-items: center;
  color: ${(p) => p.theme.colors.light_grey};
  font-size: 10px;
`;

const StyledButton = styled.button`
  display: flex;
  align-items: center;
  color: ${(p) => p.theme.colors.light_grey};

  svg {
    margin-right: 8px;
  }

  &:hover {
    color: ${(p) => p.theme.colors.off_white};

    svg path {
      fill: ${(p) => p.theme.colors.off_white};
    }
  }
`;
