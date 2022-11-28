import { useCallback, useRef, useState } from "react";
import styled from "styled-components";
import { User } from "@prisma/client";
import { animated, useTransition } from "@react-spring/web";
import { ellipsis } from "../styles/css";
import { mq } from "../styles/mediaqueries";
import Avatar from "./Avatar";
import Badges from "./Badges";
import Portal from "./Portal";
import Stacked from "./Stacked";

interface HostsProps {
  authors: User[];
}

export default function Hosts({ authors }: HostsProps) {
  const [hovered, setHovered] = useState<User>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const transitions = useTransition(hovered, {
    from: { opacity: 0, transform: "translateY(-6%)" },
    enter: { opacity: 1, transform: "translateY(0%)" },
    leave: { opacity: 0, transform: "translateY(-6%)" },
    config: { tension: 600, friction: 60 },
  });

  const handleMouseEnter = useCallback(
    (author) => {
      const { right, top } = containerRef.current.getBoundingClientRect();
      setPosition({ left: right - 193, top: top + 44 });
      setHovered(author);
    },
    [hovered]
  );

  return (
    <Container>
      <Outline>
        <Text>
          Hosts <span>{authors.length}</span>
        </Text>
        <StackedContainer ref={containerRef}>
          <Stacked
            size={18}
            direction="right"
            elements={authors.map((author) => (
              <span
                onMouseEnter={() => handleMouseEnter(author)}
                onMouseLeave={() => setHovered(null)}
              >
                <Avatar
                  src={author.image}
                  username={author.username}
                  href={`https://twitter.com/${author.username}`}
                  size={18}
                  outline={false}
                />
              </span>
            ))}
          />
        </StackedContainer>
      </Outline>
      {transitions((style, author: User) => {
        if (!author) {
          return null;
        }

        console.log(style, author);
        return (
          <Portal>
            <Card
              style={{ ...style, ...position }}
              onMouseEnter={() => setHovered(author)}
              onMouseLeave={() => setHovered(null)}
            >
              <Top>
                <Title>{author.name}</Title>
                <Avatar
                  src={author.image}
                  username={author.username}
                  href={`https://twitter.com/${author.username}`}
                  size={24}
                  outline={false}
                />
              </Top>
              <Flex>
                <Username
                  href={`https://twitter.com/${author.username}`}
                  target="_blank"
                  rel="noopener"
                >
                  @{author.username}
                </Username>
                <Badges.Host />
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
    top: -26px;
    bottom: 0;
    opacity: 0.5;
    z-index: -1;
    border-top-left-radius: 60%;
    border-top-right-radius: 20%;
  }
`;

const Outline = styled.div`
  display: flex;
  align-items: center;
  color: ${(p) => p.theme.colors.light_grey};
`;

const Text = styled.span`
  ${mq.phablet} {
    display: none;
  }

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
