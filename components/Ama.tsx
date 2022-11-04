import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formatNestedComments } from "../pages/ama/[slug]";
import { ellipsis } from "../styles/css";
import { mq } from "../styles/mediaqueries";
import { theme } from "../styles/theme";
import AmaSort from "./AmaSort";
import Avatar from "./Avatar";
import CommentBox from "./CommentBox";
import Comments from "./Comments";
import Dot from "./Dot";
import IconArrowLeft from "./Icons/IconArrowLeft";
import IconArticle from "./Icons/IconArticle";
import IconLike from "./Icons/IconLike";
import IconLiked from "./Icons/IconLiked";
import IconShare from "./Icons/IconShare";
import Live from "./Live";
import Names from "./Names";
import { OverlayContext, OverlayType } from "./Overlay";
import Stacked from "./Stacked";

const placeholderContent =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas non dignissim nisi. Quisque imperdiet ornare nunc nec dapibus. In scelerisque turpis eget purus pharetra commodo.";

export type Sort = "Top questions" | "New questions";

export default function Ama({ article, comments }) {
  const [parentId, setParentId] = useState(null);
  const [editId, setEditId] = useState(null);
  const { showOverlay } = useContext(OverlayContext);
  const session = useSession();
  const [sort, setSort] = useState<Sort>("Top questions");

  const router = useRouter();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: ["post", router.query.slug],
    mutationFn: (like: any) => {
      return fetch("/api/ama/like", {
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

  const conatinerRef = useRef<HTMLDivElement>();

  const groupedComments = useMemo(() => {
    const sortByLikes = (a, b) => {
      return b._count.likes - a._count.likes;
    };

    const sortByEarliest = (date1, date2) => {
      return (
        new Date(date2.createdAt).getTime() -
        new Date(date1.createdAt).getTime()
      );
    };

    const sortMethod = sort === "Top questions" ? sortByLikes : sortByEarliest;

    return formatNestedComments(comments).sort(sortMethod);
  }, [sort, comments]);

  const [showStick, setShowSticky] = useState(false);
  const stickyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const { top } = stickyRef.current.getBoundingClientRect();
      setShowSticky(top === 0);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Test>
      <Shadows />
      <div>
        <Link href="/ama">
          <BackLink>
            <IconArrowLeft />
          </BackLink>
        </Link>
      </div>
      <div style={{ width: "100%" }}>
        <Container>
          <Details ref={conatinerRef}>
            <FlexBetween>
              <Authors>
                <Names authors={article.authors} />
                <Dot />
                <Flex>
                  <DateContainer>
                    {new Intl.DateTimeFormat("en", {
                      day: "numeric",
                      month: "short",
                    }).format(new Date(article.updatedAt))}
                  </DateContainer>
                  {article.live && <Live onlyDot />}{" "}
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
          </Details>
        </Container>
        <Container
          style={{ position: "sticky", top: 0, paddingTop: 12 }}
          ref={stickyRef}
        >
          <div />
          <div>
            <FlexBetween>
              <Absolute
                style={{
                  opacity: showStick ? 1 : 0,
                  pointerEvents: showStick ? "initial" : "none",
                }}
              >
                <AbsoluteTitle>{article.title}</AbsoluteTitle>
                <StackedContainer>
                  <Stacked
                    size={18}
                    direction="right"
                    elements={article.authors.map((author) => (
                      <Avatar src={author.image} size={18} outline={false} />
                    ))}
                  />
                </StackedContainer>
              </Absolute>
              <Actions
                style={{
                  opacity: showStick ? 0 : 1,
                  pointerEvents: showStick ? "none" : "initial",
                }}
              >
                <Action>
                  <StyledButton
                    onClick={(event) => handleLike(event, article)}
                    style={article.liked ? { color: theme.colors.white } : {}}
                  >
                    {article.liked ? <IconLiked /> : <IconLike />}{" "}
                    {article._count.likes > 0 && (
                      <span>{article._count.likes}</span>
                    )}
                  </StyledButton>
                </Action>
                <Action>
                  <StyledLink
                    href={article.source}
                    target="_blank"
                    rel="noopener"
                  >
                    <IconArticle /> <span>View article</span>
                  </StyledLink>
                </Action>
                <Action>
                  <StyledButton>
                    <IconShare /> <span>Share</span>
                  </StyledButton>
                </Action>
              </Actions>
            </FlexBetween>
            <AmaSort article={article} sort={sort} setSort={setSort} />
          </div>
        </Container>
        <CommentsContainer>
          <Comments
            comments={groupedComments}
            setParentId={setParentId}
            parentId={parentId}
            setEditId={setEditId}
            editId={editId}
            article={article}
          />
        </CommentsContainer>
        <CommentBox
          article={article}
          comments={comments}
          conatinerRef={conatinerRef}
          setParentId={setParentId}
          parentId={parentId}
          setEditId={setEditId}
          editId={editId}
        />
      </div>
    </Test>
  );
}

const Test = styled.div`
  position: relative;
  display: flex;
`;

const Absolute = styled.div`
  position: absolute;
  top: 0;
  display: flex;
  justify-content: space-between;
  width: 100%;
  transition: opacity 0.15s ease;
  padding-top: 5px;
`;

const AbsoluteTitle = styled.div`
  font-family: ${(p) => p.theme.fontFamily.nouvelle};
  font-weight: 500;
  font-size: 18px;
  line-height: 120%;
  color: ${(p) => p.theme.colors.white};
  max-width: 690px;
  ${ellipsis};
`;

const Shadows = styled.div`
  &::before {
    content: "";
    position: fixed;
    width: 100%;
    height: 180px;
    left: 0;
    top: 0;
    background: linear-gradient(#000 50%, transparent 100%);
    z-index: 2;
    pointer-events: none;

    ${mq.desktopSmall} {
      background: linear-gradient(#000 87%, transparent 100%);
      height: 180px;
    }

    ${mq.phablet} {
      display: none;
    }
  }

  &::after {
    content: "";
    position: fixed;
    width: 100%;
    height: 200px;
    left: 0;
    bottom: 0;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 33%);
    pointer-events: none;
    z-index: 2;

    ${mq.desktopSmall} {
      bottom: 0;
    }

    ${mq.phablet} {
      height: 60px;
      background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%);
    }
  }
`;

const BackLink = styled.a`
  display: inline-block;
  position: sticky;
  top: 16px;
  transition: transform 0.25s ease;
  z-index: 3;

  &:hover {
    transform: translateX(-3px);
  }
`;

const CommentsContainer = styled.div`
  margin-top: 24px;
  padding: 0 0 160px 32px;
  max-width: 689px;
`;

const DateContainer = styled.span`
  margin-right: 8px;
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
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${mq.phablet} {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 10px;
  }
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding-bottom: 22px;
  transition: opacity 0.15s ease;
`;

const Action = styled.div`
  margin-right: 24px;
`;

const Details = styled.div``;

const Container = styled.div`
  z-index: 3;
  position: relative;
  padding-left: 32px;
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
  display: flex;
  align-items: center;
  color: ${(p) => p.theme.colors.light_grey};
  font-size: 10px;

  span {
    margin-left: 8px;
  }

  &:hover {
    color: ${(p) => p.theme.colors.off_white};
  }
`;

const StyledButton = styled.button`
  display: flex;
  align-items: center;
  color: ${(p) => p.theme.colors.light_grey};
  font-size: 10px;

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
