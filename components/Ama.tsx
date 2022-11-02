import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useCallback, useContext, useRef, useState } from "react";
import styled from "styled-components";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formatNestedComments } from "../pages/ama/[slug]";
import { theme } from "../styles/theme";
import Avatar from "./Avatar";
import CommentBox from "./CommentBox";
import Comments from "./Comments";
import IconArticle from "./Icons/IconArticle";
import IconHosts from "./Icons/IconHosts";
import IconLike from "./Icons/IconLike";
import IconLiked from "./Icons/IconLiked";
import IconShare from "./Icons/IconShare";
import Names from "./Names";
import { OverlayContext, OverlayType } from "./Overlay";
import Stacked from "./Stacked";

const placeholderContent =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas non dignissim nisi. Quisque imperdiet ornare nunc nec dapibus. In scelerisque turpis eget purus pharetra commodo.";

export default function Ama({ article, comments }) {
  const [parentId, setParentId] = useState(null);
  const { showOverlay } = useContext(OverlayContext);
  const session = useSession();

  const router = useRouter();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: ["post", router.query.slug],
    mutationFn: (like: any) => {
      return fetch("/api/posts/like", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(like),
      });
    },
    onMutate: async () => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: ["post", router.query.slug],
      });

      // Snapshot the previous value
      const previousPost = queryClient.getQueryData([
        "post",
        router.query.slug,
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData(["post", router.query.slug], (old: any) => {
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

      // Return a context object with the snapshotted value
      return { previousPost };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(
        ["post", router.query.slug],
        context.previousPost
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["post", router.query.slug] });
    },
  });

  const handleLike = (event: React.MouseEvent, article) => {
    event.preventDefault();
    event.stopPropagation();
    if (session.status === "unauthenticated") {
      return showOverlay(OverlayType.AUTHENTICATION);
    }

    mutation.mutate({
      userId: session.data.user.id,
      postId: article.id,
    });
  };

  const conatinerRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <Container>
        <div />
        <Details ref={conatinerRef}>
          <FlexBetween>
            <Authors>
              <Names authors={article.authors} />
              <DotDivider>·</DotDivider>
              <Flex>
                <span>
                  {new Intl.DateTimeFormat("en", {
                    day: "numeric",
                    month: "short",
                  }).format(new Date(article.postedAt))}
                </span>
                {article.live && <LiveDot />}{" "}
              </Flex>
            </Authors>
            <Hosts>
              Hosts <span>{article.authors.length}</span>
              <StackedContainer>
                <Stacked
                  size={18}
                  direction="right"
                  elements={article.authors.map((author) => (
                    <Avatar src={author.image} size={18} outline={false} />
                  ))}
                />
              </StackedContainer>
            </Hosts>
          </FlexBetween>
          <Title>{article.title}</Title>
          <Content>{article.content || placeholderContent}</Content>
          <FlexBetween>
            <Actions>
              <Action>
                <StyledButton
                  onClick={(event) => handleLike(event, article)}
                  style={article.liked ? { color: theme.colors.white } : {}}
                >
                  {article.liked ? <IconLiked /> : <IconLike />}
                  {article._count.likes + 1}
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
                  <IconShare /> Share
                </StyledButton>
              </Action>
            </Actions>
          </FlexBetween>
        </Details>
      </Container>
      <CommentsContainer>
        <Comments
          comments={formatNestedComments(comments)}
          setParentId={setParentId}
          parentId={parentId}
          article={article}
        />
      </CommentsContainer>
      <CommentBox
        article={article}
        comments={comments}
        conatinerRef={conatinerRef}
        setParentId={setParentId}
        parentId={parentId}
      />
    </>
  );
}

const CommentsContainer = styled.div`
  margin-top: 24px;
  padding: 0 0 160px 54px;
  max-width: 689px;
`;

const DotDivider = styled.span`
  margin: 0 6px;
  color: ${(p) => p.theme.colors.light_grey};
`;

const Hosts = styled.div`
  display: flex;
  align-items: center;
  color: ${(p) => p.theme.colors.light_grey};

  & > span {
    margin: 0 8px 0 6px;
    color: ${(p) => p.theme.colors.off_white};
  }
`;

const StackedContainer = styled.div`
  display: grid;
  padding: 2px;
  border: 1px solid ${(p) => p.theme.colors.orange};
  border-radius: 30px;
`;

const FlexBetween = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
`;

const LiveDot = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-left: 8px;
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

const Container = styled.div`
  display: grid;
  grid-template-columns: 18px 1fr;
  grid-gap: 36px;
  z-index: 3;
  position: relative;
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

const Authors = styled.div`
  font-size: 10px;
  line-height: 135%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
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
    margin-right: 8px;
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
