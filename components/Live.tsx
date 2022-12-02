import styled from "styled-components";
import { pulsateMixin } from "../styles/css";
import { mq } from "../styles/mediaqueries";

interface LiveProps {
  onlyDot?: boolean;
}

export default function Live({ onlyDot }: LiveProps) {
  if (onlyDot) {
    return <LiveDot />;
  }

  return (
    <Container>
      <LiveDot style={{ marginRight: 6 }} />
      Live
    </Container>
  );
}

const Container = styled.span`
  font-size: 10px;
  color: ${(p) => p.theme.colors.orange};
  display: flex;
  align-items: center;

  ${mq.desktopMaxUp} {
    font-size: 12px;
  }
`;

const LiveDot = styled.span`
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${(p) => p.theme.colors.orange};
  position: relative;
  ${pulsateMixin}
`;
