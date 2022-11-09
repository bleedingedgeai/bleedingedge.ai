import styled from "styled-components";
import { ArticleLive, ArticleWithLike } from "../prisma/types";
import Avatar from "./Avatar";
import Stacked from "./Stacked";

interface ParticipantsProps {
  article: ArticleWithLike | ArticleLive;
  hideExtraText?: boolean;
}

export default function Participants({
  article,
  hideExtraText,
}: ParticipantsProps) {
  const commentsWithAuthors = article?.comments?.filter((c) => c.author);

  if (commentsWithAuthors.length === 0) {
    return null;
  }

  const totalPartipants = commentsWithAuthors?.length || 0;
  const particpantsToShow = commentsWithAuthors?.slice(0, 4) || [];
  const overflowParticpants = totalPartipants - particpantsToShow?.length;

  return (
    <Container>
      {overflowParticpants && !hideExtraText ? (
        <Extra>+{overflowParticpants}</Extra>
      ) : null}
      <Stacked
        size={18}
        direction="right"
        elements={particpantsToShow.map((comment) => (
          <Avatar
            alt={comment.author.username}
            src={comment.author.image}
            size={18}
            outline={false}
            greyScale
          />
        ))}
      />
    </Container>
  );
}

const Extra = styled.span`
  font-size: 10px;
  margin-right: 5px;
  color: ${(p) => p.theme.colors.light_grey};
`;

const Container = styled.span`
  display: flex;
  align-items: center;
`;
