import Link from "next/link";
import { Fragment, useContext } from "react";
import styled from "styled-components";
import Bounds from "../components/Bounds";
import Grid from "../components/Grid";
import IconArrowLeft from "../components/Icons/IconArrowLeft";
import Navigation from "../components/Navigation";
import { OverlayContext, OverlayType } from "../components/Overlay";
import SEO from "../components/SEO";
import Sidebar from "../components/Sidebar";
import { mq } from "../styles/mediaqueries";

const specialThanks = [
  {
    name: "Brock Whittaker",
    href: "https://twitter.com/____brock____",
  },
  {
    name: "David Song",
    href: "https://twitter.com/davidtsong",
  },
  {
    name: "Dennis Brotzky",
    href: "ttps://twitter.com/brotzky_",
  },
  {
    name: "Thiago Costa",
    href: "https://twitter.com/tcosta_co",
  },
];

const additionalThanks = [
  {
    name: "Evan Conrad",
    href: "https://www.twitter.com/evanjconrad",
  },
  {
    name: "Joseph Nelson",
    href: "https://www.twitter.com/josephofiowa",
  },
  {
    name: "Marco Mascorro",
    href: "https://twitter.com/Mascobot",
  },
  {
    name: "roon",
    href: "https://twitter.com/tszzl",
  },
];

export default function About() {
  const { showOverlay } = useContext(OverlayContext);

  return (
    <>
      <SEO title="bleeding edge | About" />
      <Background>
        <Navigation />
        <Bounds>
          <Grid>
            <ColumnLeft>
              <AboutContainer>
                <div>
                  <Link href="/">
                    <a>
                      <Timeline>
                        <ArrowContainer>
                          <IconArrowLeft size={24} />
                        </ArrowContainer>
                        Return to timeline
                      </Timeline>
                    </a>
                  </Link>
                  <MobileAboutText>
                    bleeding edge is a feed of noteworthy developments in AI.
                    this site is very much a work in progress. please send
                    suggestions and feedback!
                  </MobileAboutText>
                  <Paragraph>
                    <span>What is this?</span> This is me scratching my own
                    itch. The pace of development in AI right now is staggering
                    and there’s been no easy way to keep up with all of the
                    interesting developments. bleeding edge is my attempt at
                    solving that. It’s a chronological collation of all the most
                    noteworthy developments (as decided by me… for now). I hope
                    to have a more developed criteria for what gets included in
                    the future, and a better way to err on the side of including
                    more niche content without diluting the usefulness of the
                    homepage.
                  </Paragraph>
                  <Paragraph>
                    <span>Who am I?</span> My name’s Lachy. I’m not an AI
                    researcher, but I would like to better stay on top of
                    everything going on. That’s why I started bleeding edge.
                  </Paragraph>
                </div>
                <Footer>
                  <div>
                    Very special thanks to:{" "}
                    {specialThanks.map((thanks, index) => (
                      <Fragment key={thanks.name}>
                        <a href={thanks.href} target="_blank" rel="noopener">
                          {thanks.name}
                        </a>
                        {index !== specialThanks.length - 1 && ", "}
                      </Fragment>
                    ))}
                    . Additional thanks to{" "}
                    {additionalThanks.map((thanks, index) => (
                      <Fragment key={thanks.name}>
                        <a href={thanks.href} target="_blank" rel="noopener">
                          {thanks.name}
                        </a>
                        {index !== specialThanks.length - 1 && ", "}
                      </Fragment>
                    ))}
                    .
                  </div>
                  <div>
                    <button onClick={() => showOverlay(OverlayType.SUGGESTION)}>
                      Entry suggestions
                    </button>{" "}
                    are always welcome! In addition, I’ve open sourced the site
                    on{" "}
                    <a
                      href="https://github.com/bleedingedgeai/bleedingedge.ai"
                      target="_blank"
                      rel="noopener"
                    >
                      GitHub
                    </a>
                    , so please feel free to contribute.
                  </div>
                </Footer>
              </AboutContainer>
            </ColumnLeft>
            <ColumnRight>
              <Sidebar />
            </ColumnRight>
          </Grid>
        </Bounds>
      </Background>
    </>
  );
}

const MobileAboutText = styled.p`
  margin-bottom: 64px;
  max-width: 493px;
  color: ${(p) => p.theme.colors.light_grey};

  ${mq.desktopSmallUp} {
    display: none;
  }

  ${mq.phablet} {
    margin-bottom: 42px;
  }
`;

const Background = styled.div`
  min-height: 100vh;
`;

const ColumnLeft = styled.div`
  grid-column: 3 / 12;

  ${mq.desktopSmall} {
    grid-column: 1 / 19;
  }
`;

const ColumnRight = styled.div`
  grid-column: 14 / 18;
  width: calc(100% + 21px);

  ${mq.desktopSmall} {
    display: none;
  }
`;

const AboutContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  min-height: 100vh;
  padding: 40px 0 42px;

  ${mq.desktopSmall} {
    padding-top: 10px;
  }

  ${mq.desktopSmall} {
    min-height: calc(100vh - 110px);
  }
`;

const Paragraph = styled.p`
  font-family: ${(p) => p.theme.fontFamily.nouvelle};
  font-weight: 500;
  font-size: 24px;
  line-height: 120%;
  color: ${(p) => p.theme.colors.off_white};
  margin-bottom: 32px;

  span {
    color: ${(p) => p.theme.colors.light_grey};
  }

  a:hover {
    text-decoration: underline;
  }

  ${mq.desktopMedium} {
    font-size: 21px;
  }

  ${mq.tablet} {
    margin-bottom: 24px;
  }

  ${mq.phablet} {
    font-size: 18px;
    line-height: 115%;
    margin-bottom: 16px;
  }
`;

const ArrowContainer = styled.div`
  position: absolute;
  left: -32px;
  transition: transform 0.25s ease;
`;

const Timeline = styled.div`
  position: relative;
  margin-bottom: 62px;
  display: flex;
  align-items: center;

  &:hover ${ArrowContainer} {
    transform: translateX(-3px);
  }

  ${mq.desktopSmall} {
    display: none;
  }
`;

const Footer = styled.div`
  font-family: ${(p) => p.theme.fontFamily.nouvelle};
  color: ${(p) => p.theme.colors.light_grey};
  font-size: 14px;
  line-height: 120%;
  padding-top: 32px;
  margin-top: 32px;
  border-top: 1px solid rgba(255, 255, 255, 0.5);
  display: grid;
  grid-template-columns: 346px 1fr;
  grid-gap: 36px;

  a,
  button {
    color: ${(p) => p.theme.colors.light_grey};
    text-decoration: underline;
    transition: color 0.25s ease;

    &:hover {
      color: #fff;
    }
  }

  ${mq.tablet} {
    padding-top: 24px;
    margin-top: 86px;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
    grid-gap: 32px;
  }

  ${mq.phablet} {
    font-size: 16px;
  }
`;
