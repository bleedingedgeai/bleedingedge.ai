import { useCallback, useContext, useEffect } from "react";
import styled from "styled-components";
import Select from "../components/Forms/Select";
import IconArrow from "../components/Icons/IconArrow";
import { inputIsFocused } from "../helpers/input";
import { AppContext } from "../pages";
import { mq } from "../styles/mediaqueries";

export default function Controls() {
  const { sort, setSort } = useContext(AppContext);

  const handleSortClick = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      setSort((prev) => (prev === "Descending" ? "Ascending" : "Descending"));
    },
    [setSort]
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (inputIsFocused()) {
        return;
      }

      if (event.code === "KeyT") {
        setSort((prev) => (prev === "Descending" ? "Ascending" : "Descending"));
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [setSort]);

  return (
    <Container>
      <SortContainer onClick={handleSortClick}>
        <SortArrow
          style={sort === "Descending" ? {} : { transform: "rotate(180deg" }}
        >
          <IconArrow />
        </SortArrow>
        <SortButton>
          Timeline <span>:: {sort}</span>
        </SortButton>
      </SortContainer>
      <Select />
    </Container>
  );
}

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
