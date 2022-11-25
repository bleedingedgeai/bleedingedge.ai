import { useSession } from "next-auth/react";
import { Fragment, useContext } from "react";
import styled, { CSSProperties } from "styled-components";
import { Editor } from "@tiptap/react";
import { timeAgo } from "../../helpers/date";
import { STORAGE_COMMENT, STORAGE_REPLY } from "../../helpers/storage";
import { useCommentMutations } from "../../lib/hooks/useCommentMutations";
import { ArticleWithLike, CommentWithChildren } from "../../prisma/types";
import { ellipsis } from "../../styles/css";
import { mq } from "../../styles/mediaqueries";
import { theme } from "../../styles/theme";
import Avatar from "../Avatar";
import Dot from "../Dot";
import { editorCss } from "../Forms/Editor";
import IconEdit from "../Icons/IconEdit";
import IconLike from "../Icons/IconLike";
import IconLiked from "../Icons/IconLiked";
import IconReply from "../Icons/IconReply";
import Names from "../Names";
import { OverlayContext, OverlayType } from "../Overlay/Overlay";
import CommentsMenu from "./CommentsMenu";

interface CommentProps {
  article: ArticleWithLike;
  comments: CommentWithChildren[];
  index?: number;
  parentId?: string;
  setReplyingToId: React.Dispatch<React.SetStateAction<string>>;
  replyingToId: string;
  edittingId: string;
  setEdittingId: React.Dispatch<React.SetStateAction<string>>;
  editor: Editor;
}

export default function Comments(props: CommentProps) {
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
  editor,
}: CommentProps) {
  const { showOverlay } = useContext(OverlayContext);
  const commentMutations = useCommentMutations({ article });
  const session = useSession();

  const commentKey = `${STORAGE_COMMENT}-${article.slug}`;
  const replyKey = `${STORAGE_REPLY}-${article.slug}`;

  //////////////////////////////////////////////////////////////////////////
  // Methods
  //////////////////////////////////////////////////////////////////////////

  const handleCommentReply = (event: React.MouseEvent, comment) => {
    event.preventDefault();

    if (session.status === "unauthenticated") {
      return showOverlay(OverlayType.AUTHENTICATION);
    }

    // Might want this back soon
    // editor?.commands?.setContent([
    //   {
    //     type: "mention",
    //     attrs: { id: comment.author.username },
    //   },
    //   {
    //     type: "text",
    //     text: " ",
    //   },
    // ]);
    editor?.commands?.focus();
    setReplyingToId(comment.id);

    if (editor?.getHTML()) {
      localStorage.setItem(commentKey, editor?.getHTML());
    }

    localStorage.setItem(replyKey, comment.id);
  };

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

  if (!comments) {
    return null;
  }

  const hosts = article.authors;
  const eidtOrReplying = replyingToId || edittingId;

  return (
    <>
      {comments.map((comment) => {
        const isEditingThisComment = edittingId === comment.id;
        const isReplyingToThisComment = replyingToId === comment.id;

        const edittingOrReplyingToThisComment =
          isReplyingToThisComment || isEditingThisComment;
        const commentHasReplies =
          comment.children.filter((c) => c?.author).length > 0;
        const isHostReply = hosts?.some((a) => a.id === comment.author?.id);
        const isUserReply = session?.data?.user.id === comment.author?.id;

        if (!comment.author) {
          return (
            <CommentDeleted
              comment={comment}
              parentIndex={parentIndex}
              setReplyingToId={setReplyingToId}
              parentId={parentId}
              replyingToId={replyingToId}
              article={article}
              edittingId={edittingId}
              setEdittingId={setEdittingId}
              key={comment.id + comment.content}
              editor={editor}
            />
          );
        }

        const disabledCommentStyles: CSSProperties = {
          pointerEvents: "none",
          opacity: 0.32,
        };

        return (
          <Fragment key={comment.id + comment.content}>
            <Container
              index={parentIndex}
              style={
                eidtOrReplying && !edittingOrReplyingToThisComment
                  ? disabledCommentStyles
                  : {}
              }
            >
              <Avatar
                href={`https://twitter.com/${comment.author.username}`}
                src={comment.author.image}
                outline={isHostReply}
                highlight={isHostReply}
              />
              <div>
                <Author>
                  <Names authors={[comment.author]} />
                  <Dot />
                  <UpdatedAt>{timeAgo(new Date(comment.updatedAt))}</UpdatedAt>
                  <UpdatedAtMobile>
                    {timeAgo(new Date(comment.updatedAt), "short")}
                  </UpdatedAtMobile>
                </Author>
                <Content isHostReply={isHostReply}>
                  <CommentEditor
                    fontSize={14}
                    dangerouslySetInnerHTML={{ __html: comment.content }}
                  />
                </Content>
                <Bottom>
                  {isReplyingToThisComment && (
                    <Action>
                      <StyledButton>
                        <IconReply /> <span>Replying to...</span>
                      </StyledButton>
                    </Action>
                  )}
                  {isEditingThisComment && (
                    <Actions>
                      <Action>
                        <IconEdit />
                      </Action>
                    </Actions>
                  )}
                  {!isReplyingToThisComment && !isEditingThisComment && (
                    <Actions>
                      <Action>
                        <CommentLike
                          comment={comment}
                          handleLike={handleLike}
                          disabled={article.disabled}
                        />
                      </Action>
                      {article.disabled ? null : (
                        <Action>
                          <StyledButton
                            onClick={(event) =>
                              handleCommentReply(event, comment)
                            }
                          >
                            <IconReply />{" "}
                            <span>
                              {edittingOrReplyingToThisComment
                                ? "Replying to..."
                                : "Reply"}
                            </span>
                          </StyledButton>
                        </Action>
                      )}
                      {isUserReply && (
                        <CommentsMenu
                          article={article}
                          comment={comment}
                          setEdittingId={setEdittingId}
                          editor={editor}
                        />
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
              editor={editor}
            />
          </Fragment>
        );
      })}
    </>
  );
}

function CommentLike({ comment, handleLike, disabled }) {
  const liked = comment.liked;
  const likes = comment._count?.likes;

  return (
    <StyledButton
      disabled={disabled}
      onClick={(event) => handleLike(event, comment)}
    >
      {liked || disabled ? (
        <IconLiked
          fill={disabled ? theme.colors.light_grey : theme.colors.white}
        />
      ) : (
        <IconLike />
      )}{" "}
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
  editor,
}) {
  const edittingOrReplyingToThisComment =
    parentId === comment.id || edittingId === comment.id;
  const eidtOrReplying = replyingToId || edittingId;
  const commentsWithReplies = comment.children.filter((x) => x?.author);

  if (commentsWithReplies.length === 0) {
    return null;
  }

  return (
    <Fragment>
      <Container
        index={parentIndex}
        style={{
          opacity: eidtOrReplying
            ? edittingOrReplyingToThisComment
              ? 1
              : 0.32
            : 1,
        }}
      >
        <Avatar outline={false} />
        <DeletedContainer>
          <IconDeletedContainer>
            <IconDeletedBoder />
          </IconDeletedContainer>
          <span>This comment was deleted by the author.</span>
        </DeletedContainer>
      </Container>
      <CommentsRecursive
        comments={comment.children}
        index={parentIndex + 1}
        setReplyingToId={setReplyingToId}
        parentId={parentId}
        replyingToId={replyingToId}
        setEdittingId={setEdittingId}
        edittingId={edittingId}
        article={article}
        editor={editor}
      />
    </Fragment>
  );
}

const CommentEditor = styled.div`
  ${editorCss}
`;

const DeletedContainer = styled.div`
  position: relative;
  max-width: 306px;
  height: 36px;
  display: grid;
  place-items: center;

  span {
    position: relative;
    font-family: ${(p) => p.theme.fontFamily.nouvelle};
    font-size: 12px;
    line-height: 130%;
    text-align: center;
    color: ${(p) => p.theme.colors.light_grey};
    ${ellipsis}
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

const Container = styled.div<{ index: number }>`
  position: relative;
  margin-bottom: 24px;
  display: grid;
  grid-template-columns: 18px 1fr;
  grid-gap: 24px;
  transition: opacity 0.25s ease;
  padding-left: ${(p) => p.index * 42}px;

  ${mq.desktopSmall} {
    grid-gap: 21px;
    margin-bottom: 18px;
  }

  ${mq.tablet} {
    padding-left: ${(p) => p.index * 32}px;
  }

  ${mq.phablet} {
    grid-gap: 12px;
    margin-bottom: 24px;
    padding-left: ${(p) => p.index * 24}px;
  }
`;

// const Connection = styled.div`
//   position: absolute;
//   height: calc(100% - 4px);
// `;

// const ConnectionLine = styled.div`
//   top: 18px;
//   width: 1px;
//   height: 100%;
//   background: #202020;
// `;

// const ConnectionCurve = styled.div`
//   top: -29px;
//   left: -42.5px;
//   position: absolute;
// `;

// const IconConnectionCurve = () => (
//   <svg
//     width="29"
//     height="39"
//     viewBox="0 0 29 39"
//     fill="none"
//     xmlns="http://www.w3.org/2000/svg"
//   >
//     <path d="M1 0C1 24.577 7.89855 37.9826 29 37.9826" stroke="#202020" />
//   </svg>
// );

const Content = styled.div<{ isHostReply: boolean }>`
  font-family: ${(p) => p.theme.fontFamily.nouvelle};
  font-size: 14px;
  line-height: 130%;
  color: ${(p) =>
    p.isHostReply ? p.theme.colors.white : p.theme.colors.light_grey};
  margin-bottom: 8px;

  ${mq.desktopMaxUp} {
    font-size: 16px;
  }
`;

const Author = styled.div`
  display: flex;
  font-size: 10px;
  line-height: 135%;
  color: ${(p) => p.theme.colors.light_grey};
  margin-bottom: 4px;
  width: 100%;

  ${mq.desktopMaxUp} {
    font-size: 12px;
  }
`;

const UpdatedAt = styled.span`
  ${mq.phablet} {
    display: none;
  }
`;

const UpdatedAtMobile = styled.span`
  ${mq.phabletUp} {
    display: none;
  }
`;

const Actions = styled.div`
  display: flex;
`;

const Action = styled.div`
  min-width: 30px;
  margin-right: 13px;
`;

const Bottom = styled.div`
  display: flex;
  align-items: center;
  color: ${(p) => p.theme.colors.light_grey};
  font-size: 10px;
`;

const StyledButton = styled.button<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  color: ${(p) => p.theme.colors.light_grey};
  transition: color 0.2s ease;

  svg path {
    transition: fill 0.2s ease;
  }

  span {
    margin-left: 8px;
  }

  ${(p) =>
    p.disabled
      ? "cursor: default"
      : `&:hover {
    color: ${p.theme.colors.off_white};

    svg path {
      fill: ${p.theme.colors.off_white};
    }
  }`}
`;
