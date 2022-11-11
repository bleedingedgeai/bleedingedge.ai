import React from "react";
import styled from "styled-components";
import Bounds from "../components/Bounds";
import Navigation from "../components/Navigation";
import Sidebar from "../components/Sidebar";
import { mq } from "../styles/mediaqueries";

export type Sort = "Latest" | "Earliest";

interface LayoutProps {}

export default function Layout({
  children,
}: React.PropsWithChildren<LayoutProps>) {
  return (
    <>
      <Glow />
      <Navigation />
      <Bounds>
        <Container>
          <Left>
            <Sidebar />
          </Left>
          <Right>{children}</Right>
        </Container>
      </Bounds>
    </>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
`;

const Left = styled.div`
  position: sticky;
  top: 0;
  height: 100vh;
  max-width: 383px;
  z-index: 3;
  padding-right: 6%;

  ${mq.desktopMedium} {
    max-width: 252px;
  }

  ${mq.desktopMedium} {
    padding-right: 0;
  }

  ${mq.desktopSmall} {
    display: none;
  }
`;

const Right = styled.div`
  padding-top: 40px;
  width: 100%;
  position: relative;

  ${mq.desktopSmall} {
    max-width: 100%;
    padding-top: 0;
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
