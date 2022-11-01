import { useSession } from "next-auth/react";
import { useCallback, useContext, useState } from "react";
import styled from "styled-components";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formatNestedComments } from "../pages/ama/[slug]";
import { theme } from "../styles/theme";
import Avatar from "./Avatar";
import Comments from "./Comments";
import CommentBox from "./Forms/CommentBox";
import IconArticle from "./Icons/IconArticle";
import IconEx from "./Icons/IconEx";
import IconHosts from "./Icons/IconHosts";
import IconSend from "./Icons/IconSend";
import IconShare from "./Icons/IconShare";
import IconUpvote from "./Icons/IconUpvotes";
import { OverlayContext, OverlayType } from "./Overlay";

const placeholderContent =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas non dignissim nisi. Quisque imperdiet ornare nunc nec dapibus. In scelerisque turpis eget purus pharetra commodo.";

export default function Ama({ article, comments }) {
  const [comment, setComment] = useState("");
  const [parentId, setParentId] = useState(null);
  const { showOverlay } = useContext(OverlayContext);
  const session = useSession();

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: ["comments", article.id],
    mutationFn: (newComment: any) => {
      return fetch("/api/comments", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newComment),
      });
    },
    onMutate: async (newComment) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["comments", article.id] });

      // Snapshot the previous value
      const previousComments = queryClient.getQueryData([
        "comments",
        article.id,
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData(["comments", article.id], (old) => [
        ...(old as any),
        {
          ...newComment,
          updatedAt: new Date(),
          createdAt: new Date(),
          author: {
            name: session.data.user.name,
            image: session.data.user.image,
          },
        },
      ]);

      setParentId(null);
      setComment("");
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

  const handleUpvoteClick = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();

      if (session.status === "unauthenticated") {
        return showOverlay(OverlayType.AUTHENTICATION);
      }

      fetch("/api/posts/vote", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          userId: session.data.user.id,
          postId: article.id,
        }),
      });
    },
    [article, session]
  );

  const handleCommentChange = useCallback(
    (event: React.FormEvent<HTMLTextAreaElement>) => {
      setComment(event.currentTarget.value);
    },
    [setComment]
  );

  const handleSubmit = (event) => {
    event.preventDefault();

    if (session.status === "unauthenticated") {
      return showOverlay(OverlayType.AUTHENTICATION);
    }

    mutation.mutate({
      content: comment,
      postId: article.id,
      parentId,
      userId: session.data.user.id,
    });
  };

  const replyingToComment = comments.find((c) => c.id === parentId);
  return (
    <>
      <Container>
        {article.authors.map((author) => (
          <Avatar key={author.id} src={author.image} highlight />
        ))}

        <Details>
          <FlexBetween>
            <Authors>
              {article.authors.map((author) => (
                <Author key={author.id}>{author.name}</Author>
              ))}
            </Authors>
            <SubmitButton onClick={() => showOverlay(OverlayType.SUGGESTION)}>
              Submit
            </SubmitButton>
          </FlexBetween>

          <Title>{article.title}</Title>
          <Content>{article.content || placeholderContent}</Content>
          <FlexBetween>
            <Actions>
              <Action>
                <StyledButton onClick={handleUpvoteClick}>
                  <IconUpvote /> <span>{article._count.votes}</span> upvotes
                </StyledButton>
              </Action>
              <Action>
                <StyledLink
                  href={article.source}
                  target="_blank"
                  rel="noopener"
                >
                  <IconArticle /> View article
                </StyledLink>
              </Action>
              <Action>
                <StyledButton>
                  <IconHosts /> Hosts
                </StyledButton>
              </Action>
              <Action>
                <StyledButton>
                  <IconShare /> Share post
                </StyledButton>
              </Action>
            </Actions>
            <Flex>
              {article.live && (
                <Live>
                  <LiveDot />
                  Live
                </Live>
              )}{" "}
              <PostedAt>
                {new Intl.DateTimeFormat("en", {
                  day: "numeric",
                  month: "short",
                }).format(new Date(article.postedAt))}
              </PostedAt>
            </Flex>
          </FlexBetween>
        </Details>
      </Container>
      <div style={{ marginTop: 24, paddingLeft: 54, paddingBottom: 240 }}>
        <Comments
          comments={formatNestedComments(comments)}
          setParentId={setParentId}
          parentId={parentId}
        />
      </div>
      <CommentBoxForm onSubmit={handleSubmit}>
        {replyingToComment && (
          <ReplyingTo>
            <div>
              Replying to <span>{replyingToComment.author.name}</span>
            </div>
            <button onClick={() => setParentId(null)}>
              <IconEx size={16} fill={theme.colors.white} />
            </button>
          </ReplyingTo>
        )}
        <BlueGradientContainer>
          <BlueGradient />
        </BlueGradientContainer>
        <CommentBox
          value={comment}
          onChange={handleCommentChange}
          placeholder="Ask my anything"
        />
        <Submit type="submit">
          {session.data.user.name}
          <Divider />
          <IconSend />
        </Submit>
      </CommentBoxForm>
    </>
  );
}

const ReplyingTo = styled.div`
  position: absolute;
  top: -28px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  background: #050505;
  border-top-left-radius: 14px;
  border-top-right-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-bottom: none;
  padding: 8px 19px 12px;
  font-size: 13px;
  font-family: ${(p) => p.theme.fontFamily.nouvelle};
  color: ${(p) => p.theme.colors.light_grey};

  span {
    color: ${(p) => p.theme.colors.off_white};
  }
`;

const CommentBoxForm = styled.form`
  position: fixed;
  right: 12%;
  width: 841px;
  bottom: 48px;
  z-index: 3;
`;

const Submit = styled.button`
  position: absolute;
  top: 18px;
  right: 16px;
  color: ${(p) => p.theme.colors.light_grey};
  display: flex;
  align-items: center;
`;

const Divider = styled.div`
  height: 16px;
  width: 1px;
  background: rgba(255, 255, 255, 0.21);
  margin: 0 14px;
`;

const FlexBetween = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
`;

const Live = styled.span`
  display: flex;
  align-items: center;
  color: ${(p) => p.theme.colors.orange};
  margin-right: 18px;
`;

const LiveDot = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin: 0 6px;
  background: ${(p) => p.theme.colors.orange};
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
`;

const Action = styled.div`
  margin-right: 24px;
`;

const Details = styled.div`
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  padding-bottom: 24px;
`;

const PostedAt = styled.div`
  font-size: 10px;
  line-height: 135%;
  color: ${(p) => p.theme.colors.light_grey};
`;

const Container = styled.div`
  display: grid;
  grid-template-columns: 18px 1fr;
  grid-gap: 36px;
  margin-right: 21px;
  z-index: 3;
  position: sticky;
  top: 40px;
  background: ${(p) => p.theme.colors.black};
`;

const Authors = styled.div`
  font-weight: 500;
  font-size: 18px;
  line-height: 120%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const Title = styled.h2`
  font-family: ${(p) => p.theme.fontFamily.nouvelle};
  font-weight: 500;
  font-size: 18px;
  line-height: 120%;
  color: ${(p) => p.theme.colors.white};
  margin-bottom: 8px;
  max-width: 690px;
`;

const Content = styled.p`
  font-family: ${(p) => p.theme.fontFamily.nouvelle};
  color: ${(p) => p.theme.colors.light_grey};
  font-size: 16px;
  line-height: 120%;
  max-width: 690px;
  margin-bottom: 12px;
`;

const Author = styled.span`
  font-size: 10px;
  line-height: 135%;
  color: ${(p) => p.theme.colors.off_white};
`;

const StyledLink = styled.a`
  color: ${(p) => p.theme.colors.light_grey};
  font-size: 10px;

  &:hover {
    color: ${(p) => p.theme.colors.off_white};
  }
`;

const StyledButton = styled.button`
  display: flex;
  align-items: center;
  color: ${(p) => p.theme.colors.light_grey};
  font-size: 10px;

  svg {
    margin-right: 6px;
  }

  span {
    margin-right: 6px;
  }

  &:hover {
    color: ${(p) => p.theme.colors.off_white};

    svg path {
      fill: ${(p) => p.theme.colors.off_white};
    }
  }
`;

const SubmitButton = styled.button`
  margin-left: 7px;
  padding: 4px 7px 5px;
  margin: 0 -7px;
  background: rgba(255, 255, 255, 0);
  border-radius: 5px;
  transition: background 0.25s ease;

  span {
    color: ${(p) => p.theme.colors.light_grey};
  }

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
`;

const BlueGradientContainer = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  pointer-events: none;
`;

const BlueGradient = () => (
  <svg
    width="354"
    height="91"
    viewBox="0 0 354 91"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g filter="url(#filter0_f_768_3122)">
      <path
        d="M374 74V142H170.571L144 120.467L170.571 74H374Z"
        fill="url(#paint0_linear_768_3122)"
      />
    </g>
    <defs>
      <filter
        id="filter0_f_768_3122"
        x="0"
        y="-70"
        width="518"
        height="356"
        filterUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB"
      >
        <feFlood flood-opacity="0" result="BackgroundImageFix" />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        />
        <feGaussianBlur
          stdDeviation="54"
          result="effect1_foregroundBlur_768_3122"
        />
      </filter>
      <linearGradient
        id="paint0_linear_768_3122"
        x1="245.485"
        y1="142"
        x2="239.098"
        y2="64.8444"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#072839" />
        <stop offset="0.525533" stopColor="#033151" />
        <stop offset="1" stopColor="#28445C" />
      </linearGradient>
    </defs>
  </svg>
);
