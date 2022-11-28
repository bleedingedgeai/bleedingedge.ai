import Image from "next/image";
import { useMemo } from "react";
import styled from "styled-components";
import { clamp, getRandomWholeNumber } from "../helpers/numbers";

interface AvatarProps {
  src?: string;
  href?: string;
  username?: string;
  size?: number;
  highlight?: boolean;
  superHighlight?: boolean;
  outline?: boolean;
  greyScale?: boolean;
}

export default function Avatar({
  src,
  href,
  username,
  highlight,
  superHighlight,
  size = 18,
  outline = true,
  greyScale,
}: AvatarProps) {
  const imageSrc = useMemo(() => {
    const alphabet = [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
    ];

    if (src.includes("pbs.twimg.com")) {
      return src;
    }

    const index =
      alphabet.findIndex(
        (a) => a.toLowerCase() === username[0].toLowerCase()
      ) || 0;
    const percent = (index + 1) / alphabet.length;
    const number = clamp(Math.round(percent * 3), 0, 3);
    const fallbackNames = ["alexandra", "annunciata", "francesca", "maria"];
    return `/assets/avatar/${fallbackNames[number]}.jpg`;
  }, [src, username]);

  return (
    <AvatarContainer
      size={size}
      outline={outline}
      highlight={highlight}
      superHighlight={superHighlight}
      greyScale={greyScale}
    >
      {href ? (
        <Anchor href={href} target="_blank" rel="noopener">
          <StyledImage src={imageSrc} width={size} height={size} alt="" />
        </Anchor>
      ) : (
        <StyledImage src={imageSrc} width={size} height={size} alt="" />
      )}
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
      p.highlight || p.superHighlight
        ? p.theme.colors.orange
        : p.theme.colors.light_grey
    }
    ;
  }`}

  ${(p) =>
    p.outline &&
    p.superHighlight &&
    `&::before {
    content: "";
    position: absolute;
    left: -2px;
    top: -2px;
    width: calc(100% + 4px);
    height: calc(100% + 4px);
    border-radius: 50%;
    filter: blur(3px);
background: linear-gradient(217.16deg, rgba(209, 159, 100, 0.32) -7.44%, rgba(206, 206, 206, 0.32) 108.26%);
  }`}
`;

const Anchor = styled.a`
  display: grid;
`;
const StyledImage = styled(Image)`
  width: 100%;
  border-radius: 50%;
  position: relative;
  z-index: 1;
`;
