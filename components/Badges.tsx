import styled from "styled-components";
import IconTwitter from "./Icons/IconTwitter";

function Host() {
  return <HostContainer>Host</HostContainer>;
}

const HostContainer = styled.span`
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

function Twitter() {
  return (
    <TwitterContainer>
      <span>Imported</span>
      <IconTwitter size={14} />
    </TwitterContainer>
  );
}

const TwitterContainer = styled.span`
  font-family: ${(p) => p.theme.fontFamily.nouvelle};
  font-style: normal;
  font-weight: 500;
  font-size: 10px;
  line-height: 130%;
  color: ${(p) => p.theme.colors.light_grey};
  background: #141414;
  border-radius: 77px;
  display: flex;
  align-items: center;
  padding: 1px 4px 1px 8px;
  position: relative;
  top: 1px;

  svg {
    margin-left: 6px;
  }
`;

export default {
  Host,
  Twitter,
};
