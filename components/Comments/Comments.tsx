import { useSession } from "next-auth/react";
import { Fragment, useContext } from "react";
import styled from "styled-components";
import Document from "@tiptap/extension-document";
import Link from "@tiptap/extension-link";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { useEditor } from "@tiptap/react";
import { timeAgo } from "../../helpers/date";
import { clamp } from "../../helpers/numbers";
import {
  STORAGE_COMMENT,
  STORAGE_EDIT,
  STORAGE_REPLY,
} from "../../helpers/storage";
import { useCommentMutations } from "../../lib/hooks/useCommentMutations";
import { ellipsis } from "../../styles/css";
import { mq } from "../../styles/mediaqueries";
import { theme } from "../../styles/theme";
import Avatar from "../Avatar";
import Dot from "../Dot";
import Editor from "../Forms/Editor";
import IconDelete from "../Icons/IconDelete";
import IconEdit from "../Icons/IconEdit";
import IconLike from "../Icons/IconLike";
import IconLiked from "../Icons/IconLiked";
import IconReplied from "../Icons/IconReplied";
import IconReply from "../Icons/IconReply";
import Names from "../Names";
import { OverlayContext, OverlayType } from "../Overlay/Overlay";

export default function Comments(props) {
  return <CommentsRecursive {...props} />;
}

function CommentsRecursive({
  article,
  comments,
  index: parentIndex = 0,
  parentId,
  setReplyingToId,
  replyingToId,
  edittingId,
  setEdittingId,
}) {
  const { showOverlay } = useContext(OverlayContext);
  const commentMutations = useCommentMutations({ article });
  const session = useSession();

  const commentKey = `${STORAGE_COMMENT}-${article.slug}`;
  const editKey = `${STORAGE_EDIT}-${article.slug}`;
  const replyKey = `${STORAGE_REPLY}-${article.slug}`;

  const handleLike = (event: React.MouseEvent, comment) => {
    event.preventDefault();
    event.stopPropagation();
    if (session.status === "unauthenticated") {
      return showOverlay(OverlayType.AUTHENTICATION);
    }

    commentMutations.like.mutate({
      userId: session.data.user.id,
      commentId: comment.id,
    });
  };

  const handleDelete = (event: React.MouseEvent, commentId) => {
    event.preventDefault();
    event.stopPropagation();

    return showOverlay(OverlayType.CONFIRMATION, {
      heading: "Deleting your comment",
      text: "Are you sure you want to delete this comment? This cannot be undone. Any replies you may have received will remain visible.",
      right: {
        text: "Delete",
        action: () => commentMutations.delete.mutate(commentId),
      },
      delete: true,
    });
  };

  if (!comments) {
    return null;
  }

  const hosts = article.authors;
  const eidtOrReplying = replyingToId || edittingId;

  return (
    <>
      {comments.map((comment, commentIndex) => {
        const isEditingThisComment = edittingId === comment.id;
        const isReplyingToThisComment = replyingToId === comment.id;

        const edittingOrReplyingToThisComment =
          isReplyingToThisComment || isEditingThisComment;
        const commentHasReplies =
          comment.children.filter((c) => c?.author).length > 0;
        const firstReply = parentIndex === 1 && commentIndex === 0;
        const isHostReply = hosts?.some((a) => a.id === comment.author?.id);
        const isUserReply = session?.data?.user.id === comment.author?.id;

        const paddingLeft = clamp(parentIndex * 42 + 9, 0, 42 + 9);

        if (!comment.author) {
          return (
            <CommentDeleted
              comment={comment}
              parentIndex={parentIndex}
              commentIndex={commentIndex}
              setReplyingToId={setReplyingToId}
              parentId={parentId}
              replyingToId={replyingToId}
              article={article}
              edittingId={edittingId}
              setEdittingId={setEdittingId}
              key={comment.id + comment.content}
            />
          );
        }

        return (
          <Fragment key={comment.id + comment.content}>
            <Container
              style={{
                paddingLeft: clamp(parentIndex * 42, 0, 42),
                opacity: eidtOrReplying
                  ? edittingOrReplyingToThisComment
                    ? 1
                    : 0.32
                  : 1,
                pointerEvents: eidtOrReplying
                  ? edittingOrReplyingToThisComment
                    ? "initial"
                    : "none"
                  : "initial",
              }}
            >
              {commentHasReplies && parentIndex === 0 && (
                <Connection style={{ paddingLeft }}>
                  <ConnectionLine />
                </Connection>
              )}
              {firstReply && (
                <ConnectionCurve style={{ paddingLeft }}>
                  <IconConnectionCurve />
                </ConnectionCurve>
              )}
              <Avatar
                src={comment.author.image}
                outline={isHostReply}
                highlight={isHostReply}
              />
              <div>
                <Author>
                  <Names authors={[comment.author]} />
                  <Dot />
                  <UpdatedAt>{timeAgo(new Date(comment.updatedAt))}</UpdatedAt>
                </Author>
                <Content isHostReply={isHostReply}>
                  <CommentEditor content={comment.content} />
                </Content>
                <Bottom>
                  {isEditingThisComment ? (
                    <Actions>
                      <Action>
                        <IconEdit />
                      </Action>
                    </Actions>
                  ) : (
                    <Actions>
                      <Action>
                        <CommentLike
                          comment={comment}
                          handleLike={handleLike}
                        />
                      </Action>
                      <Action>
                        <StyledButton
                          onClick={() => {
                            setReplyingToId(comment.id);
                            localStorage.setItem(replyKey, comment.id);
                          }}
                        >
                          {commentHasReplies ? <IconReplied /> : <IconReply />}{" "}
                          <span>
                            {edittingOrReplyingToThisComment
                              ? "Replying to..."
                              : "Reply"}
                          </span>
                        </StyledButton>
                      </Action>
                      {isUserReply && (
                        <>
                          <Action>
                            <StyledButton
                              onClick={() => {
                                setEdittingId(comment.id);
                                localStorage.setItem(
                                  commentKey,
                                  comment.content
                                );
                                localStorage.setItem(editKey, comment.id);
                              }}
                            >
                              <IconEdit /> <span>Edit</span>
                            </StyledButton>
                          </Action>
                          <Action>
                            <StyledButton
                              onClick={(event) =>
                                handleDelete(event, comment.id)
                              }
                            >
                              <IconDelete /> <span>Delete</span>
                            </StyledButton>
                          </Action>
                        </>
                      )}
                    </Actions>
                  )}
                </Bottom>
              </div>
            </Container>
            <CommentsRecursive
              comments={comment.children}
              index={parentIndex + 1}
              setReplyingToId={setReplyingToId}
              parentId={parentId}
              replyingToId={replyingToId}
              article={article}
              edittingId={edittingId}
              setEdittingId={setEdittingId}
            />
          </Fragment>
        );
      })}
    </>
  );
}

function CommentLike({ comment, handleLike }) {
  const liked = comment.liked;
  const likes = comment._count?.likes;

  return (
    <StyledButton onClick={(event) => handleLike(event, comment)}>
      {liked ? <IconLiked /> : <IconLike />}{" "}
      {likes > 0 && (
        <span style={liked ? { color: theme.colors.white } : {}}>{likes}</span>
      )}
    </StyledButton>
  );
}

function CommentDeleted({
  comment,
  parentIndex,
  edittingId,
  parentId,
  replyingToId,
  setReplyingToId,
  setEdittingId,
  article,
  commentIndex,
}) {
  const edittingOrReplyingToThisComment =
    parentId === comment.id || edittingId === comment.id;
  const eidtOrReplying = replyingToId || edittingId;
  const commentsWithReplies = comment.children.filter((x) => x?.author);
  const firstReply = parentIndex === 1 && commentIndex === 0;

  if (commentsWithReplies.length === 0) {
    return null;
  }

  const commentHasReplies = comment.children.length > 0;

  return (
    <Fragment>
      <Container
        style={{
          paddingLeft: clamp(parentIndex * 42, 0, 42),
          opacity: eidtOrReplying
            ? edittingOrReplyingToThisComment
              ? 1
              : 0.32
            : 1,
          pointerEvents: eidtOrReplying
            ? edittingOrReplyingToThisComment
              ? "none"
              : "initial"
            : "none",
        }}
      >
        {commentHasReplies && parentIndex === 0 && (
          <Connection
            style={{
              paddingLeft: clamp(parentIndex * 42 + 9, 0, 42 + 9),
            }}
          >
            <ConnectionLine />
          </Connection>
        )}
        {firstReply && (
          <ConnectionCurve
            style={{
              paddingLeft: clamp(parentIndex * 42 + 9, 0, 42 + 9),
            }}
          >
            <IconConnectionCurve />
          </ConnectionCurve>
        )}
        <Avatar outline={false} />
        <DeletedContainer>
          <IconDeletedContainer>
            <IconDeletedBoder />
          </IconDeletedContainer>
          <span>
            This {parentId ? "response" : "question"} was deleted by the author.
          </span>
        </DeletedContainer>
      </Container>
      <CommentsRecursive
        comments={comment.children}
        index={parentIndex + 1}
        setReplyingToId={setReplyingToId}
        parentId={parentId}
        setEdittingId={setEdittingId}
        edittingId={edittingId}
        article={article}
      />
    </Fragment>
  );
}

function CommentEditor({ content }) {
  const editor = useEditor({
    extensions: [Document, Paragraph, Text, Link],
    content,
    editable: false,
  });

  return <Editor editor={editor} fontSize={14} />;
}

const DeletedContainer = styled.div`
  position: relative;

  max-width: 306px;
  height: 36px;
  display: grid;
  place-items: center;

  span {
    position: relative;
    font-family: ${(p) => p.theme.fontFamily.nouvelle};
    font-size: 13px;
    line-height: 130%;
    text-align: center;
    color: ${(p) => p.theme.colors.light_grey};
  }
`;

const IconDeletedContainer = styled.div`
  position: absolute;
  left: 0;
  top: 0;
`;

const IconDeletedBoder = () => (
  <svg
    width="100%"
    height="36"
    viewBox="0 0 306 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_878_2759)">
      <rect width="306" height="36" rx="8" fill="#0A0A0A" />
      <g filter="url(#filter0_f_878_2759)">
        <path
          d="M430 0V46H171.733L138 31.4333L171.733 0H430Z"
          fill="url(#paint0_linear_878_2759)"
          fillOpacity="0.3"
        />
      </g>
    </g>
    <rect
      x="0.5"
      y="0.5"
      width="99%"
      height="35"
      rx="7.5"
      stroke="white"
      strokeOpacity="0.1"
      strokeDasharray="2 2"
    />
    <defs>
      <filter
        id="filter0_f_878_2759"
        x="-6"
        y="-144"
        width="580"
        height="334"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        />
        <feGaussianBlur
          stdDeviation="72"
          result="effect1_foregroundBlur_878_2759"
        />
      </filter>
      <linearGradient
        id="paint0_linear_878_2759"
        x1="284"
        y1="46"
        x2="248"
        y2="-47.5"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FA2162" />
        <stop offset="1" stopColor="#FA2162" stopOpacity="0" />
      </linearGradient>
      <clipPath id="clip0_878_2759">
        <rect width="99.5%" height="36" rx="8" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const Container = styled.div`
  position: relative;
  margin-bottom: 24px;
  display: grid;
  grid-template-columns: 18px 1fr;
  grid-gap: 24px;
  transition: opacity 0.25s ease;

  ${mq.desktopSmall} {
    grid-gap: 21px;
    margin-bottom: 18px;
  }

  ${mq.phablet} {
    grid-gap: 12px;
    margin-bottom: 24px;
  }
`;

const Connection = styled.div`
  position: absolute;
  height: calc(100% - 4px);
`;

const ConnectionLine = styled.div`
  top: 18px;
  width: 1px;
  height: 100%;
  background: #202020;
`;

const ConnectionCurve = styled.div`
  top: -29px;
  left: -42.5px;
  position: absolute;
`;

const IconConnectionCurve = () => (
  <svg
    width="29"
    height="39"
    viewBox="0 0 29 39"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M1 0C1 24.577 7.89855 37.9826 29 37.9826" stroke="#202020" />
  </svg>
);

const Content = styled.div<{ isHostReply: boolean }>`
  font-family: ${(p) => p.theme.fontFamily.nouvelle};
  font-size: 14px;
  line-height: 130%;
  color: ${(p) =>
    p.isHostReply ? p.theme.colors.white : p.theme.colors.light_grey};
  margin-bottom: 8px;
`;

const Author = styled.div`
  display: flex;
  font-size: 10px;
  line-height: 135%;
  color: ${(p) => p.theme.colors.light_grey};
  margin-bottom: 8px;
`;

const UpdatedAt = styled.span`
  ${ellipsis}
`;

const Actions = styled.div`
  display: flex;
`;

const Action = styled.div`
  min-width: 30px;
  margin-right: 24px;
`;

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

  span {
    margin-left: 8px;
  }

  &:hover {
    color: ${(p) => p.theme.colors.off_white};

    svg path {
      fill: ${(p) => p.theme.colors.off_white};
    }
  }
`;
