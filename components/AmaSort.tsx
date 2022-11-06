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

  const participants = article.comments.filter((x) => x?.author).length;

  if (participants === 0) {
    return <Container ref={conatinerRef} />;
  }

  return (
    <Container ref={conatinerRef}>
      <SortContainer onClick={handleSortClick}>
        <SortButton>
          Sort by <span>:: {sort}</span>
        </SortButton>
      </SortContainer>
      <Right>
        Participants <Number>{participants}</Number>{" "}
        <Participants article={article} />
      </Right>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  padding-top: 17px;

  ${mq.desktopSmall} {
    border-top: none;
  }

  &::before {
    content: "";
    position: absolute;
    width: 100%;
    height: 1px;
    top: 8px;
    background: radial-gradient(
      50% 20416242.35% at 50% 0%,
      rgba(255, 255, 255, 0.16) 0%,
      rgba(255, 255, 255, 0) 100%
    );

    ${mq.desktopSmallUp} {
      display: none;
    }
  }
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  color: ${(p) => p.theme.colors.light_grey};
  font-size: 10px;
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
