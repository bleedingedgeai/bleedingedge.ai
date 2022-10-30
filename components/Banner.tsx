import Link from "next/link";
import styled from "styled-components";
import { slugify } from "../helpers/string";
import IconAma from "./Icons/IconAma";

export default function Banner() {
  return (
    <Container>
      <Author></Author>
      <Link
        href={`/ama/${slugify(
          "Shutterstock announces DALL·E integration and fund to compensate contributors"
        )}`}
      >
        <BannerContainer>
          <BlueGraidnet />
          <OrangeGradient />
          <Title>
            Shutterstock announces DALL·E integration and fund to compensate
            contributors
            <IconAma />
          </Title>
          <span>
            <AmaText>Live AMA</AmaText>
            <span></span>
          </span>
        </BannerContainer>
      </Link>
    </Container>
  );
}

const Container = styled.span`
  margin-bottom: 50px;
  display: flex;
  align-items: center;
`;

const AmaText = styled.span`
  color: ${(p) => p.theme.colors.orange};
  font-family: "Space Mono";
  font-size: 10px;
  line-height: 135%;
`;

const BannerContainer = styled.a`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 7px 0 20px;
  position: relative;
  height: 32px;
  border-radius: 77px;
  width: 100%;
  overflow: hidden;

  &::before {
    content: "";
    pointer-events: none;
    user-select: none;
    position: absolute;
    inset: 0px;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(
      269.78deg,
      rgba(209, 159, 100, 0.472) -0.41%,
      rgba(209, 159, 100, 0.208) 21.11%,
      rgba(209, 159, 100, 0.096) 72.5%,
      rgba(209, 170, 125, 0.424) 91.49%,
      rgba(209, 172, 129, 0.8) 97.27%
    );

    mask: linear-gradient(black, black) content-box content-box,
      linear-gradient(black, black);
    mask-composite: xor;
  }
`;

const Title = styled.span`
  font-family: ${(p) => p.theme.fontFamily.nouvelle};
  font-weight: 500;
  font-size: 14px;
  line-height: 120%;
  color: ${(p) => p.theme.colors.white};
  position: relative;

  svg {
    margin-left: 12px;
  }
`;

const Author = styled.span`
  position: relative;
  width: 28px;
  height: 28px;
  margin-right: 8px;
  border-radius: 50%;

  &::after {
    content: "";
    position: absolute;
    left: -2px;
    top: -2px;
    width: calc(100% + 4px);
    height: calc(100% + 4px);
    border-radius: 50%;
    border: 1px solid ${(p) => p.theme.colors.orange};
  }
`;

const BlueGraidnet = styled.span`
  position: absolute;
  width: 315px;
  height: 40px;
  left: 607px;
  top: -4px;
  background: rgba(209, 159, 100, 0.7);
  filter: blur(52px);
`;

const OrangeGradient = styled.span`
  position: absolute;
  width: 288px;
  height: 45px;
  left: 437px;
  top: 0px;
  background: linear-gradient(
    200.9deg,
    #072839 13.82%,
    #033151 57.26%,
    #28445c 96.49%
  );
  filter: blur(52px);
`;
