import Link from "next/link";
import styled from "styled-components";
import { slugify } from "../helpers/string";
import Avatar from "./Avatar";
import IconAma from "./Icons/IconAma";
import Stacked from "./Stacked";

export default function Banner({ article }) {
  if (!article) {
    return null;
  }

  const author = article.authors[0];

  return (
    <Container>
      <Author>
        <Avatar src={author.image} size={28} highlight />
      </Author>
      <Link href={`/ama/${slugify(article.title)}`}>
        <BannerContainer>
          <BlueGraidnet />
          <OrangeGradient />
          <Title>
            {article.title}
            <IconAma />
          </Title>
          <Right>
            <Live>Live AMA</Live>
            <Participants article={article} />
          </Right>
        </BannerContainer>
      </Link>
    </Container>
  );
}

function Participants({ article }) {
  if (!article.comments) {
    return null;
  }

  const totalPartipants = article.comments?.length || 0;
  const particpantsToShow = article.comments?.slice(0, 4) || [];
  const overflowParticpants = totalPartipants - particpantsToShow?.length;

  return (
    <>
      {overflowParticpants ? <Extra>+{overflowParticpants}</Extra> : null}
      <Stacked
        size={18}
        direction="right"
        elements={particpantsToShow.map((comment) => (
          <Avatar src={comment.author.image} size={18} outline={false} grey />
        ))}
      />
    </>
  );
}

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

const Extra = styled.span`
  font-size: 10px;
  margin-right: 5px;
  color: ${(p) => p.theme.colors.light_grey};
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
