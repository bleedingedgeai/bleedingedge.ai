import styled from "styled-components";
import IconTwitter from "./Icons/IconTwitter";

function Host() {
  return <HostContainer>Host</HostContainer>;
}

const HostContainer = styled.span`
  display: grid;
  place-items: center;
  position: relative;
  height: 12px;
  border-radius: 77px;
  font-size: 10px;
  line-height: 130%;
  background: #141414;
  width: 46px;
  font-family: ${(p) => p.theme.fontFamily.nouvelle};
  font-weight: 500;
  color: ${(p) => p.theme.colors.orange};
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
