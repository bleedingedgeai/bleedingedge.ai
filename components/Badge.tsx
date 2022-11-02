import styled from "styled-components";

export default function Badge() {
  return <Container>Host</Container>;
}

const Container = styled.span`
  display: grid;
  place-items: center;
  position: relative;
  height: 16px;
  border-radius: 77px;
  padding: 0 14px;
  font-size: 10px;
  line-height: 135%;
  color: ${(p) => p.theme.colors.orange};

  &::before {
    content: "";
    pointer-events: none;
    user-select: none;
    position: absolute;
    inset: 0px;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(
      269.78deg,
      rgba(209, 159, 100, 0.472) -0.41%,
      rgba(209, 159, 100, 0.296) 36.22%,
      rgba(209, 170, 125, 0.512) 91.49%,
      rgba(209, 172, 129, 0.8) 97.27%
    );

    mask: linear-gradient(black, black) content-box content-box,
      linear-gradient(black, black);
    mask-composite: xor;
  }
`;
