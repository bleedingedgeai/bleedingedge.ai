import Link from "next/link";
import styled, { keyframes } from "styled-components";
import { slugify } from "../helpers/string";
import { ArticleLive } from "../prisma/types";
import { ellipsis } from "../styles/css";
import { mq } from "../styles/mediaqueries";
import { theme } from "../styles/theme";
import Avatar from "./Avatar";
import Dot from "./Dot";
import IconReply from "./Icons/IconReply";
import Participants from "./Participants";
import Stacked from "./Stacked";

interface BannerProps {
  article: ArticleLive;
}

export default function Banner({ article }: BannerProps) {
  if (!article) {
    return null;
  }

  const author = article.authors[0];

  return (
    <>
      <MobileBanner article={article} />
      <ContainerDesktop>
        <Author>
          <Avatar src={author.image} size={28} superHighlight />
        </Author>
        <BannerContainer href={`/ama/${slugify(article.title)}`}>
          <AnimatedGradient />
          <Inner>
            <span style={{ display: "flex", alignItems: "center" }}>
              <MobileAuthor>
                <Avatar src={author.image} size={28} outline={false} />
              </MobileAuthor>
              <OrangeGradient />
              <BlueGradient />
              <Title>
                {article.title}
                <IconReply fill={theme.colors.white} />
              </Title>
            </span>
            <Right>
              <Live>Live AMA</Live>
              <Participants article={article} />
            </Right>
          </Inner>
        </BannerContainer>
      </ContainerDesktop>
    </>
  );
}

function AnimatedGradient() {
  return (
    <Wrapper>
      <Gradient />
    </Wrapper>
  );
}

function MobileBanner({ article }) {
  return (
    <ContainerMobile>
      <BannerContainer href={`/ama/${slugify(article.title)}`}>
        <AnimatedGradient />
        <Inner>
          <MobileStacked>
            <Stacked
              size={32}
              direction="right"
              elements={article.authors.map((author) => (
                <Avatar src={author.image} size={32} outline={false} />
              ))}
            />
          </MobileStacked>
          <BlueGradient />
          <OrangeGradient />
          <Title>{article.title}</Title>
          <Right>
            <Live>Live AMA</Live>
            <Dot />
            {article.comments.filter((comment) => comment.author).length}{" "}
            Participants
          </Right>
        </Inner>
      </BannerContainer>
    </ContainerMobile>
  );
}

const MobileStacked = styled.div`
  margin-bottom: 12px;
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

const ContainerMobile = styled.div`
  margin-bottom: 40px;
  border-radius: 16px;
  overflow: hidden;

  ${mq.phabletUp} {
    display: none;
  }
`;

const ContainerDesktop = styled.div`
  margin-bottom: 50px;
  display: flex;
  align-items: center;
  z-index: 3;
  position: relative;

  ${mq.phablet} {
    display: none;
  }
`;

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

  ${mq.tablet} {
    padding: 0 7px 0 3px;
  }

  ${mq.phablet} {
    height: auto;
    padding: 16px 50px;
    border-radius: 16px;
    flex-direction: column;
    width: calc(100% - 2px);
    overflow: hidden;
  }
`;

const Right = styled.span`
  display: flex;
  align-items: center;
  ${ellipsis}

  ${mq.phablet} {
    color: ${(p) => p.theme.colors.light_grey};
    font-size: 12px;
  }
`;

const Wrapper = styled.div`
  padding: 1px;
  margin: -1px;
  position: absolute;
  width: 100%;
  height: 100%;
  isolation: isolate;
  transform: translateZ(10px);
  border-radius: 16px;
  overflow: hidden;
  display: block;
`;

const Live = styled.span`
  color: ${(p) => p.theme.colors.orange};
  font-size: 10px;
  line-height: 135%;
  margin-right: 8px;

  ${mq.phablet} {
    color: ${(p) => p.theme.colors.light_grey};
    margin-right: 0;
  }
`;

const BannerContainer = styled(Link)`
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

  ${mq.phablet} {
    flex-direction: column;
    height: auto;
    border-radius: 16px;
    text-align: center;
    padding: 0.5px 0;
  }
`;

const Title = styled.span`
  font-family: ${(p) => p.theme.fontFamily.nouvelle};
  font-weight: 500;
  font-size: 14px;
  line-height: 120%;
  color: ${(p) => p.theme.colors.white};
  position: relative;
  padding-right: 6px;
  ${ellipsis}

  svg {
    margin-left: 12px;
  }

  ${mq.phablet} {
    font-size: 16px;
    white-space: wrap;
    overflow: visible;
    white-space: initial;
    text-overflow: initial;
    margin-bottom: 12px;

    svg {
      display: none;
    }
  }
`;

const Author = styled.span`
  margin-right: 8px;

  ${mq.tablet} {
    display: none;
  }
`;

const MobileAuthor = styled.span`
  margin-right: 8px;

  ${mq.tabletUp} {
    display: none;
  }
`;

const OrangeGradient = styled.span`
  position: absolute;
  width: 315px;
  height: 40px;
  top: -4px;
  background: rgba(209, 159, 100, 0.42);
  filter: blur(52px);
  right: 0;

  ${mq.phablet} {
    height: 100%;
    top: -40%;
    right: -24%;
    background: rgba(209, 159, 100, 0.24);
  }
`;

const BlueGradient = styled.span`
  position: absolute;
  width: 288px;
  height: 45px;
  right: 24%;
  top: 0px;
  background: linear-gradient(
    200.9deg,
    #072839 13.82%,
    #033151 57.26%,
    #28445c 96.49%
  );
  opacity: 0.6;
  filter: blur(52px);

  ${mq.tablet} {
    height: 100%;
    top: -40%;
    left: -30%;
    opacity: 0.4;
    filter: blur(64px);
  }
`;
