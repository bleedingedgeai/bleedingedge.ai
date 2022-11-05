import Image from "next/image";
import { useMemo } from "react";
import { animated, useTransition } from "react-spring";
import styled from "styled-components";
import { getRandomWholeNumber } from "../helpers/numbers";
import { mq } from "../styles/mediaqueries";

const imageBasePath = `/assets/painting/painting-`;

export default function CommentsEmptyState({ show }) {
  const imageSrc = useMemo(() => {
    return `${imageBasePath}${getRandomWholeNumber(1, 4)}.jpg`;
  }, []);
  const imageSrcMobile = useMemo(() => {
    return `${imageBasePath}${getRandomWholeNumber(1, 4)}-mobile.jpg`;
  }, []);

  const transitions = useTransition(show, {
    from: { opacity: 1 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { tension: 280, friction: 30 },
  });

  return (
    <>
      {transitions(
        (style, item) =>
          item && (
            <Container style={style}>
              <ImageContainer>
                <StyledImage src={imageSrc} layout="fill" />
              </ImageContainer>
              <ImageContainerMobile>
                <StyledImage src={imageSrcMobile} layout="fill" />
              </ImageContainerMobile>
              <Text>
                <span>
                  This space is currently empty. Ask anything to start a
                  discussion.
                </span>
                <Right>
                  Painting co-created with{" "}
                  <a
                    href="https://www.midjourney.com/home/"
                    target="_blank"
                    rel="nonopener"
                  >
                    AI
                  </a>
                  .
                </Right>
              </Text>
            </Container>
          )
      )}
    </>
  );
}

const ImageContainer = styled.div`
  display: grid;
  width: auto;

  ${mq.tablet} {
    display: none;
  }
`;

const ImageContainerMobile = styled.div`
  display: grid;
  width: auto;

  ${mq.tabletUp} {
    display: none;
  }
`;

const Container = styled(animated.div)`
  position: absolute;
  left: 0;
  top: -571px;
  height: 571px;
  display: flex;
  align-items: flex-end;
  width: 100%;

  &::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 120px;
    left: 0;
    bottom: 0;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%);
    pointer-events: none;
    z-index: 1;
  }
`;

const Text = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  color: ${(p) => p.theme.colors.off_white};
  width: 100%;
  z-index: 3;
  padding-bottom: 28px;

  ${mq.desktop} {
    flex-direction: column;
  }

  ${mq.phablet} {
    height: 100%;
    padding: 18px 0 16px;
  }
`;

const Right = styled.span`
  color: ${(p) => p.theme.colors.light_grey};

  a {
    text-decoration: underline;
    transition: color 0.2s ease;
    color: ${(p) => p.theme.colors.light_grey};

    &:hover {
      color: ${(p) => p.theme.colors.off_white};
    }
  }
`;

const StyledImage = styled(Image)`
  margin: 0 auto;
`;
