import { useSession } from "next-auth/react";
import { useCallback, useContext, useState } from "react";
import styled from "styled-components";
import Avatar from "./Avatar";
import Comments from "./Comments";
import CommentBox from "./Forms/CommentBox";
import { OverlayContext, OverlayType } from "./Overlay";

const placeholderContent =
  "Hello! My name is Lachy and I created this site! bleeding edge is a feed of noteworthy developments in AI. this site is very much a work in progress. please send suggestions and feedback!";

export default function Ama({ article, comments }) {
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState("");
  const [parentId, setParentId] = useState(null);
  const { showOverlay } = useContext(OverlayContext);
  const session = useSession();

  const handleCommentChange = useCallback(
    (event: React.FormEvent<HTMLTextAreaElement>) => {
      setComment(event.currentTarget.value);
    },
    [setComment]
  );

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      if (session.status === "unauthenticated") {
        return showOverlay(OverlayType.AUTHENTICATION);
      }

      setLoading(true);
      try {
        const response = await fetch("/api/comments", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: comment,
            postId: article.id,
            parentId,
            userId: session.data.user.id,
          }),
        });
        const res = await response.json();
        if (res.error) {
          throw Error;
        }
        setLoading(false);
        setComment("");
        setParentId("");
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
        <Details>
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
        </Details>
      </Container>
      {/* <CommentBoxContainer> */}
      {/* </CommentBoxContainer> */}
      <div style={{ marginTop: 24, paddingLeft: 54 }}>
        <Comments comments={comments} setParentId={setParentId} />
      </div>

      <div style={{ paddingBottom: 120 }}>
        <form onSubmit={handleSubmit}>
          <CommentBox value={comment} onChange={handleCommentChange} />
          <button>Submit {parentId && `reply to ${parentId}`}</button>
        </form>
      </div>
    </>
  );
}

const Details = styled.div`
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  padding-bottom: 24px;
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
  z-index: 3;
  position: sticky;
  top: 40px;
  background: ${(p) => p.theme.colors.black};
`;

const Top = styled.div`
  font-weight: 500;
  font-size: 18px;
  line-height: 120%;
  display: flex;
  justify-content: space-between;
`;

const Middle = styled.div``;

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
