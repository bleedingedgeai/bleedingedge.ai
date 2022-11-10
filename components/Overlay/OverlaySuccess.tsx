import { animated, useTrail } from "react-spring";
import styled from "styled-components";
import IconConfirmation from "../Icons/IconConfirmation";

interface OverlaySuccessProps {
  heading: string;
  subheading: string;
  show?: boolean;
}
export default function OverlaySuccess({
  heading,
  subheading,
  show = true,
}: OverlaySuccessProps) {
  const components = [
    <IconContainer>
      <IconConfirmation />
    </IconContainer>,
    <Heading>{heading}</Heading>,
    <Text>{subheading}</Text>,
  ];

  const trail = useTrail(components.length, {
    opacity: 1,
    x: 0,
    from: { opacity: 0, x: 8 },
    config: { tension: 600, friction: 160 },
  });

  if (!show) {
    return null;
  }

  return (
    <div>
      {trail.map(({ x, ...rest }, index) => (
        <animated.div
          key={index}
          style={{
            ...rest,
            transform: x.interpolate((x) => `translate3d(0,${x}px,0)`),
          }}
        >
          {components[index]}
        </animated.div>
      ))}
    </div>
  );
}

const IconContainer = styled.div`
  margin: 48px 0 24px;
  text-align: center;
`;

const Heading = styled.h3`
  font-family: ${(p) => p.theme.fontFamily.nouvelle};
  font-weight: 500;
  font-size: 22px;
  line-height: 120%;
  text-align: center;
  color: ${(p) => p.theme.colors.white};
  margin-bottom: 18px;
`;

const Text = styled.p`
  font-family: ${(p) => p.theme.fontFamily.nouvelle};
  max-width: 338px;
  font-size: 16px;
  line-height: 120%;
  text-align: center;
  color: ${(p) => p.theme.colors.off_white};
`;
