import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext } from "react";
import styled, { keyframes } from "styled-components";
import IconLogo from "../components/Icons/IconLogo";
import { theme } from "../styles/theme";
import Dot from "./Dot";
import IconGoTo from "./Icons/IconGoTo";
import { OverlayContext, OverlayType } from "./Overlay/Overlay";

const links = [
  {
    path: "/",
    text: "Articles",
  },
  {
    path: "/ama",
    text: "AMAs",
  },
];

export default function Sidebar() {
  const router = useRouter();
  const session = useSession();
  const { showOverlay } = useContext(OverlayContext);

  return (
    <Container className="Sidebar">
      <div>
        <LogoContainer>
          <Link href="/">
            <IconLogo />
          </Link>
        </LogoContainer>
        {links.map((link) => {
          const active =
            link.path === "/"
              ? router.pathname === link.path
              : router.pathname.includes(link.path);

          return (
            <Row key={link.path}>
              <StyledLink
                href={link.path}
                style={
                  active ? { color: theme.colors.white, fontWeight: 700 } : {}
                }
              >
                {link.text} <span>{active && "—"}</span>
              </StyledLink>
            </Row>
          );
        })}
        <Spacer />
        <Row>
          <StyledButton onClick={() => showOverlay(OverlayType.SUBSCRIBE)}>
            Subscribe
          </StyledButton>
        </Row>
        <Row style={{ opacity: session.status === "loading" ? 0 : 1 }}>
          {!session.data ? (
            <StyledButton onClick={() => signIn("twitter")}>
              Sign in
            </StyledButton>
          ) : (
            <StyledButton onClick={() => signOut()}>Sign out</StyledButton>
          )}
        </Row>
      </div>
      <div>
        <Description>
          bleeding edge is a feed of noteworthy developments in AI. this site is
          very much a work in progress. please send suggestions and feedback!
        </Description>
        <div>
          <StyledLinkBottom href="/about">About</StyledLinkBottom>
          <DotSpacer>
            <Dot />
          </DotSpacer>
          <StyledLinkBottom
            href="https://twitter.com/bleedingedgeai"
            target="_blank"
          >
            Twitter <IconGoTo fill={theme.colors.off_white} />
          </StyledLinkBottom>
        </div>
      </div>
    </Container>
  );
}

const Row = styled.div`
  margin-bottom: 8px;
  transition: opacity 0.2s;
`;

const Spacer = styled.div`
  height: 32px;
`;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: 100vh;
  padding: 38px 0 40px;
  max-width: 383px;
`;

const LogoContainer = styled.div`
  max-width: 143px;
  margin-bottom: 60px;
`;

const Description = styled.div`
  color: ${(p) => p.theme.colors.light_grey};
  margin-bottom: 12px;
  line-height: 130%;
`;

const fadein = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const StyledLink = styled(Link)`
  color: ${(p) => p.theme.colors.light_grey};
  transition: color 0.25s ease;

  &:hover {
    color: ${(p) => p.theme.colors.off_white};
  }
`;

const StyledLinkBottom = styled(Link)`
  color: ${(p) => p.theme.colors.off_white};
  transition: color 0.25s ease;

  &:hover {
    color: ${(p) => p.theme.colors.white};
  }
`;

const StyledButton = styled.button`
  color: ${(p) => p.theme.colors.light_grey};
  transition: color 0.25s ease;

  &:hover {
    color: ${(p) => p.theme.colors.off_white};
  }
`;

const DotSpacer = styled.span`
  margin: 0 10px;
`;
