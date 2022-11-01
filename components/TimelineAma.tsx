import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useContext } from "react";
import styled from "styled-components";
import { slugify } from "../helpers/string";
import { Sort } from "../pages";
import { theme } from "../styles/theme";
import Avatar from "./Avatar";
import IconAma from "./Icons/IconAma";
import IconShare from "./Icons/IconShare";
import IconUpvote from "./Icons/IconUpvotes";
import { OverlayContext, OverlayType } from "./Overlay";

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

  return (
    <>
      {articles.map((article) => {
        const amaHref = `/ama/${slugify(article.title)}`;
        const live = article.live;

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

        return (
          <Container
            key={article.id}
            onClick={() => router.push(amaHref)}
            live={live}
          >
            <div>
              {article.authors.map((author) => (
                <Avatar key={author.id} src={author.image} highlight={live} />
              ))}
            </div>
            <Main>
              <Top>
                <div>
                  {article.authors.map((author) => (
                    <Authors key={author.id}>{author.name} </Authors>
                  ))}
                </div>
              </Top>
              <Middle>
                <Title>{article.title}</Title>
                <Content>{article.content || placeholderContent}</Content>
              </Middle>
              <Bottom>
                <Actions>
                  <Action>
                    <StyledButton onClick={handleUpvoteClick}>
                      <IconUpvote /> <span>{article._count.votes}</span> upvotes
                    </StyledButton>
                  </Action>
                  <Action>
                    <Link href={amaHref}>
                      <StyledLink>
                        <IconAma fill={theme.colors.light_grey} />{" "}
                        <span>{article._count.comments}</span> comments
                      </StyledLink>
                    </Link>
                  </Action>
                  <Action>
                    <StyledButton>
                      <IconShare />
                    </StyledButton>
                  </Action>
                </Actions>
              </Bottom>
            </Main>
          </Container>
        );
      })}
    </>
  );
}

const Main = styled.div`
  position: relative;
`;

const Container = styled.div<{ live: boolean }>`
  display: grid;
  grid-template-columns: 18px 1fr;
  grid-gap: 36px;
  margin-right: 21px;

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
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const Middle = styled.div`
  margin-bottom: 14px;
`;

const Title = styled.h2`
  font-family: ${(p) => p.theme.fontFamily.nouvelle};
  font-weight: 500;
  font-size: 14px;
  line-height: 120%;
  color: ${(p) => p.theme.colors.off_white};
  margin-bottom: 4px;
`;

const Content = styled.p`
  font-family: ${(p) => p.theme.fontFamily.nouvelle};
  font-size: 13px;
  line-height: 120%;
  color: #969696;
  max-width: 612px;
`;

const Authors = styled.div`
  font-size: 10px;
  line-height: 135%;
  color: ${(p) => p.theme.colors.off_white};
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
  color: ${(p) => p.theme.colors.light_grey};
`;

const StyledLink = styled.a`
  color: ${(p) => p.theme.colors.light_grey};

  &:hover {
    color: ${(p) => p.theme.colors.off_white};
  }
`;

const StyledButton = styled.button`
  display: flex;
  align-items: center;
  color: ${(p) => p.theme.colors.light_grey};

  span {
    margin: 0 6px;
  }

  &:hover {
    color: ${(p) => p.theme.colors.off_white};

    svg path {
      fill: ${(p) => p.theme.colors.off_white};
    }
  }
`;
