import styled from "styled-components";

interface AvatarProps {
  src: string;
  size?: number;
  highlight?: boolean;
  outline?: boolean;
}

export default function Avatar({
  src,
  highlight,
  size = 18,
  outline = true,
}: AvatarProps) {
  return (
    <AvatarContainer size={size} outline={outline} highlight={highlight}>
      <Image src={src} />
    </AvatarContainer>
  );
}

const AvatarContainer = styled.div<{
  size: number;
  outline?: boolean;
  highlight?: boolean;
}>`
  position: relative;
  width: ${(p) => p.size}px;
  height: ${(p) => p.size}px;
  border-radius: 50%;
  display: grid;
  place-items: center;

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
    p.highlight &&
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

const Image = styled.img`
  width: 100%;
  border-radius: 50%;
  position: relative;
  z-index: 1;
`;
