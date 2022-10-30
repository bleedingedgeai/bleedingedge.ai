import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback } from "react";
import styled from "styled-components";
import { IArticle } from "../db/articles";
import { slugify } from "../helpers/string";
import { Sort } from "../pages";
import { mq } from "../styles/mediaqueries";
import { theme } from "../styles/theme";
import IconAma from "./Icons/IconAma";
import IconShare from "./Icons/IconShare";
import IconUpvote from "./Icons/IconUpvotes";

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
  const sortMethod = sort === "Latest" ? sortByLatest : sortByEarliest;

  const handleUpvoteClick = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);
  return (
    <>
      {articles.map((article) => {
        const amaHref = `/ama/${slugify(article.title)}`;

        return (
          <Container onClick={() => router.push(amaHref)}>
            <div>
              {article.author.map((author) => (
                <AvatarContainer>
                  <Avatar src={author.image} />
                </AvatarContainer>
              ))}
            </div>
            <div>
              <Top>
                <div>
                  {article.author.map((author) => (
                    <Authors>{author.name}</Authors>
                  ))}
                </div>
                <div>{article.postedAt}</div>
              </Top>
              <Middle>
                <Title>{article.title}</Title>
                <Content>{article.content || placeholderContent}</Content>
              </Middle>
              <Bottom>
                <Actions>
                  <Action>
                    <StyledButton onClick={handleUpvoteClick}>
                      <IconUpvote /> <span>{article.score}</span> upvotes
                    </StyledButton>
                  </Action>
                  <Action>
                    <Link href={amaHref}>
                      <StyledLink>
                        <IconAma fill={theme.colors.light_grey} />{" "}
                        <span>{article.comments?.length || 0}</span> comments
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
            </div>
          </Container>
        );
      })}
    </>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-columns: 18px 1fr;
  grid-gap: 36px;
  margin-right: 21px;
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

const AvatarContainer = styled.div`
  position: relative;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  margin-right: 36px;
  display: grid;
  place-items: center;

  &::after {
    content: "";
    position: absolute;
    left: -2px;
    top: -2px;
    width: calc(100% + 4px);
    height: calc(100% + 4px);
    border-radius: 50%;
    border: 1px solid ${(p) => p.theme.colors.light_grey};
  }
`;

const Avatar = styled.img`
  width: 100%;
  border-radius: 50%;
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
