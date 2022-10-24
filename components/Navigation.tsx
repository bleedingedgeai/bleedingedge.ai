import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import styled from "styled-components";
import { mq } from "../styles/mediaqueries";
import Bounds from "./Bounds";
import IconArrowLeft from "./Icons/IconArrowLeft";
import IconEx from "./Icons/IconEx";
import IconLogo from "./Icons/IconLogo";
import { OverlayContext, OverlayType } from "./Overlay";
import Portal from "./Portal";

export default function Navigation() {
  const router = useRouter();
  const { showOverlay, hideOverlay } = useContext(OverlayContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const tag = router.query?.tag as string;

  const menuInvisibleStyles = (
    menuOpen
      ? { opacity: 1, pointerEvents: "auto" }
      : { opacity: 0, pointerEvents: "none" }
  ) as React.CSSProperties;

  const menuStyles = menuOpen
    ? { transform: "translateX(0%)" }
    : { transform: "translateX(100%)" };

  return (
    <>
      <Nav>
        <Bounds>
          <Content>
            <LogoContainer>
              <Link href="/">
                <a>
                  <IconLogo />
                </a>
              </Link>
            </LogoContainer>
            <DesktopLinks>
              <SubscribButton>Subscribe</SubscribButton>
              <Link href="/about">About</Link>
            </DesktopLinks>
            <MenuButton
              onClick={() => {
                setMenuOpen((prev) => !prev);
                hideOverlay();
              }}
            >
              Menu
            </MenuButton>
          </Content>
        </Bounds>
        {tag && (
          <Bounds>
            <Tag onClick={() => router.replace("/")}>
              {tag}
              <IconEx size={16} />
            </Tag>
          </Bounds>
        )}
        <Portal>
          <MenuInvisible
            style={menuInvisibleStyles}
            onClick={() => setMenuOpen(false)}
          />
          <Menu style={menuStyles}>
            <BlueGradientContainer>
              <BlueGradient />
            </BlueGradientContainer>
            <MenuContent>
              <div>
                <BackButton
                  onClick={() => {
                    hideOverlay();
                    setMenuOpen(false);
                  }}
                >
                  <IconArrowLeft />
                </BackButton>
                <List>
                  <Item>
                    {router.pathname === "/" ? (
                      <Link href="/about">About</Link>
                    ) : (
                      <Link href="/">Home</Link>
                    )}
                  </Item>
                  <Item>
                    <a href="mailto:lachygroom@gmail.com">Email</a>
                  </Item>
                  <Item>
                    <a
                      href="https://twitter.com/bleedingedgeai"
                      target="_blank"
                      rel="noopener"
                    >
                      Twitter
                    </a>
                  </Item>
                </List>
                <Divider />
                <List>
                  <Item>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        showOverlay(OverlayType.SUBSCRIBE);
                      }}
                    >
                      Subscribe
                    </button>
                  </Item>
                  <Item>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        showOverlay(OverlayType.SUGGESTION);
                      }}
                    >
                      Contribute
                    </button>
                  </Item>
                </List>
              </div>
              <Signature>
                A Project by
                <br /> Lachy Groom
              </Signature>
            </MenuContent>
          </Menu>
        </Portal>
      </Nav>
    </>
  );
}

const Nav = styled.nav`
  position: sticky;
  top: 0;
  z-index: 2147483647;
  background: ${(p) => p.theme.colors.black};
  margin-bottom: 32px;

  ${mq.desktopSmallUp} {
    display: none;
  }

  ${mq.tablet} {
    margin-bottom: 28px;
  }

  ${mq.phablet} {
    background: rgba(0, 0, 0, 0.64);
    backdrop-filter: blur(13px);
    margin-bottom: 20px;
  }
`;

const Tag = styled.button`
  border-radius: 6px;
  font-family: ${(p) => p.theme.fontFamily.nouvelle};
  font-weight: 500;
  font-size: 14px;
  line-height: 120%;
  text-align: center;
  color: ${(p) => p.theme.colors.light_grey};
  background: rgba(133, 133, 133, 0.16);
  border: 1px solid rgba(133, 133, 133, 0.52);
  border-radius: 6px;
  padding: 4px 7px 4px 12px;
  display: inline-flex;
  align-items: center;
  margin-bottom: 4px;
  position: relative;
  top: -4px;

  svg {
    margin-left: 9px;
  }

  ${mq.phabletUp} {
    display: none;
  }
`;

const Menu = styled.div`
  position: fixed;
  height: 100%;
  top: 0;
  right: 0;
  width: 230px;
  border-left: 1px solid rgba(255, 255, 255, 0.16);
  background: ${(p) => p.theme.colors.dark_grey};
  z-index: 2147483647;
  padding: 26px 0 48px 26px;
  transition: transform 0.3s cubic-bezier(0.33, 1, 0.68, 1);
`;

const MenuInvisible = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 2147483647;
  background: rgba(0, 0, 0, 0.9);
  transition: opacity 0.3s;
`;

const MenuContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

const Signature = styled.div`
  position: relative;
  font-family: ${(p) => p.theme.fontFamily.nouvelle};
  font-size: 16px;
  line-height: 120%;
  color: ${(p) => p.theme.colors.light_grey};
`;

const BackButton = styled.button`
  margin-bottom: 60px;
`;

const Divider = styled.hr`
  border: none;
  height: 1px;
  margin: 30px 0;
  width: 90px;
  background: rgba(255, 255, 255, 0.16);
`;

const List = styled.ul`
  list-style: none;
`;

const Item = styled.li`
  font-weight: 400;
  font-size: 16px;
  line-height: 135%;

  &:not(:last-child) {
    margin-bottom: 20px;
  }
`;

const Content = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 32px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  ${mq.phablet} {
    padding: 27px 0;
    border: none;
  }
`;

const LogoContainer = styled.div`
  max-width: 143px;
`;

const DesktopLinks = styled.div`
  ${mq.phablet} {
    display: none;
  }
`;
const SubscribButton = styled.button`
  margin-right: 48px;

  ${mq.phablet} {
    display: none;
  }
`;

const MenuButton = styled.button`
  ${mq.phabletUp} {
    display: none;
  }
`;

const BlueGradientContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  filter: blur(52px);
  opacity: 1;
`;

const BlueGradient = () => (
  <svg
    width="100%"
    viewBox="0 0 230 184"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g filter="url(#filter0_f_201_692)">
      <path
        d="M158.024 144.857L230 184H60.0706L40.5882 165L0 132.714L60.0706 124L158.024 144.857Z"
        fill="url(#paint0_linear_201_692)"
      />
    </g>
    <defs>
      <filter
        id="filter0_f_201_692"
        x="-124"
        y="0"
        width="478"
        height="308"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        />
      </filter>
      <linearGradient
        id="paint0_linear_201_692"
        x1="115"
        y1="184"
        x2="108.239"
        y2="116.129"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#072839" />
        <stop offset="0.525533" stopColor="#033151" />
        <stop offset="1" stopColor="#28445C" />
      </linearGradient>
    </defs>
  </svg>
);
