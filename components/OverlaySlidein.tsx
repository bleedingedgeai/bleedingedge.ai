import React, { useContext } from "react";
import styled from "styled-components";
import { mq } from "../styles/mediaqueries";
import { theme } from "../styles/theme";
import IconEx from "./Icons/IconEx";
import { OverlayContext } from "./Overlay";
import Portal from "./Portal";

export default function Slidein() {
  const { OverlayComponent, hideOverlay } = useContext(OverlayContext);

  return (
    <Portal>
      <Container
        style={OverlayComponent ? {} : { transform: "translateY(120%)" }}
      >
        <ExitContainer onClick={() => hideOverlay()}>
          <IconEx size={24} fill={theme.colors.white} />
        </ExitContainer>
        <BlueGradientContainer>
          <BlueGradient />
        </BlueGradientContainer>
        <Content>{OverlayComponent}</Content>
      </Container>
    </Portal>
  );
}

const Container = styled.div`
  position: fixed;
  top: 88px;
  width: 100%;
  height: calc(100% - 88px);
  background: rgba(22, 22, 22, 0.9);
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0px 4px 34px rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(64px);
  border-radius: 24px 24px 0 0;
  padding: 96px 16px 0;
  z-index: 2147483647;
  transition: transform 1s cubic-bezier(0.1, 0.95, 0.15, 1);

  ${mq.phablet} {
    top: 76px;
    height: calc(100% - 76px);
  }
`;

const Content = styled.div`
  position: relative;
  max-width: 477px;
  margin: 0 auto;
`;

const ExitContainer = styled.button`
  position: absolute;
  right: 28px;
  top: 28px;

  ${mq.phablet} {
    right: 16px;
    top: 18px;
  }
`;

const BlueGradientContainer = styled.div`
  position: absolute;
  bottom: 30vh;
  right: 0;
  left: 0;
  margin: 0 auto;

  ${mq.phablet} {
    bottom: 0;
    right: 0;
    margin: 0;
    left: unset;
  }
`;

const BlueGradient = () => (
  <svg
    width="338"
    height="241"
    viewBox="0 0 338 241"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ overflow: "visible" }}
  >
    <g filter="url(#filter0_f_174_931)">
      <path
        d="M338 144V241H166.412L144 210.283L166.412 144H338Z"
        fill="url(#paint0_linear_174_931)"
      />
    </g>
    <defs>
      <filter
        id="filter0_f_174_931"
        x="3.8147e-06"
        y="0"
        width="482"
        height="385"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        />
        <feGaussianBlur
          stdDeviation="64"
          result="effect1_foregroundBlur_174_931"
        />
      </filter>
      <linearGradient
        id="paint0_linear_174_931"
        x1="229.601"
        y1="241"
        x2="214.385"
        y2="132.316"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#072839" />
        <stop offset="0.525533" stopColor="#033151" />
        <stop offset="1" stopColor="#28445C" />
      </linearGradient>
    </defs>
  </svg>
);
