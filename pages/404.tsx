import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
import Bounds from "../components/Bounds";
import Contact from "../components/Contact";
import IconLogo from "../components/Icons/IconLogo";
import Navigation from "../components/Navigation";
import { mq } from "../styles/mediaqueries";

export default function NotFound() {
  return (
    <>
      <Navigation />
      <Container>
        <Top>
          <AdjustedBounds>
            <LogoContainer>
              <Link href="/">
                <a>
                  <IconLogo />
                </a>
              </Link>
            </LogoContainer>
            <Link href="/">
              <StyledLink>
                Go back home
                <ArrowContainer>
                  <IconArrowRight />
                </ArrowContainer>
              </StyledLink>
            </Link>
          </AdjustedBounds>
        </Top>
        <Middle>
          <AdjustedBounds>
            <ImageLayout>
              <ErrorImageContainer>
                <Image src="/assets/404/be-error-404.svg" layout="fill" />
              </ErrorImageContainer>
              <ImageAlignBottom>
                <StatueImageContainer>
                  <Image
                    src="/assets/404/be-statue.png"
                    layout="fill"
                    loading="eager"
                  />
                </StatueImageContainer>
              </ImageAlignBottom>
            </ImageLayout>
          </AdjustedBounds>
        </Middle>
        <Bottom>
          <AdjustedBounds>
            <Contact />
          </AdjustedBounds>
        </Bottom>
      </Container>
    </>
  );
}

const AdjustedBounds = styled(Bounds)`
  max-width: calc(1279px + 84px);
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;

  ${mq.desktopSmall} {
    min-height: auto;
  }
`;

const LogoContainer = styled.div`
  max-width: 143px;
  margin-bottom: 60px;

  ${mq.desktopSmall} {
    display: none;
  }
`;

const ImageLayout = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding-right: 12%;

  ${mq.tablet} {
    padding-right: 0;
  }

  ${mq.phablet} {
    padding: 42px 0 0;
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ErrorImageContainer = styled.div`
  height: 80px;
  width: 236px;
  position: relative;
`;

const StatueImageContainer = styled.div`
  width: 100%;
  height: 100%;
  max-width: 410px;
  max-height: 570px;
  position: relative;

  ${mq.desktop} {
    max-height: 520px;
    max-width: 373px;
  }

  ${mq.tablet} {
    max-height: 338px;
    max-width: 243px;
  }

  ${mq.phablet} {
    max-height: 410px;
    max-width: 295px;
  }
`;

const ImageAlignBottom = styled.div`
  display: flex;
  align-items: flex-end;
  height: 100%;
  width: 100%;
  justify-content: flex-end;

  ${mq.phablet} {
    justify-content: center;
  }
`;

const Top = styled.div`
  padding-top: 38px;

  ${mq.tablet} {
    padding-top: 0;
  }
`;

const Middle = styled.div`
  background: #080808;
  height: 63vh;
  margin: 36px 0;
  min-height: 570px;

  ${mq.tablet} {
    height: 355px;
  }

  ${mq.phablet} {
    height: 576px;
    margin: 32px 0;
  }
`;

const Bottom = styled.div`
  padding-bottom: 42px;
`;

const ArrowContainer = styled.span`
  position: relative;

  svg {
    position: relative;
    left: -2px;
    margin: 0 0 1px 6px;
    opacity: 0;
    transition: opacity 0.2s ease, transform 0.3s ease;
  }
`;

const StyledLink = styled.a`
  &:hover ${ArrowContainer} svg {
    opacity: 1;
    transform: translateX(4px);
  }
`;

const IconArrowRight = () => (
  <svg
    width="15"
    height="8"
    viewBox="0 0 15 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14.3536 4.35355C14.5488 4.15829 14.5488 3.84171 14.3536 3.64645L11.1716 0.464466C10.9763 0.269204 10.6597 0.269204 10.4645 0.464466C10.2692 0.659728 10.2692 0.976311 10.4645 1.17157L13.2929 4L10.4645 6.82843C10.2692 7.02369 10.2692 7.34027 10.4645 7.53553C10.6597 7.7308 10.9763 7.7308 11.1716 7.53553L14.3536 4.35355ZM0 4.5H14V3.5H0V4.5Z"
      fill="white"
    />
  </svg>
);
