import Fuse from "fuse.js/dist/fuse.basic";
import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { useCallback, useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { QueryClient, dehydrate, useQuery } from "@tanstack/react-query";
import { getPrettyHostname } from "../components/Article";
import Button from "../components/Button";
import IconArrow from "../components/Icons/IconArrow";
import Layout from "../components/Layout";
import { OverlayContext, OverlayType } from "../components/Overlay/Overlay";
import SEO from "../components/SEO";
import { sortByEarliest, sortByLatest } from "../components/Timeline";
import { clean } from "../helpers/json";
import { useArticleMutations } from "../lib/hooks/useArticleMutations";
import prisma from "../lib/prisma";
import { mq } from "../styles/mediaqueries";
import { authOptions } from "./api/auth/[...nextauth]";
import { Sort } from ".";

export const ADMINS = ["lachygroom", "brotzky_", "tcosta_co", "davidtsong", "jtvhk"];

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!session || !ADMINS.includes(session.user.username)) {
    return {
      notFound: true,
    };
  }

  const queryClient = new QueryClient();
  const articles = await queryClient.fetchQuery(["articles"], async () => {
    const posts = await prisma.post.findMany({});
    return clean(posts);
  });

  return {
    props: {
      articles: clean(articles),
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default function Home() {
  const { data: articlesFromQuery } = useQuery({
    queryKey: ["articles"],
    queryFn: async () => {
      return await (await fetch(`/api/article`)).json();
    },
  });

  const { showOverlay } = useContext(OverlayContext);

  const [filteredArticles, setFilteredArticles] = useState(articlesFromQuery);
  const [value, setValue] = useState("");
  const [sort, setSort] = useState<Sort>("Latest");
  const sortMethod = sort === "Latest" ? sortByLatest : sortByEarliest;

  ////////////////////////////////////////////////////////////////
  // Search articles
  ////////////////////////////////////////////////////////////////

  useEffect(() => {
    if (value) {
      const fuse = new Fuse(articlesFromQuery, {
        threshold: 0.3,
        keys: ["title", "source"],
      });
      const results = value
        ? fuse.search(value).map((result) => result?.item)
        : articlesFromQuery;

      setFilteredArticles(results);
    } else {
      setFilteredArticles(articlesFromQuery);
    }
  }, [value, articlesFromQuery]);

  ////////////////////////////////////////////////////////////////
  // Keyboard events
  ////////////////////////////////////////////////////////////////

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "Escape":
          setValue("");
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [setValue]);

  ////////////////////////////////////////////////////////////////
  // Methods
  ////////////////////////////////////////////////////////////////

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setValue(value);
    },
    []
  );

  const handleSortClick = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      setSort((prev) => (prev === "Latest" ? "Earliest" : "Latest"));
    },
    [setSort]
  );

  const articleMutations = useArticleMutations({});

  const handleDelete = (event: React.MouseEvent, article) => {
    event.preventDefault();
    event.stopPropagation();
    return showOverlay(OverlayType.CONFIRMATION, {
      heading: "Deleting article",
      text: `Are you sure you want to delete "${article.title}"?`,
      right: {
        text: "Delete",
        action: () => articleMutations.delete.mutate(article.id),
      },
      delete: true,
    });
  };

  return (
    <>
      <SEO title="Admin | bleeding edge" />
      <Layout>
        <FilterAndSortSticky>
          <Container>
            <SortContainer onClick={handleSortClick}>
              <SortArrow
                style={sort === "Latest" ? {} : { transform: "rotate(180deg" }}
              >
                <IconArrow />
              </SortArrow>
              <SortButton>
                Sort by <span>:: {sort}</span>
              </SortButton>
            </SortContainer>
            <Right>
              <StyledInput
                value={value}
                onChange={handleChange}
                placeholder="Search articles"
              />
              <StyledButton
                onClick={() =>
                  showOverlay(OverlayType.ARTICLE, { article: null })
                }
              >
                Create
              </StyledButton>
            </Right>
          </Container>
        </FilterAndSortSticky>
        <Shadow />
        <Timeline>
          {filteredArticles
            .sort((a, b) => sortMethod(a.postedAt, b.postedAt))
            .map((a) => (
              <ArticleContainer
                key={a.id}
                onClick={() => showOverlay(OverlayType.ARTICLE, { article: a })}
              >
                <IconDot />
                <Flex key={a.id}>
                  <Title>{a.title}</Title>
                  <Grey>
                    {new Intl.DateTimeFormat("en", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                    }).format(new Date(a.postedAt))}
                  </Grey>
                </Flex>
                <Flex>
                  <Grey>{getPrettyHostname(a.source)}</Grey>
                  <Danger onClick={(event) => handleDelete(event, a)}>
                    Delete
                  </Danger>
                </Flex>
              </ArticleContainer>
            ))}
        </Timeline>
      </Layout>
    </>
  );
}

const FilterAndSortSticky = styled.div`
  position: sticky;
  top: 40px;
  z-index: 210000;

  ${mq.desktopSmall} {
    top: 121px;
  }

  ${mq.phablet} {
    top: 112px;
  }
`;

const StyledInput = styled.input`
  font-family: ${(p) => p.theme.fontFamily.nouvelle};
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  color: #fff;
  padding: 8px 14px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid transparent;
  border-radius: 7px;
  transition: background 0.2s ease, border-color 0.2s ease;
  margin-right: 8px;
  min-width: 200px;

  &::placeholder {
    color: rgba(255, 255, 255, 0.12);
  }

  &:hover {
    border-color: rgba(255, 255, 255, 0.06);
  }

  &:focus {
    border-color: rgba(255, 255, 255, 0.1);
  }
`;

const IconDot = styled.div`
  position: absolute;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${(p) => p.theme.colors.off_white};
  box-shadow: 0 0 0 6px ${(p) => p.theme.colors.black};
  z-index: 1;
  left: -27px;
  top: 24px;

  ${mq.desktopSmall} {
    left: 29px;
    top: 30px;
    box-shadow: none;
  }

  ${mq.phablet} {
    display: none;
  }
`;

const Danger = styled.button`
  font-size: 11px;
  color: ${(p) => p.theme.colors.magenta};
  opacity: 0;
  transition: opacity 0.1s;
  padding-top: 2px;
`;

const ArticleContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  margin-bottom: 8px;
  background: #090808;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 7px;
  padding: 12px 16px;
  transition: background 0.1s ease, border-color 0.1s ease;

  margin-left: 22px;

  &:hover {
    background: #141414;
    border-color: rgba(255, 255, 255, 0.18);
  }

  &:hover ${Danger} {
    opacity: 1;
  }
`;

const Flex = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Title = styled.span`
  font-size: 14px;
  font-family: ${(p) => p.theme.fontFamily.nouvelle};
`;

const Grey = styled.span`
  font-size: 11px;
  color: ${(p) => p.theme.colors.light_grey};
`;

const Right = styled.div`
  display: flex;
  align-items: center;
`;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 54px;
  position: relative;
  z-index: 10;

  ${mq.desktopSmall} {
    margin-bottom: 64px;
  }

  ${mq.tablet} {
    display: none;
  }
`;

const SortContainer = styled.div`
  display: flex;
  align-items: center;
`;

const SortArrow = styled.button`
  transition: transform 0.25s ease;

  ${mq.phablet} {
    svg {
      width: 16px;
      height: 16px;
    }
  }
`;

const SortButton = styled.button`
  margin-left: 17px;
  padding: 7px 14px 8px;
  background: rgba(255, 255, 255, 0);
  border-radius: 5px;
  transition: background 0.25s ease;

  span {
    color: ${(p) => p.theme.colors.light_grey};
  }

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }

  ${mq.desktopSmall} {
    margin-left: 8px;
    font-size: 14px;
  }

  ${mq.phablet} {
    font-size: 14px;
    margin-left: -6px;

    &:hover {
      background: transparent;
    }

    span {
      display: none;
    }
  }
`;

const StyledButton = styled.button<{ color?: string; background?: string }>`
  background: ${(p) => p.background || p.theme.colors.white};
  border-radius: 7px;
  font-family: ${(p) => p.theme.fontFamily.nouvelle};
  font-weight: 500;
  font-size: 14px;
  line-height: 125%;
  text-align: center;
  color: ${(p) => p.color || p.theme.colors.black};
  text-shadow: 0px 0px 10px rgba(71, 159, 250, 0.25);
  padding: 8px 16px;
  width: 100%;
  transition: box-shadow 0.25s ease, background 0.25s ease;

  &:focus {
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.8),
      0 0 0 3px rgba(255, 255, 255, 0.24);
  }

  &:disabled {
    cursor: default;
    background: ${(p) => p.theme.colors.off_white};
  }
`;

const Timeline = styled.div`
  position: relative;
  border-left: 1px solid rgba(255, 255, 255, 0.42);
  padding-bottom: 120px;
  margin-left: 12px;
  min-height: calc(100vh - 132px);

  &::after {
    content: "";
    position: absolute;
    left: -1px;
    top: -24px;
    width: 1px;
    height: 24px;
    background: linear-gradient(180deg, transparent, rgba(255, 255, 255, 0.42));
  }

  ${mq.desktopSmall} {
    padding-bottom: 160px;
    min-height: calc(100vh - 218px);
  }

  ${mq.tablet} {
    margin-left: 7px;
  }

  ${mq.phablet} {
    padding-bottom: 80px;
    min-height: calc(100vh - 172px);
    border: none;
    margin-left: 0;
  }
`;

const Shadow = styled.div`
  &::before {
    content: "";
    position: fixed;
    width: 100%;
    height: 124px;
    left: 0;
    top: 0;
    background: linear-gradient(#000 50%, transparent 100%);
    z-index: 2;
    pointer-events: none;

    ${mq.desktopSmall} {
      background: linear-gradient(#000 87%, transparent 100%);
      height: 180px;
    }

    ${mq.tablet} {
      display: none;
    }
  }

  &::after {
    content: "";
    position: fixed;
    width: 100%;
    height: 143px;
    left: 0;
    bottom: 0;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%);
    pointer-events: none;
    z-index: 2;

    ${mq.desktopSmall} {
      bottom: 0;
    }

    ${mq.tablet} {
      height: 60px;
      background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%);
    }
  }
`;
