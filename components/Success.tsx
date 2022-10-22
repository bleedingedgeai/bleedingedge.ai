import { animated, useTrail } from "react-spring";
import styled from "styled-components";

interface SuccessProps {
  heading: string;
  subheading: string;
  show?: boolean;
}
export default function Success({
  heading,
  subheading,
  show = true,
}: SuccessProps) {
  const components = [
    <IconContainer>
      <IconConfirmation />
    </IconContainer>,
    <SuccessHeading>{heading}</SuccessHeading>,
    <SuccessText>{subheading}</SuccessText>,
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

const SuccessHeading = styled.h3`
  font-family: ${(p) => p.theme.fontFamily.nouvelle};
  font-weight: 500;
  font-size: 22px;
  line-height: 120%;
  text-align: center;
  color: ${(p) => p.theme.colors.white};
  margin-bottom: 18px;
`;

const SuccessText = styled.p`
  font-family: ${(p) => p.theme.fontFamily.nouvelle};
  max-width: 338px;
  font-size: 16px;
  line-height: 120%;
  text-align: center;
`;

const IconConfirmation = () => (
  <svg
    width="52"
    height="52"
    viewBox="0 0 52 52"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="26" cy="26" r="26" fill="#E6E6E6" />
    <path
      d="M14.4856 27.4263L22.9885 34.9143L37.5142 17.0857"
      stroke="black"
      stroke-width="3"
    />
  </svg>
);
