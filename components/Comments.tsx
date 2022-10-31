import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { useCallback } from "react";
import styled from "styled-components";
import { theme } from "../styles/theme";
import Avatar from "./Avatar";
import IconAma from "./Icons/IconAma";
import IconUpvote from "./Icons/IconUpvotes";

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo("en-US");

export default function Comments({ comments }) {
  return <CommentsRecursive comments={comments} />;
}

function CommentsRecursive({ comments, index: parentIndex = 0 }) {
  const handleUpvoteClick = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  if (!comments) {
    return null;
  }

  return (
    <>
      {comments.map((comment) => {
        return (
          <>
            <Container
              key={comment.id}
              style={parentIndex ? { marginLeft: parentIndex * 32 } : {}}
            >
              <Avatar src={comment.author.image} outline={false} />
              <div>
                <Author>
                  <span>{comment.author.name}</span> ·{" "}
                  {timeAgo.format(new Date(comment.updatedAt))}
                </Author>
                <Content>{comment.content}</Content>
                <Bottom>
                  <Actions>
                    <Action>
                      <StyledButton onClick={handleUpvoteClick}>
                        <IconUpvote /> <span>{comment.score}</span> upvotes
                      </StyledButton>
                    </Action>
                    <Action>
                      <StyledLink>
                        <IconAma fill={theme.colors.light_grey} />{" "}
                        <span>{comment.children.length || 0}</span> comments
                      </StyledLink>
                    </Action>
                  </Actions>
                </Bottom>
              </div>
            </Container>
            <CommentsRecursive
              comments={comment.children}
              index={parentIndex + 1}
            />
          </>
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
  margin-bottom: 12px;
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
  grid-gap: 16px;
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
