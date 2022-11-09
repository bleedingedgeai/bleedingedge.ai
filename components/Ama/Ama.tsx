import { useSession } from "next-auth/react";
import Link from "next/link";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import Document from "@tiptap/extension-document";
import History from "@tiptap/extension-history";
import TipTapLink from "@tiptap/extension-link";
import Mention from "@tiptap/extension-mention";
import Paragraph from "@tiptap/extension-paragraph";
import Placeholder from "@tiptap/extension-placeholder";
import Text from "@tiptap/extension-text";
import { useEditor } from "@tiptap/react";
import { uniqBy } from "../../helpers/methods";
import {
  STORAGE_COMMENT,
  STORAGE_EDIT,
  STORAGE_REPLY,
} from "../../helpers/storage";
import { copyToClipboard } from "../../helpers/string";
import { useArticleMutations } from "../../lib/hooks/useArticleMutations";
import { formatNestedComments } from "../../pages/ama/[slug]";
import { ArticleWithLike, CommentWithChildren } from "../../prisma/types";
import { ellipsis } from "../../styles/css";
import { mq } from "../../styles/mediaqueries";
import { theme } from "../../styles/theme";
import { AlertsContext } from "../Alerts/AlertsProvider";
import Comments from "../Comments/Comments";
import CommentsEmptyState from "../Comments/CommentsEmptyState";
import CommentsInput from "../Comments/CommentsInput";
import Dot from "../Dot";
import Hosts from "../Hosts";
import IconArrowLeft from "../Icons/IconArrowLeft";
import IconArticle from "../Icons/IconArticle";
import IconLike from "../Icons/IconLike";
import IconLiked from "../Icons/IconLiked";
import IconShare from "../Icons/IconShare";
import IconTwitter from "../Icons/IconTwitter";
import Live from "../Live";
import suggestion from "../Mention/suggestion";
import Names from "../Names";
import { OverlayContext, OverlayType } from "../Overlay/Overlay";
import AmaSort from "./AmaSort";

export type Sort = "Top questions" | "New questions";

interface AmaProps {
  article: ArticleWithLike;
  comments: CommentWithChildren[];
}

export default function Ama({ article, comments }: AmaProps) {
  const [replyingToId, setReplyingToId] = useState(null);
  const [edittingId, setEdittingId] = useState(null);
  const [showSticky, setShowSticky] = useState(false);
  const [sort, setSort] = useState<Sort>("Top questions");

  const { showAlert } = useContext(AlertsContext);
  const { showOverlay } = useContext(OverlayContext);
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  const session = useSession();
  const articleMutations = useArticleMutations({});

  /////////////////////////////////////////////////////////
  // Storage Keys
  /////////////////////////////////////////////////////////

  const editKey = `${STORAGE_EDIT}-${article.slug}`;
  const replyKey = `${STORAGE_REPLY}-${article.slug}`;
  const commentKey = `${STORAGE_COMMENT}-${article.slug}`;

  /////////////////////////////////////////////////////////
  // Editor
  /////////////////////////////////////////////////////////

  const allAuthors = useMemo(() => {
    const postAuthors = article.authors;
    const commentAuthors = comments
      .filter((comment) => comment.author)
      .map(({ author }) => author);
    return uniqBy([...postAuthors, ...commentAuthors], (a) => a.id);
  }, [comments, article.authors]);

  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      TipTapLink,
      History,
      Placeholder.configure({
        placeholder: "Ask me anything...",
      }),
      Mention.configure({
        HTMLAttributes: { class: "mention" },
        suggestion: suggestion(article.authors, allAuthors),
      }),
    ],
    onCreate({ editor }) {
      const fromStorage = localStorage.getItem(commentKey);
      if (fromStorage) {
        editor.commands.setContent(fromStorage);
      }
    },
    onUpdate({ editor }) {
      if (editor.isEmpty) {
        localStorage.removeItem(commentKey);
      } else {
        localStorage.setItem(commentKey, editor.getHTML());
      }
    },
  });

  /////////////////////////////////////////////////////////
  // Comments
  /////////////////////////////////////////////////////////

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

  const showEmptyState = groupedComments.length === 0;

  useEffect(() => {
    setEdittingId(localStorage.getItem(editKey));
    setReplyingToId(localStorage.getItem(replyKey));
  }, []);

  /////////////////////////////////////////////////////////
  // Handle methods
  /////////////////////////////////////////////////////////

  const handleAmaLike = (event: React.MouseEvent, article) => {
    event.preventDefault();

    if (article.disabled) {
      return;
    }

    if (session.status === "unauthenticated") {
      return showOverlay(OverlayType.AUTHENTICATION);
    }

    articleMutations.like.mutate({
      userId: session.data.user.id,
      postId: article.id,
    });
  };

  const handleAmaShare = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    copyToClipboard(window.location.href);
    showAlert({
      icon: () => <IconShare fill={theme.colors.white} />,
      text: `Link copied to clipboard`,
    });
  };

  /////////////////////////////////////////////////////////
  // Sticky scroll
  /////////////////////////////////////////////////////////

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
  }, [stickyRef]);

  const sharedProps = {
    article,
    containerRef,
    setReplyingToId,
    replyingToId,
    setEdittingId,
    edittingId,
    editor,
  };

  return (
    <>
      <Container>
        <Shadows showEmptyState={showEmptyState} />
        <BackLinkContainer>
          <Link href="/ama">
            <BackLink>
              <IconArrowLeft />
            </BackLink>
          </Link>
        </BackLinkContainer>
        <div style={{ width: "100%", position: "relative" }}>
          <Main>
            <div ref={containerRef}>
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
                  {article.imported && (
                    <Badge>
                      <span>Imported</span>
                      <IconTwitter size={14} />
                    </Badge>
                  )}
                </Authors>
                <Hosts authors={article.authors} />
              </FlexBetween>
              <Title>{article.title}</Title>
              <Content>{article.content}</Content>
            </div>
          </Main>
          <MainSticky ref={stickyRef}>
            <div />
            <div>
              <MobileGlow />
              <FlexBetween>
                <Absolute
                  style={{
                    opacity: showSticky ? 1 : 0,
                    pointerEvents: showSticky ? "initial" : "none",
                  }}
                >
                  <AbsoluteTitle>{article.title}</AbsoluteTitle>
                  <Hosts authors={article.authors} />
                </Absolute>
                <Actions
                  style={{
                    opacity: showSticky ? 0 : 1,
                    pointerEvents: showSticky ? "none" : "initial",
                  }}
                >
                  <Action>
                    <StyledButton
                      disabled={article.disabled}
                      onClick={(event) => handleAmaLike(event, article)}
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
                    <StyledButton onClick={handleAmaShare}>
                      <IconShare /> <span>Share</span>
                    </StyledButton>
                  </Action>
                </Actions>
              </FlexBetween>
              <AmaSort article={article} sort={sort} setSort={setSort} />
            </div>
          </MainSticky>
          {showEmptyState ? null : (
            <CommentsContainer>
              <Comments {...sharedProps} comments={groupedComments} />
            </CommentsContainer>
          )}
          <CommentsInput {...sharedProps} comments={comments} />
        </div>
      </Container>
      {showEmptyState && <CommentsEmptyState containerRef={containerRef} />}
    </>
  );
}

const Container = styled.div`
  position: relative;
  display: flex;
  padding-bottom: 160px;
`;

const Main = styled.div`
  z-index: 3;
  position: relative;
  padding-left: 32px;

  ${mq.desktopSmall} {
    padding-left: 0;
  }
`;

const MainSticky = styled(Main)`
  position: sticky;
  top: 0;
  padding-top: 12px;

  ${mq.desktopSmall} {
    position: relative;
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

const Shadows = styled.div<{ showEmptyState: boolean }>`
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
      display: none;
    }
  }

  &::after {
    content: "";
    position: fixed;
    width: 100%;
    height: ${(p) => (p.showEmptyState ? "0" : "200px")};
    left: 0;
    bottom: 0;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 33%);
    pointer-events: none;
    z-index: 2;

    ${mq.tablet} {
      height: 160px;
      background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%);
    }
  }
`;

const BackLinkContainer = styled.div`
  ${mq.desktopSmall} {
    display: none;
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
  padding-left: 32px;
  max-width: 689px;

  ${mq.desktopSmall} {
    padding-left: 0;
  }
`;

const DateContainer = styled.span`
  margin-right: 8px;
`;

const FlexBetween = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
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

const Title = styled.h2`
  font-family: ${(p) => p.theme.fontFamily.nouvelle};
  font-weight: 500;
  font-size: 18px;
  line-height: 120%;
  color: ${(p) => p.theme.colors.white};
  margin-bottom: 8px;
  max-width: 690px;

  ${mq.tablet} {
    margin-bottom: 6px;
  }
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

  ${mq.tablet} {
    margin-bottom: 3px;
  }
`;

const StyledLink = styled.a`
  display: flex;
  align-items: center;
  color: ${(p) => p.theme.colors.light_grey};
  font-size: 10px;
  transition: color 0.2s ease;

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

  ${mq.tablet} {
    font-size: 12px;
  }
`;

const StyledButton = styled.button<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  color: ${(p) => p.theme.colors.light_grey};
  font-size: 10px;
  transition: color 0.2s ease;

  span {
    margin-left: 8px;
  }

  svg path {
    transition: fill 0.2s ease;
  }

  ${(p) =>
    p.disabled
      ? "cursor: default;"
      : `&:hover {
    color: ${p.theme.colors.off_white};

    svg path {
      fill: ${p.theme.colors.off_white};
    }
  }`}

  ${mq.tablet} {
    font-size: 12px;
  }
`;

const MobileGlow = styled.div`
  position: absolute;
  left: 6.53%;
  right: 6.53%;
  bottom: 46px;
  height: 124px;
  background: radial-gradient(
    47.07% 100% at 50% 100%,
    rgba(52, 39, 32, 0.364) 0%,
    rgba(52, 39, 32, 0) 100%
  );

  ${mq.desktopSmallUp} {
    display: none;
  }
`;
