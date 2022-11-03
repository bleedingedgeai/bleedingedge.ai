import Image from "next/image";
import { useMemo } from "react";
import styled from "styled-components";
import { getRandomWholeNumber } from "../helpers/numbers";

interface AvatarProps {
  src?: string;
  size?: number;
  highlight?: boolean;
  superHighlight?: boolean;
  outline?: boolean;
  greyScale?: boolean;
}

const fallbackNames = ["alexandra", "annunciata", "francesca", "maria"];

export default function Avatar({
  src,
  highlight,
  superHighlight,
  size = 18,
  outline = true,
  greyScale,
}: AvatarProps) {
  const imageSrc = useMemo(() => {
    if (src) {
      return src;
    }

    return `/assets/avatar/${fallbackNames[getRandomWholeNumber(0, 3)]}.jpg`;
  }, [src]);

  return (
    <AvatarContainer
      size={size}
      outline={outline}
      highlight={highlight}
      superHighlight={superHighlight}
      greyScale={greyScale}
    >
      <StyledImage src={imageSrc} width={size} height={size} />
    </AvatarContainer>
  );
}

const AvatarContainer = styled.div<{
  size: number;
  outline?: boolean;
  highlight?: boolean;
  superHighlight?: boolean;
  greyScale?: boolean;
}>`
  position: relative;
  width: ${(p) => p.size}px;
  height: ${(p) => p.size}px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  ${(p) => p.greyScale && `filter: grayscale(1);`}

  ${(p) =>
    p.outline &&
    `&::after {
    content: "";
    position: absolute;
    left: -2px;
    top: -2px;
    width: calc(100% + 4px);
    height: calc(100% + 4px);
    border-radius: 50%;
    background: #000;
    border: 1px solid ${
      p.highlight ? p.theme.colors.orange : p.theme.colors.light_grey
    }
    ;
  }`}

  ${(p) =>
    p.outline &&
    p.superHighlight &&
    `&::before {
    content: "";
    position: absolute;
    left: -5px;
    top: -5px;
    width: calc(100% + 10px);
    height: calc(100% + 10px);
    border-radius: 50%;
background: linear-gradient(217.16deg, rgba(209, 159, 100, 0.24) -7.44%, rgba(206, 206, 206, 0.24) 108.26%);
  }`}
`;

const StyledImage = styled(Image)`
  width: 100%;
  border-radius: 50%;
  position: relative;
  z-index: 1;
`;
