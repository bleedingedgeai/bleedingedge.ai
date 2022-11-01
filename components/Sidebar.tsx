<<<<<<< HEAD
import { signIn, signOut, useSession } from "next-auth/react";
=======
>>>>>>> 10f57a2021271330ad35f9d0df39bb867288f16e
import Link from "next/link";
import { useRouter } from "next/router";
import styled from "styled-components";
import IconLogo from "../components/Icons/IconLogo";
<<<<<<< HEAD
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
=======
import Contact from "./Contact";

export default function Sidebar() {
  const router = useRouter();
>>>>>>> 10f57a2021271330ad35f9d0df39bb867288f16e

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
<<<<<<< HEAD
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
=======
>>>>>>> 10f57a2021271330ad35f9d0df39bb867288f16e
        <Description>
          bleeding edge is a feed of noteworthy developments in AI. this site is
          very much a work in progress. please send suggestions and feedback!
        </Description>
<<<<<<< HEAD
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
=======
        {router.pathname !== "/about" && (
          <Link href="/about">
            <StyledLink>
              More about this project
              <ArrowContainer>
                <IconArrowRight />
              </ArrowContainer>
            </StyledLink>
          </Link>
        )}
      </div>
      <Contact />
>>>>>>> 10f57a2021271330ad35f9d0df39bb867288f16e
    </Container>
  );
}

<<<<<<< HEAD
const Row = styled.div`
  margin-bottom: 8px;
`;

const Spacer = styled.div`
  height: 32px;
`;

=======
>>>>>>> 10f57a2021271330ad35f9d0df39bb867288f16e
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

<<<<<<< HEAD
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
=======
const ArrowContainer = styled.span`
  position: relative;

  svg {
    position: relative;
    left: -2px;
    margin: 0 0 1px 6px;
    opacity: 0;
    transition: opacity 0.2s ease, transform 0.3s ease;
  }
`;

const StyledLink = styled.a`
  &:hover ${ArrowContainer} svg {
    opacity: 1;
    transform: translateX(4px);
  }
`;

const IconArrowRight = () => (
  <svg
    width="15"
    height="8"
    viewBox="0 0 15 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14.3536 4.35355C14.5488 4.15829 14.5488 3.84171 14.3536 3.64645L11.1716 0.464466C10.9763 0.269204 10.6597 0.269204 10.4645 0.464466C10.2692 0.659728 10.2692 0.976311 10.4645 1.17157L13.2929 4L10.4645 6.82843C10.2692 7.02369 10.2692 7.34027 10.4645 7.53553C10.6597 7.7308 10.9763 7.7308 11.1716 7.53553L14.3536 4.35355ZM0 4.5H14V3.5H0V4.5Z"
      fill="white"
    />
  </svg>
);
>>>>>>> 10f57a2021271330ad35f9d0df39bb867288f16e
