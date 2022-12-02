import React, { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import { hideScrollBar } from "../styles/css";

export default function Marquee(props: React.PropsWithChildren<{}>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [animate, setAnimate] = useState(false);
  const [timing, setTiming] = useState(8);

  useEffect(() => {
    const container = containerRef.current.getBoundingClientRect();
    const inner = innerRef.current.getBoundingClientRect();

    const width = container.width * 0.8;
    const innerWidth = (inner.width - 200) / 2;

    setAnimate(innerWidth > width);
    setTiming(inner.width / 100);
  }, [containerRef, innerRef]);

  console.log(timing);
  return (
    <Container ref={containerRef}>
      <Inner
        ref={innerRef}
        style={{
          animationPlayState: animate ? "running" : "paused",
          animationDuration: `${timing}s`,
        }}
      >
        <Item>{props.children}</Item> <Item>{props.children}</Item>
      </Inner>
    </Container>
  );
}

const Container = styled.div`
  mask-image: linear-gradient(
    to right,
    transparent,
    black 8%,
    black 75%,
    transparent 100%
  );
  overflow-x: hidden;
  display: flex;
  flex-direction: row;
  position: relative;
  width: 100%;
  margin-left: -16px;
  padding-left: 16px;
  ${hideScrollBar}
`;

const scroll = keyframes`
0% {
    transform: translateX(0%);
}
100% {
    transform: translateX(-50%);
}
`;

const Inner = styled.div`
  z-index: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  animation: ${scroll} 8s 1s cubic-bezier(0.88, 1, 0.88, 1) forwards;
  white-space: nowrap;
`;

const Item = styled.span`
  margin-right: 100px;
`;
