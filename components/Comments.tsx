import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { useSession } from "next-auth/react";
import { Fragment, useCallback, useContext, useState } from "react";
import styled from "styled-components";
import { theme } from "../styles/theme";
import Avatar from "./Avatar";
import IconAma from "./Icons/IconAma";
import IconUpvote from "./Icons/IconUpvotes";
import { OverlayContext, OverlayType } from "./Overlay";

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo("en-US");

export default function Comments(props) {
  return <CommentsRecursive {...props} />;
}

function CommentsRecursive({
  comments,
  index: parentIndex = 0,
  parentId,
  setParentId,
}) {
  const session = useSession();
  const { showOverlay } = useContext(OverlayContext);

  const handleUpvoteClick = useCallback(
    (event: React.MouseEvent, comment) => {
      event.preventDefault();
      event.stopPropagation();
      if (session.status === "unauthenticated") {
        return showOverlay(OverlayType.AUTHENTICATION);
      }

      fetch("/api/comments/vote", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          userId: session.data.user.id,
          commentId: comment.id,
        }),
      });
    },
    [session]
  );

  if (!comments) {
    return null;
  }

  return (
    <>
      {comments.map((comment) => {
        return (
          <Fragment key={comment.id}>
            <Container
              style={{
                marginLeft: parentIndex * 42,
                opacity: parentId ? (parentId === comment.id ? 1 : 0.36) : 1,
              }}
            >
              <Avatar src={comment.author.image} outline={false} />
              <div>
                <Author>
                  <span>{comment.author.name}</span> ·{" "}
                  {timeAgo.format(new Date(comment.updatedAt))}
                </Author>
                <Content>
                  {comment.id} | {comment.content}
                </Content>
                <Bottom>
                  <Actions>
                    <Action>
                      <StyledButton
                        onClick={(event) => handleUpvoteClick(event, comment)}
                      >
                        <IconUpvote />
                      </StyledButton>
                    </Action>
                    <Action>
                      <StyledButton onClick={() => setParentId(comment.id)}>
                        <IconAma /> <span>reply</span>
                      </StyledButton>
                    </Action>
                  </Actions>
                </Bottom>
              </div>
            </Container>
            <CommentsRecursive
              comments={comment.children}
              index={parentIndex + 1}
              setParentId={setParentId}
              parentId={parentId}
            />
          </Fragment>
        );
      })}
    </>
  );
}

const Content = styled.div`
  font-family: ${(p) => p.theme.fontFamily.nouvelle};
  font-size: 13px;
  line-height: 120%;
  color: ${(p) => p.theme.colors.light_grey};
  margin-bottom: 8px;
`;

const Author = styled.div`
  font-size: 10px;
  line-height: 135%;
  color: ${(p) => p.theme.colors.off_white};
  margin-bottom: 8px;
`;

const Container = styled.div`
  margin-bottom: 24px;
  display: grid;
  grid-template-columns: 18px 1fr;
  grid-gap: 24px;
  transition: opacity 0.25s ease;
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
  font-size: 10px;
`;

const StyledLink = styled.span`
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
