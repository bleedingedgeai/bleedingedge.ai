import React, { useState } from "react";
import styled from "styled-components";
import Bounds from "../components/Bounds";
import Navigation from "../components/Navigation";
import Sidebar from "../components/Sidebar";
import Timeline from "../components/Timeline";
import { IArticle } from "../db/articles";
import { mq } from "../styles/mediaqueries";
import FilterAndSort from "./FilterAndSort";
import FilterAndSortMobile from "./FilterAndSortMobile";

export type Sort = "Latest" | "Earliest";

interface FeedProps {
  tags: string[];
  articles: IArticle[];
}

export default function Feed(props: FeedProps) {
  const [sort, setSort] = useState<Sort>("Latest");

  return (
    <>
      <Glow />
      <Navigation />
      <Bounds>
        <Container>
          <Left>
            <Sidebar />
          </Left>
          <Right>
            <FilterAndSortSticky>
              <FilterAndSort tags={props.tags} sort={sort} setSort={setSort} />
            </FilterAndSortSticky>
            <Timeline articles={props.articles} sort={sort} />
          </Right>
        </Container>
      </Bounds>
      <FilterAndSortMobile tags={props.tags} sort={sort} setSort={setSort} />
    </>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
`;

const FilterAndSortSticky = styled.div`
  position: sticky;
  top: 40px;
  z-index: 210000;

  ${mq.desktopSmall} {
    top: 121px;
  }

  ${mq.phablet} {
    top: 112px;
  }
`;

const Left = styled.div`
  position: sticky;
  top: 0;
  height: 100vh;
  max-width: 383px;
  z-index: 3;
  padding-right: 6%;

  ${mq.desktop} {
    padding-right: 0;
  }

  ${mq.desktopSmall} {
    display: none;
  }
`;

const Right = styled.div`
  padding-top: 40px;
  width: 100%;
  max-width: 896px;

  ${mq.desktopSmall} {
    max-width: 100%;
    padding-top: 0;
  }

  &::before {
    content: "";
    position: fixed;
    width: 100%;
    height: 124px;
    left: 0;
    top: 0;
    background: linear-gradient(#000 50%, transparent 100%);
    z-index: 2;
    pointer-events: none;

    ${mq.desktopSmall} {
      background: linear-gradient(#000 87%, transparent 100%);
      height: 180px;
    }

    ${mq.phablet} {
      display: none;
    }
  }

  &::after {
    content: "";
    position: fixed;
    width: 100%;
    height: 143px;
    left: 0;
    bottom: 0;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%);
    pointer-events: none;
    z-index: 2;

    ${mq.desktopSmall} {
      bottom: 0;
    }

    ${mq.phablet} {
      height: 60px;
      background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%);
    }
  }
`;

const Glow = styled.div`
  position: fixed;
  width: 356px;
  height: 192px;
  left: 22%;
  top: -110px;
  border-radius: 50%;
  background: rgba(52, 39, 32, 0.52);
  filter: blur(66px);
  z-index: 3;
  pointer-events: none;

  ${mq.desktopSmall} {
    display: none;
  }
`;
