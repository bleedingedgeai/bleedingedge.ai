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
import Badges from "./Badges";
import Dot from "./Dot";
import IconLike from "./Icons/IconLike";
import IconLiked from "./Icons/IconLiked";
import IconReply from "./Icons/IconReply";
import IconShare from "./Icons/IconShare";
import IconTwitter from "./Icons/IconTwitter";
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
          <Container key={article.id}>
            {live && <MobileGlow />}
            <AvatarContainer>
              <Avatar src={article.authors[0].image} superHighlight={live} />
              {article.authors.length > 1 && (
                <AuthorCount>{article.authors.length}</AuthorCount>
              )}
            </AvatarContainer>
            <Main live={live}>
              <Link key={article.id} href={amaHref}>
                <Top>
                  <TopLeft style={{ display: "flex" }}>
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
                    {article.imported && (
                      <ImportedContainer>
                        <Badges.Twitter />
                      </ImportedContainer>
                    )}
                  </TopLeft>

                  <Flex>
                    {article.live && <Live />}{" "}
                    <DateContainer>{updatedAt}</DateContainer>
                  </Flex>
                </Top>
                <Middle>
                  <Title>{article.title}</Title>
                  <Content>{article.content}</Content>
                </Middle>
              </Link>

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
                    <StyledButton onClick={() => router.push(amaHref)}>
                      <IconReply fill={theme.colors.light_grey} />{" "}
                      {article._count.comments > 0 && (
                        <span>{article._count.comments}</span>
                      )}
                    </StyledButton>
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

const TopLeft = styled.span`
  display: flex;
  align-items: center;
`;

const ImportedContainer = styled.span`
  margin-left: 9px;
`;

const Container = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 18px 1fr;
  grid-gap: 36px;
  margin-bottom: 18px;

  &:last-of-type {
    margin-bottom: 120px;
  }

  ${mq.tablet} {
    grid-gap: 18px;
  }

  ${mq.phablet} {
    grid-gap: 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.16);
  }
`;

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

const Badge = styled.div`
  font-family: ${(p) => p.theme.fontFamily.nouvelle};
  font-style: normal;
  font-weight: 500;
  font-size: 10px;
  line-height: 130%;
  color: ${(p) => p.theme.colors.light_grey};
  background: #141414;
  border-radius: 77px;
  display: flex;

  align-items: center;

  padding: 1px 4px 1px 8px;

  svg {
    margin-left: 6px;
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
  z-index: 1;
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

  ${mq.desktopMaxUp} {
    font-size: 16px;
  }
`;

const Content = styled.p`
  font-family: ${(p) => p.theme.fontFamily.nouvelle};
  font-size: 13px;
  line-height: 120%;
  color: ${(p) => p.theme.colors.light_grey};
  max-width: 612px;
  transition: color 0.2s ease;

  ${mq.desktopMaxUp} {
    font-size: 14px;
  }
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 10px;
  color: ${(p) => p.theme.colors.off_white};

  ${mq.desktopMaxUp} {
    font-size: 12px;
  }

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
