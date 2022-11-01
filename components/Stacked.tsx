import React from "react";
import styled from "styled-components";

interface ImagesStackedProps {
  elements: any[];
  size?: number;
  direction?: "left" | "right";
}

export default function Stacked({
  elements,
  direction = "left",
  size = 24,
}: ImagesStackedProps) {
  return (
    <Container direction={direction}>
      {elements.map((element, index) => {
        if (direction === "right") {
          return (
            <ElementRight key={index} elementSize={size}>
              {element}
            </ElementRight>
          );
        }
        if (direction === "left") {
          return (
            <ElementLeft key={index} elementSize={size}>
              {element}
            </ElementLeft>
          );
        }
      })}
    </Container>
  );
}

const Container = styled.div<{ direction: "left" | "right" }>`
  display: inline-flex;
  align-items: center;
  flex-direction: ${(p) => (p.direction === "right" ? "row" : "row-reverse")};
`;

const Element = styled.span<{ elementSize?: number }>`
  display: inline-block;
  width: ${(p) => p.elementSize}px;
  height: ${(p) => p.elementSize}px;
`;

const ElementRight = styled(Element)`
  &:not(:first-of-type) {
    margin-left: -${(p) => p.elementSize / 6}px;
  }

  &:not(:last-of-type) {
    mask: radial-gradient(circle at 125% 50%, transparent 40%, black 40%);
  }
`;

const ElementLeft = styled(Element)`
  &:not(:first-of-type) {
    margin-right: -${(p) => p.elementSize / 6}px;
  }

  &:not(:last-of-type) {
    mask: radial-gradient(circle at -25% 50%, transparent 40%, black 40%);
  }
`;
