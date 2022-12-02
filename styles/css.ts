import { css, keyframes } from "styled-components";

export const ellipsis = css`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const hideScrollBar = css`
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const removeScroll = css`
  width: 100%;
  height: 100%;
  min-height: 100%;
  overflow: hidden;
  align-items: stretch;
`;

const pulsate = keyframes`
  0% {
    transform: scale(0, 0);
    opacity: 0;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    transform: scale(1.1, 1.1);
    opacity: 0;
  }
`;

export const pulsateMixin = css`
  &::after {
    content: "";
    border: 2px solid ${(p) => p.theme.colors.orange};
    border-radius: 50%;
    height: 21px;
    width: 21px;
    position: absolute;
    left: -7px;
    top: -7px;
    animation: ${pulsate} 1.6s ease-out infinite;
    opacity: 0;
  }
`;
