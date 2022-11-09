import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
import Bounds from "../components/Bounds";
import IconLogo from "../components/Icons/IconLogo";
import { mq } from "../styles/mediaqueries";

export default function ServerError() {
  return (
    <Container>
      <Top>
        <AdjustedBounds>
          <LogoContainer>
            <Link href="/">

              <IconLogo />

            </Link>
          </LogoContainer>
        </AdjustedBounds>
      </Top>
      <Middle>
        <AdjustedBounds>
          <ImageLayout>
            <ErrorImageContainer>
              <Image src="/assets/500/be-error-500.svg" layout="fill" />
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
      <Bottom />
    </Container>
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

  ${mq.tablet} {
    min-height: auto;
  }
`;

const LogoContainer = styled.div`
  max-width: 143px;

  ${mq.tablet} {
    padding: 32px 0;
    margin-bottom: 32px;
  }

  ${mq.phablet} {
    padding: 28px 0;
    margin-bottom: 28px;
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
