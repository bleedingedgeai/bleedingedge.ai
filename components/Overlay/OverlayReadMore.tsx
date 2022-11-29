import React from "react";
import styled from "styled-components";
import { mq } from "../../styles/mediaqueries";
import Avatar from "../Avatar";
import Stacked from "../Stacked";

export default function OverlayReadMore({ heading, text, authors }) {
  return (
    <Frame>
      <HostsContainer>
        <Stacked
          size={24}
          direction="right"
          elements={authors.map((author) => (
            <Avatar
              src={author.image}
              username={author.username}
              href={`https://twitter.com/${author.username}`}
              size={24}
              outline={false}
            />
          ))}
        />
      </HostsContainer>
      <Heading dangerouslySetInnerHTML={{ __html: heading }} />
      <Text dangerouslySetInnerHTML={{ __html: text }} />
    </Frame>
  );
}

const Frame = styled.div`
  position: relative;
  padding-top: 44px;

  ${mq.tablet} {
    padding-top: 0;
  }
`;

const HostsContainer = styled.div`
  margin-bottom: 28px;
`;

const Heading = styled.h3`
  font-family: ${(p) => p.theme.fontFamily.nouvelle};
  font-weight: 500;
  font-size: 18px;
  line-height: 120%;
  margin-bottom: 21px;
`;

const Text = styled.p`
  font-family: ${(p) => p.theme.fontFamily.nouvelle};
  color: ${(p) => p.theme.colors.off_white};
  font-weight: 400;
  font-size: 14px;
  line-height: 130%;
`;
