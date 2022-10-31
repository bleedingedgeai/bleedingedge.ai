import { Fragment, useCallback, useState } from "react";
import styled from "styled-components";
import Avatar from "./Avatar";
import Comments from "./Comments";
import CommentBox from "./Forms/CommentBox";

const placeholderContent =
  "Hello! My name is Lachy and I created this site! bleeding edge is a feed of noteworthy developments in AI. this site is very much a work in progress. please send suggestions and feedback!";

export default function Ama({ article, comments }) {
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState("");

  const handleCommentChange = useCallback(
    (event: React.FormEvent<HTMLTextAreaElement>) => {
      setComment(event.currentTarget.value);
    },
    [setComment]
  );

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setLoading(true);
      try {
        const response = await fetch("/api/comment", {
          method: "post",
          body: JSON.stringify({ content: comment }),
        });
        const res = await response.json();
        if (res.error) {
          throw Error;
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    },
    [comment]
  );

  return (
    <>
      <Container>
        <div>
          {article.authors.map((author) => (
            <Avatar key={author.id} src={author.image} highlight />
          ))}
        </div>
        <div>
          <Top>
            <div>
              {article.authors.map((author) => (
                <Authors key={author.id}>{author.name}</Authors>
              ))}
            </div>
            <PostedAt>
              {article.id} | {article.postedAt}
            </PostedAt>
          </Top>
          <Middle>
            <Title>{article.title}</Title>
            <Content>{article.content || placeholderContent}</Content>
          </Middle>
          <Comments comments={comments} />
        </div>
      </Container>
      <CommentBoxContainer>
        <CommentBox value={comment} onChange={handleCommentChange} />
      </CommentBoxContainer>
    </>
  );
}

const CommentBoxContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 10;
`;

const PostedAt = styled.div`
  font-size: 10px;
  line-height: 135%;
  color: ${(p) => p.theme.colors.light_grey};
`;

const Container = styled.div`
  display: grid;
  grid-template-columns: 18px 1fr;
  grid-gap: 36px;
  margin-right: 21px;
`;

const Top = styled.div`
  font-weight: 500;
  font-size: 18px;
  line-height: 120%;
  display: flex;
  justify-content: space-between;
`;

const Middle = styled.div`
  margin-bottom: 50px;
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
  line-height: 120%;
  color: ${(p) => p.theme.colors.white};
  max-width: 612px;
  font-weight: 500;
  font-size: 18px;
  line-height: 120%;
`;

const Authors = styled.span`
  font-size: 10px;
  line-height: 135%;
  color: ${(p) => p.theme.colors.off_white};
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
