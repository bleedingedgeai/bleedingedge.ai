import React from "react";
import styled from "styled-components";
import { removeScroll } from "../styles/css";
import { mq } from "../styles/mediaqueries";

export default function Grid(props: React.PropsWithChildren<{ style?: any }>) {
  return <Container {...props}>{props.children}</Container>;
}

const Container = styled.div`
  position: relative;
  display: grid;
  grid-gap: 21px;
  grid-template-columns: repeat(18, 1fr);
  ${removeScroll};

  ${mq.desktopMedium} {
    grid-gap: 18px;
  }

  ${mq.tablet} {
    grid-gap: 18px;
    grid-template-columns: repeat(8, 1fr);
  }

  ${mq.phablet} {
    margin: 0;
    width: 100%;
    overflow: scroll;
    grid-template-columns: repeat(4, 1fr);
  }
`;
