import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import styled from "styled-components";
import { copyToClipboard, slugify } from "../helpers/string";
import { useArticleMutations } from "../lib/hooks/useArticleMutations";
import { ArticleWithLike } from "../prisma/types";
import { mq } from "../styles/mediaqueries";
import { theme } from "../styles/theme";
import { AlertsContext } from "./Alerts/AlertsProvider";
import Avatar from "./Avatar";
import Dot from "./Dot";
import IconLike from "./Icons/IconLike";
import IconLiked from "./Icons/IconLiked";
import IconReply from "./Icons/IconReply";
import IconShare from "./Icons/IconShare";
import Live from "./Live";
import Names from "./Names";
import { OverlayContext, OverlayType } from "./Overlay/Overlay";
import Participants from "./Participants";

interface TimelineProps {
  articles: ArticleWithLike[];
}

export default function TimelineAma({ articles }: TimelineProps) {
  const router = useRouter();
  const session = useSession();
  const { showOverlay } = useContext(OverlayContext);
  const { showAlert } = useContext(AlertsContext);
  const articleMutations = useArticleMutations({});

  const handleLike = (event: React.MouseEvent, article) => {
    event.preventDefault();
    event.stopPropagation();

    if (article.disabled) {
      return;
    }

    if (session.status === "unauthenticated") {
      return showOverlay(OverlayType.AUTHENTICATION);
    }

    articleMutations.like.mutate({
      userId: session.data.user.id,
      postId: article.id,
      slug: article.slug,
    });
  };

  const handleShare = (event: React.MouseEvent, article) => {
    event.preventDefault();
    event.stopPropagation();

    copyToClipboard(
      `${process.env.NEXT_PUBLIC_URL}/ama/${slugify(article.title)}`
    );
    showAlert({
      icon: () => <IconShare fill={theme.colors.white} />,
      text: `Copied source to clipboard`,
    });
  };

  return (
    <>
      {articles.map((article) => {
        const amaHref = `/ama/${slugify(article.title)}`;
        const updatedAt = new Intl.DateTimeFormat("en", {
          day: "numeric",
          month: "short",
        }).format(new Date(article.updatedAt));
        const live = article.live;

        return (
          <Container key={article.id} onClick={() => router.push(amaHref)}>
            {live && <MobileGlow />}
            <AvatarContainer>
              <Avatar src={article.authors[0].image} superHighlight={live} />
              {article.authors.length > 1 && (
                <AuthorCount>{article.authors.length}</AuthorCount>
              )}
            </AvatarContainer>
            <Main live={live}>
              <Top>
                <span>
                  <Names authors={article.authors} />
                  <TabletDateContainer>
                    <Dot />
                    <span>{updatedAt}</span>
                  </TabletDateContainer>
                  <MobileDateContainer>
                    {live ? (
                      <Now>
                        <LiveDot style={{ marginRight: 6 }} />
                        Now
                      </Now>
                    ) : (
                      <>
                        <Dot />
                        <span>{updatedAt}</span>
                      </>
                    )}
                  </MobileDateContainer>
                </span>
                <Flex>
                  {article.live && <Live />}{" "}
                  <DateContainer>{updatedAt}</DateContainer>
                </Flex>
              </Top>
              <Middle>
                <Title>{article.title}</Title>
                <Content>{article.content}</Content>
              </Middle>
              <Bottom>
                <Actions>
                  <Action>
                    <StyledButton
                      disabled={article.disabled}
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
                        <IconReply fill={theme.colors.light_grey} />{" "}
                        {article._count.comments > 0 && (
                          <span>{article._count.comments}</span>
                        )}
                      </StyledLink>
                    </Link>
                  </Action>
                  <Action>
                    <StyledButton
                      onClick={(event) => handleShare(event, article)}
                    >
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

const MobileGlow = styled.div`
  position: absolute;
  left: 4.27%;
  right: 3.73%;
  height: 115px;
  bottom: 0;

  background: radial-gradient(
    47.07% 100% at 50% 100%,
    rgba(52, 39, 32, 0.52) 0%,
    rgba(52, 39, 32, 0) 100%
  );

  ${mq.phabletUp} {
    display: none;
  }
`;

const Flex = styled.div`
  display: flex;
  align-items: center;

  ${mq.phablet} {
    display: none;
  }
`;

const DateContainer = styled.span`
  min-width: 55px;
  text-align: right;
  ${mq.tablet} {
    display: none;
  }
`;

const TabletDateContainer = styled.span`
  ${mq.tabletUp} {
    display: none;
  }

  ${mq.phablet} {
    display: none;
  }
`;

const MobileDateContainer = styled.span`
  ${mq.phabletUp} {
    display: none;
  }
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

const Main = styled.div<{ live: boolean }>`
  position: relative;
  padding-bottom: 18px;

  border-bottom: 1px solid rgba(255, 255, 255, 0.16);

  ${mq.tablet} {
    border-bottom: none;
  }

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

        ${mq.phablet} {
          display: none;
        }
      }`}
`;

const Now = styled.span`
  margin-left: 8px;
  font-size: 10px;
  color: ${(p) => p.theme.colors.orange};
`;

const LiveDot = styled.span`
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${(p) => p.theme.colors.orange};
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

const Container = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 18px 1fr;
  grid-gap: 36px;
  cursor: pointer;
  margin-bottom: 18px;

  ${mq.tablet} {
    grid-gap: 18px;
  }

  ${mq.phablet} {
    grid-gap: 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.16);
  }
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 10px;
  color: ${(p) => p.theme.colors.off_white};

  ${mq.tablet} {
    margin-bottom: 4px;
  }
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

  ${mq.phablet} {
    margin-right: 36px;
  }
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

  svg path {
    transition: fill 0.2s ease;
  }

  &:hover {
    color: ${(p) => p.theme.colors.off_white};

    svg path {
      fill: ${(p) => p.theme.colors.off_white};
    }
  }
`;

const StyledButton = styled.button<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  color: ${(p) => p.theme.colors.light_grey};

  span {
    margin-left: 8px;
  }

  svg path {
    transition: fill 0.2s ease;
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
