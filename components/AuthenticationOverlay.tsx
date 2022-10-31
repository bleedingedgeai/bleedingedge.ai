import { signIn } from "next-auth/react";
import styled from "styled-components";
import { mq } from "../styles/mediaqueries";
import { theme } from "../styles/theme";
import Button from "./Button";
import IconShield from "./Icons/IconShield";

export default function AuthenticationOverlay() {
  return (
    <>
      <RadialShadow />
      <Container>
        <Heading style={{ marginBottom: 7 }}>Sign in to participate</Heading>
        <Text>
          Bleeding Edge will only request access to your public Twitter profile
          information. You won’t be subscribed to anything.
        </Text>
        <SubText>
          By signing in, you agree to our content policy.
          <IconShield />
        </SubText>
        <Button
          color={theme.colors.white}
          background="#5C9AE3"
          text="Sign in with Twitter"
          onClick={() => signIn("twitter")}
        />
      </Container>
    </>
  );
}

const Container = styled.div`
  position: relative;
  padding-top: 48px;
`;

const RadialShadow = styled.div`
  position: absolute;
  height: 66px;
  left: 0px;
  top: 0px;
  width: 100%;
  background: radial-gradient(
    39.52% 128.13% at 50% 100%,
    rgba(0, 0, 0, 0.48) 0%,
    rgba(0, 0, 0, 0) 100%
  );

  ${mq.tablet} {
    display: none;
  }
`;

const Heading = styled.h2`
  font-family: ${(p) => p.theme.fontFamily.nouvelle};
  font-weight: 500;
  line-height: 120%;
  margin-bottom: 24px;
  font-size: 18px;
  color: ${(p) => p.theme.colors.white};

  ${mq.tablet} {
    font-size: 24px;
  }
`;

const Text = styled.p`
  font-family: ${(p) => p.theme.fontFamily.nouvelle};
  font-weight: 400;
  font-size: 16px;
  line-height: 120%;
  color: ${(p) => p.theme.colors.light_grey};
  max-width: 308px;
  margin-bottom: 18px;
`;

const SubText = styled.p`
  font-family: ${(p) => p.theme.fontFamily.nouvelle};
  font-weight: 500;
  font-size: 16px;
  line-height: 120%;
  color: ${(p) => p.theme.colors.off_white};
  margin-bottom: 32px;

  svg {
    margin-left: 6px;
  }
`;
