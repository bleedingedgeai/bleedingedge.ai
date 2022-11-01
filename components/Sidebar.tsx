import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import styled from "styled-components";
import IconLogo from "../components/Icons/IconLogo";
import { theme } from "../styles/theme";
import IconGoTo from "./Icons/IconGoTo";
import Subscribe from "./Subscribe";

const links = [
  {
    path: "/",
    text: "Articles",
  },
  {
    path: "/ama",
    text: "Ask me anything",
  },
];

export default function Sidebar() {
  const router = useRouter();
  const session = useSession();

  return (
    <Container>
      <div>
        <LogoContainer>
          <Link href="/">
            <a>
              <IconLogo />
            </a>
          </Link>
        </LogoContainer>
        {links.map((link) => {
          const active =
            link.path === "/"
              ? router.pathname === link.path
              : router.pathname.includes(link.path);

          return (
            <Row key={link.path}>
              <Link href={link.path}>
                <StyledLink
                  style={
                    active ? { color: theme.colors.white, fontWeight: 600 } : {}
                  }
                >
                  {link.text} {router.pathname === link.path && "—"}
                </StyledLink>
              </Link>
            </Row>
          );
        })}
        <Spacer />
        <Row>
          <Subscribe />
        </Row>
        {!session.data ? (
          <StyledButton onClick={() => signIn("twitter")}>Sign in</StyledButton>
        ) : (
          <StyledButton onClick={() => signOut()}>Sign out</StyledButton>
        )}
      </div>
      <div>
        <Description>
          bleeding edge is a feed of noteworthy developments in AI. this site is
          very much a work in progress. please send suggestions and feedback!
        </Description>
        <div>
          <Link href="/about">
            <StyledLinkBottom>About this project</StyledLinkBottom>
          </Link>
          <DotDivider>·</DotDivider>
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
`;

const Spacer = styled.div`
  height: 32px;
`;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: 100vh;
  padding: 38px 0 42px;
`;

const LogoContainer = styled.div`
  max-width: 143px;
  margin-bottom: 60px;
`;

const Description = styled.div`
  color: ${(p) => p.theme.colors.light_grey};
  margin-bottom: 16px;
  line-height: 130%;
`;

const StyledLink = styled.a`
  color: ${(p) => p.theme.colors.light_grey};
  transition: color 0.25s ease;

  &:hover {
    color: ${(p) => p.theme.colors.off_white};
  }
`;

const StyledLinkBottom = styled.a`
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

const DotDivider = styled.span`
  margin: 0 16px;
`;
