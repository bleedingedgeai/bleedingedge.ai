import { useCallback, useContext, useEffect } from "react";
import styled from "styled-components";
import { inputIsFocused } from "../helpers/input";
import { mq } from "../styles/mediaqueries";
import Dot from "./Dot";
import Select from "./Forms/Select";
import IconArrow from "./Icons/IconArrow";
import { Sort } from "./Layout";
import { OverlayContext, OverlayType } from "./Overlay";

interface FilterAndSortProps {
  tags: { id: string; name: string }[];
  sort: Sort;
  setSort: React.Dispatch<React.SetStateAction<Sort>>;
}

export default function FilterAndSort({
  tags,
  sort,
  setSort,
}: FilterAndSortProps) {
  const { showOverlay } = useContext(OverlayContext);

  const handleSortClick = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      setSort((prev) => (prev === "Latest" ? "Earliest" : "Latest"));
    },
    [setSort]
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (inputIsFocused()) {
        return;
      }

      if (event.code === "KeyT") {
        setSort((prev) => (prev === "Latest" ? "Earliest" : "Latest"));
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [setSort]);

  return (
    <>
      <Container>
        <SortContainer onClick={handleSortClick}>
          <SortArrow
            style={sort === "Latest" ? {} : { transform: "rotate(180deg" }}
          >
            <IconArrow />
          </SortArrow>
          <SortButton>
            Sort by <span>:: {sort}</span>
          </SortButton>
        </SortContainer>
        <Right>
          <Select options={tags.map((t) => t.name)} />
          <DotSpacer>
            <Dot />
          </DotSpacer>

          <SubmitButton onClick={() => showOverlay(OverlayType.SUGGESTION)}>
            Submit
          </SubmitButton>
        </Right>
      </Container>
    </>
  );
}

const Right = styled.div`
  display: flex;
  align-items: center;
`;

const SubmitButton = styled.button`
  margin-left: 7px;
  padding: 4px 7px 5px;
  margin: 0 -7px;
  background: rgba(255, 255, 255, 0);
  border-radius: 5px;
  transition: background 0.25s ease;

  span {
    color: ${(p) => p.theme.colors.light_grey};
  }

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
`;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 54px;
  margin-right: 18px;

  ${mq.desktopSmall} {
    margin-right: 0;
    margin-bottom: 64px;
  }

  ${mq.phablet} {
    margin-bottom: 28px;
    display: none;
  }
`;

const SortContainer = styled.div`
  display: flex;
  align-items: center;
`;

const SortArrow = styled.button`
  transition: transform 0.25s ease;

  ${mq.phablet} {
    svg {
      width: 16px;
      height: 16px;
    }
  }
`;

const SortButton = styled.button`
  margin-left: 17px;
  padding: 7px 14px 8px;
  background: rgba(255, 255, 255, 0);
  border-radius: 5px;
  transition: background 0.25s ease;

  span {
    color: ${(p) => p.theme.colors.light_grey};
  }

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }

  ${mq.desktopSmall} {
    margin-left: 8px;
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

const DotSpacer = styled.span`
  margin: 0 10px;
`;
