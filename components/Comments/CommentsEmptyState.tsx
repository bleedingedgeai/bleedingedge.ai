import Image from "next/image";
import { RefObject, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { getRandomWholeNumber } from "../../helpers/numbers";
import { mq } from "../../styles/mediaqueries";

const imageBasePath = `/assets/painting/painting-`;

interface CommentsEmptyStateProps {
  containerRef: RefObject<HTMLDivElement>;
}

export default function CommentsEmptyState({
  containerRef,
}: CommentsEmptyStateProps) {
  const [offset, setOffset] = useState(0);
  const [width, setWidth] = useState(0);

  const imageSrc = useMemo(() => {
    return `${imageBasePath}${getRandomWholeNumber(1, 5)}.jpg`;
  }, []);

  const imageSrcMobile = useMemo(() => {
    return `${imageBasePath}${getRandomWholeNumber(1, 5)}-mobile.jpg`;
  }, []);

  useEffect(() => {
    function handleResize() {
      const rect = containerRef.current.getBoundingClientRect();
      setOffset(rect.x);
      setWidth(rect.width);
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [containerRef]);

  return (
    <>
      <Container style={{ left: offset, width }}>
        <ImageContainer>
          <StyledImage
            src={imageSrc}
            layout="fill"
            alt="AI generated painting of person"
          />
        </ImageContainer>
        <ImageContainerMobile>
          <StyledImage
            src={imageSrcMobile}
            layout="fill"
            alt="AI generated painting of person"
          />
        </ImageContainerMobile>
        <Text>
          <span>
            This space is currently empty. Ask anything to start a discussion.
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
    </>
  );
}

const ImageContainer = styled.div`
  display: grid;

  ${mq.tablet} {
    display: none;
  }
`;

const ImageContainerMobile = styled.div`
  display: grid;

  ${mq.tabletUp} {
    display: none;
  }
`;

const Container = styled.div`
  position: fixed;
  left: 0;
  height: 571px;
  bottom: 132px;
  display: flex;
  align-items: flex-end;
  width: 100%;
  z-index: 0;

  &::before {
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

  ${mq.phablet} {
    height: 419px;
    bottom: 96px;
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
