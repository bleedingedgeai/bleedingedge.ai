import Link from "next/link";
import styled, { keyframes } from "styled-components";
import { slugify } from "../helpers/string";
import Avatar from "./Avatar";
import IconReply from "./Icons/IconReply";
import Participants from "./Participants";

export default function Banner({ article }) {
  if (!article) {
    return null;
  }

  const author = article.authors[0];

  return (
    <Container>
      <Author>
        <Avatar src={author.image} size={28} superHighlight />
      </Author>
      <Link href={`/ama/${slugify(article.title)}`}>
        <BannerContainer>
          <AnimatedGradient />
          <Inner>
            <BlueGraidnet />
            <OrangeGradient />
            <Title>
              {article.title}
              <IconReply />
            </Title>
            <Right>
              <Live>Live AMA</Live>
              <Participants article={article} />
            </Right>
          </Inner>
        </BannerContainer>
      </Link>
    </Container>
  );
}

function AnimatedGradient() {
  return (
    <Wrapper>
      <Gradient />
    </Wrapper>
  );
}

const Inner = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 7px 0 20px;
  position: relative;
  height: 32px;
  border-radius: 80px;
  width: calc(100% - 4px);
  margin: 0 auto;
  background: ${(p) => p.theme.colors.black};
`;

const Wrapper = styled.div`
  padding: 1px;
  margin: -1px;
  position: absolute;
  width: 100%;
  height: 100%;
  isolation: isolate;
  transform: translateZ(10px);
`;

const gradientAnimation = keyframes`
    0% {
      transform: scaleX(8) scaleY(1.5) rotate(0deg);
      opacity:1
    }
    to {
      transform:scaleX(8) scaleY(1.5) rotate(1turn);opacity:1}
    }
`;

const fadeAnimation = keyframes`
    0% {
      opacity:1
    }
    50% {
      opacity:0}
    }
`;

const Gradient = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  animation: ${gradientAnimation} 6s linear infinite;
  filter: blur(5px);
  background: conic-gradient(
      transparent 135deg,
      ${(p) => p.theme.colors.orange} 180deg,
      transparent 300deg
    ),
    conic-gradient(
      transparent 0deg,
      ${(p) => p.theme.colors.orange} 0deg,
      transparent 121deg
    );
`;

const Right = styled.span`
  display: flex;
  align-items: center;
`;

const Container = styled.div`
  margin-bottom: 50px;
  display: flex;
  align-items: center;
  z-index: 3;
  position: relative;
`;

const Live = styled.span`
  color: ${(p) => p.theme.colors.orange};
  font-size: 10px;
  line-height: 135%;
  margin-right: 8px;
`;

const BannerContainer = styled.a`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  height: 34px;
  border-radius: 77px;
  width: 100%;
  overflow: hidden;

  &::before {
    content: "";
    animation: ${fadeAnimation} 5s linear infinite;
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

  &::after {
    content: "";
    opacity: 0;
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
    transition: opacity 0.3s ease;
  }

  &:hover::after {
    opacity: 0.88;
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
  margin-right: 8px;
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
