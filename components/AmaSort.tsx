import { useCallback, useRef } from "react";
import styled from "styled-components";
import { mq } from "../styles/mediaqueries";
import Participants from "./Participants";

export default function AmaSort({ article, sort, setSort }) {
  const conatinerRef = useRef<HTMLDivElement>(null);

  const handleSortClick = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      setSort((prev) =>
        prev === "Top questions" ? "New questions" : "Top questions"
      );
    },
    [setSort]
  );

  return (
    <Container ref={conatinerRef}>
      <SortContainer onClick={handleSortClick}>
        <SortButton>
          Sort by <span>:: {sort}</span>
        </SortButton>
      </SortContainer>

      <Right>
        Participants <Number>{article.comments?.length}</Number>{" "}
        <Participants article={article} />
      </Right>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  padding-top: 17px;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  color: ${(p) => p.theme.colors.light_grey};
`;

const Number = styled.span`
  margin: 0 8px 0 6px;
  color: ${(p) => p.theme.colors.white};
`;

const SortContainer = styled.div`
  display: flex;
  align-items: center;
`;

const SortButton = styled.button`
  margin-left: -14px;
  padding: 7px 14px 8px;
  background: rgba(255, 255, 255, 0);
  border-radius: 5px;
  transition: background 0.25s ease;
  font-size: 12px;

  span {
    color: ${(p) => p.theme.colors.light_grey};
  }

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }

  ${mq.desktopSmall} {
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
