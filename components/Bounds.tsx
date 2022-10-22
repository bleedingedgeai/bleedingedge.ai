import React from "react";
import styled from "styled-components";
import { mq } from "../styles/mediaqueries";

export default function Bounds(
  props: React.PropsWithChildren<{ style?: any }>
) {
  return <Bound {...props}>{props.children}</Bound>;
}

const Bound = styled.div`
  position: relative;
  width: 100%;
  max-width: calc(1356px + 84px);
  padding: 0 42px;
  margin: 0 auto;
  height: 100%;

  ${mq.desktopMedium} {
    max-width: calc(1196px + 84px);
  }

  ${mq.desktopSmall} {
    padding: 0 48px;
    max-width: calc(1196px + 96px);
  }

  ${mq.phablet} {
    padding: 0 16px;
    max-width: 100%;
  }
`;
