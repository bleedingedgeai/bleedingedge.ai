import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useContext } from "react";
import styled from "styled-components";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { slugify } from "../helpers/string";
import { Sort } from "../pages";
import { theme } from "../styles/theme";
import Avatar from "./Avatar";
import IconAma from "./Icons/IconAma";
import IconLike from "./Icons/IconLike";
import IconLiked from "./Icons/IconLiked";
import IconShare from "./Icons/IconShare";
import Live from "./Live";
import Names from "./Names";
import { OverlayContext, OverlayType } from "./Overlay";
import Participants from "./Participants";

const placeholderContent =
  "Hello! My name is Lachy and I created this site! bleeding edge is a feed of noteworthy developments in AI. this site is very much a work in progress. please send suggestions and feedback!";

const sortByLatest = (date1, date2) => {
  return new Date(date2).getTime() - new Date(date1).getTime();
};

const sortByEarliest = (date1, date2) => {
  return new Date(date1).getTime() - new Date(date2).getTime();
};

interface TimelineProps {
  articles: any[];
  sort: Sort;
}

export default function TimelineAma({ articles, sort }: TimelineProps) {
  const router = useRouter();
  const session = useSession();
  const { showOverlay } = useContext(OverlayContext);
  const sortMethod = sort === "Latest" ? sortByLatest : sortByEarliest;

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: ["ama"],
    mutationFn: (like: any) => {
      return fetch("/api/ama/like", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(like),
      });
    },
    onMutate: async (newArticle) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: ["ama"],
      });

      // Snapshot the previous value
      const previousPosts = queryClient.getQueryData(["ama"]);

      // Optimistically update to the new value
      queryClient.setQueryData(["ama"], (articles: any) => {
        return articles.map((article) => {
          if (article.id == newArticle.postId) {
            const shouldLike = !article.liked;

            return {
              ...article,
              _count: {
                ...article._count,
                likes: shouldLike
                  ? article._count.likes + 1
                  : article._count.likes - 1,
              },
              liked: shouldLike,
            };
          }

          return article;
        });
      });

      // Return a context object with the snapshotted value
      return { previousPosts };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(["ama"], context.previousPosts);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["ama"] });
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

  return (
    <>
      {articles.map((article) => {
        const amaHref = `/ama/${slugify(article.title)}`;
        const live = article.live;

        return (
          <Container
            key={article.id}
            onClick={() => router.push(amaHref)}
            live={live}
          >
            <AvatarContainer>
              <Avatar src={article.authors[0].image} highlight={live} />
              {article.authors.length > 1 && (
                <AuthorCount>{article.authors.length}</AuthorCount>
              )}
            </AvatarContainer>
            <Main>
              <Top>
                <span>
                  <Names authors={article.authors} />
                </span>
                <Flex>
                  {article.live && <Live />}{" "}
                  <DateContainer>
                    {new Intl.DateTimeFormat("en", {
                      day: "numeric",
                      month: "short",
                    }).format(new Date(article.updatedAt))}
                  </DateContainer>
                </Flex>
              </Top>
              <Middle>
                <Title>{article.title}</Title>
                <Content>{article.content || placeholderContent}</Content>
              </Middle>
              <Bottom>
                <Actions>
                  <Action>
                    <StyledButton
                      onClick={(event) => handleLike(event, article)}
                    >
                      {article.liked ? <IconLiked /> : <IconLike />}{" "}
                      {article._count.likes > 0 && (
                        <span
                          style={
                            article.liked ? { color: theme.colors.white } : {}
                          }
                        >
                          {article._count.likes}
                        </span>
                      )}
                    </StyledButton>
                  </Action>
                  <Action>
                    <Link href={amaHref}>
                      <StyledLink>
                        <IconAma fill={theme.colors.light_grey} />{" "}
                        {article._count.likes > 0 && (
                          <span>{article._count.comments}</span>
                        )}
                      </StyledLink>
                    </Link>
                  </Action>
                  <Action>
                    <StyledButton>
                      <IconShare />
                    </StyledButton>
                  </Action>
                </Actions>
                <Participants article={article} />
              </Bottom>
            </Main>
          </Container>
        );
      })}
    </>
  );
}

const Flex = styled.div`
  display: flex;
  align-items: center;
`;

const DateContainer = styled.span`
  min-width: 55px;
  text-align: right;
`;

const AvatarContainer = styled.div`
  position: relative;
  left: 3px;
`;

const AuthorCount = styled.span`
  background: ${(p) => p.theme.colors.dark_grey};
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.64);
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-family: ${(p) => p.theme.fontFamily.nouvelle};
  font-size: 9px;
  color: ${(p) => p.theme.colors.white};
  top: -6px;
  right: -6px;
`;

const Main = styled.div`
  position: relative;
`;

const Title = styled.h2`
  font-family: ${(p) => p.theme.fontFamily.nouvelle};
  font-weight: 500;
  font-size: 14px;
  line-height: 120%;
  color: ${(p) => p.theme.colors.off_white};
  margin-bottom: 4px;
  transition: color 0.2s ease;
`;

const Content = styled.p`
  font-family: ${(p) => p.theme.fontFamily.nouvelle};
  font-size: 13px;
  line-height: 120%;
  color: ${(p) => p.theme.colors.light_grey};
  max-width: 612px;
  transition: color 0.2s ease;
`;

const Container = styled.div<{ live: boolean }>`
  display: grid;
  grid-template-columns: 18px 1fr;
  grid-gap: 36px;
  cursor: pointer;

  &:not(:last-of-type) {
    margin-bottom: 18px;

    ${Main} {
      padding-bottom: 18px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.16);

      ${(p) =>
        p.live &&
        `&::before {
        content: "";
        position: absolute;
        height: 1px;
        width: 100%;
        bottom: 0;
        right: 0;
        background: linear-gradient(
          269.71deg,
          #fa2162 5.75%,
          #d0a06a 35.19%,
          #c69660 67.12%,
          #fbea9e 98.41%
        );
      }`}
    }
  }

  &:hover ${Title} {
    color: ${(p) => p.theme.colors.white};
  }
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 10px;
  color: ${(p) => p.theme.colors.off_white};
`;

const Middle = styled.div`
  margin-bottom: 14px;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
`;

const Action = styled.div`
  margin-right: 24px;
`;

const Bottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${(p) => p.theme.colors.light_grey};
`;

const StyledLink = styled.a`
  display: flex;
  color: ${(p) => p.theme.colors.light_grey};

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
