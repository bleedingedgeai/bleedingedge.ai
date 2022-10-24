import { css } from "styled-components";

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
