import { useCallback, useRef, useState } from "react";
import { animated, useTransition } from "react-spring";
import styled from "styled-components";
import { ellipsis } from "../styles/css";
import Avatar from "./Avatar";
import Badge from "./Badge";
import Portal from "./Portal";
import Stacked from "./Stacked";

export default function Hosts({ authors }) {
  const [hovered, setHovered] = useState();
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const transitions = useTransition(hovered, {
    key: hovered ? "key" : null,
    from: { opacity: 0, transform: "translateY(-6%)" },
    enter: { opacity: 1, transform: "translateY(0%)" },
    leave: { opacity: 0, transform: "translateY(-6%)" },
    config: { tension: 600, friction: 60 },
  });

  const handleMouseEnter = useCallback((author) => {
    const { left, top } = containerRef.current.getBoundingClientRect();
    setPosition({ left: left - 96, top: top + 44 });
    setHovered(author);
  }, []);

  return (
    <Container>
      <Outline>
        Hosts <span>{authors.length}</span>
        <StackedContainer ref={containerRef}>
          <Stacked
            size={18}
            direction="right"
            elements={authors.map((author) => (
              <span
                onMouseEnter={() => handleMouseEnter(author)}
                onMouseLeave={() => setHovered(null)}
              >
                <Avatar src={author.image} size={18} outline={false} />
              </span>
            ))}
          />
        </StackedContainer>
      </Outline>
      {transitions((style, author) => {
        if (!author) {
          return null;
        }

        return (
          <Portal>
            <Card
              style={{ ...style, ...position }}
              onMouseEnter={() => setHovered(author)}
              onMouseLeave={() => setHovered(null)}
            >
              <Top>
                <Title>{author.name}</Title>
                <Avatar src={author.image} size={24} outline={false} />
              </Top>
              <Flex>
                <Username
                  href={`https://twitter.com/${author.username}`}
                  target="_blank"
                  rel="noopener"
                >
                  @{author.username}
                </Username>
                <Badge />
              </Flex>
            </Card>
          </Portal>
        );
      })}
    </Container>
  );
}

const Container = styled.div`
  position: relative;
`;

const Card = styled(animated.div)`
  position: fixed;
  background: rgba(133, 133, 133, 0.16);
  border: 1px solid rgba(133, 133, 133, 0.21);
  box-shadow: 0px 4px 35px rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(13px);
  border-radius: 7px;
  width: 218px;
  padding: 12px 24px;
  z-index: 2147483647;

  &::before {
    content: "";
    pointer-events: none;
    position: absolute;
    left: 0;
    right: 0%;
    top: 0%;
    bottom: 49.43%;
    z-index: -1;

    background: radial-gradient(
      50% 128.13% at 50% 100%,
      rgba(0, 0, 0, 0.48) 0%,
      rgba(0, 0, 0, 0) 100%
    );
  }

  &::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0%;
    top: -24px;
    bottom: 0;
    opacity: 0.5;
    z-index: -1;
  }
`;

const Outline = styled.div`
  display: flex;
  align-items: center;
  color: ${(p) => p.theme.colors.light_grey};

  & > span {
    margin: 0 8px 0 6px;
    color: ${(p) => p.theme.colors.off_white};
  }
`;

const StackedContainer = styled.div`
  display: grid;
  padding: 2px;
  border: 1px solid ${(p) => p.theme.colors.orange};
  border-radius: 30px;
`;

const Flex = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Top = styled(Flex)`
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  padding-bottom: 10px;
  margin-bottom: 12px;
  position: relative;
`;

const Title = styled.h4`
  font-family: ${(p) => p.theme.fontFamily.nouvelle};
  font-family: "NN Nouvelle Grotesk STD";
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  padding-right: 6px;
  ${ellipsis};
`;

const Username = styled.a`
  ${ellipsis};
  padding-right: 6px;
  color: ${(p) => p.theme.colors.light_grey};
  transition: color 0.2s ease;

  &:hover {
    color: ${(p) => p.theme.colors.white};
  }
`;
