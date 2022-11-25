import { useRouter } from "next/router";
import { useRef, useState } from "react";
import styled from "styled-components";
import useIsomorphicLayoutEffect from "../hooks/useIsomorphicLayoutEffect";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { useMounted } from "../hooks/useMounted";
import { AboutLayout } from "../pages/about";
import Layout from "./Layout";
import Portal from "./Portal";

const TIMING_MS = 800;

export default function PageAnimator({ component }) {
  const [currentPage, setCurrentComponent] = useState(component);
  const [previousComponent, setPreviousComponent] = useState(null);
  const [difference, setDiffernce] = useState(0);
  const [animate, setAnimate] = useState(false);
  const [direction, setDirection] = useState("");
  const router = useRouter();

  const inRef = useRef<HTMLDivElement>(null);
  const outRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const otherRef = useRef<HTMLDivElement>(null);

  const mounted = useMounted();
  const media = useMediaQuery();

  useIsomorphicLayoutEffect(() => {
    setPreviousComponent(currentPage);
    setCurrentComponent(component);

    const timeout = setTimeout(() => {
      setPreviousComponent(null);
    }, TIMING_MS);

    return () => {
      clearTimeout(timeout);
    };
  }, [component, router.pathname]);

  useIsomorphicLayoutEffect(() => {
    const handleRouteChange = (url) => {
      if (url === "/about") {
        setDirection("in");
      } else {
        setDirection("out");
      }

      setPreviousComponent(null);
      setAnimate([url, router.pathname].includes("/about"));

      const about = aboutRef.current
        ?.querySelector(".Sidebar")
        .getBoundingClientRect().left;
      const other = otherRef.current
        ?.querySelector(".Sidebar")
        .getBoundingClientRect().left;

      setDiffernce(other - about);
    };

    router.events.on("routeChangeStart", handleRouteChange);
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router.pathname, previousComponent, inRef, outRef, animate]);

  useIsomorphicLayoutEffect(() => {
    if (!animate) {
      return;
    }
    const options = {
      easing: "cubic-bezier(0.72, 0, 0.28, 1)",
      duration: TIMING_MS,
    };

    if (direction === "in") {
      inRef.current?.animate(
        [
          { transform: `translateX(${difference}px` },
          { transform: `translateX(0px)` },
        ],
        options
      );
      outRef.current?.animate(
        [
          { transform: `translateX(0px)`, opacity: 1 },
          { transform: `translateX(${difference * -1}px`, opacity: 0 },
        ],
        options
      );
    }

    if (direction === "out") {
      inRef.current?.animate(
        [
          { transform: `translateX(${difference * -1}px`, opacity: 0 },
          { transform: `translateX(0)`, opacity: 1 },
        ],
        options
      );
      outRef.current?.animate(
        [
          { transform: `translateX(0)`, opacity: 1 },
          { transform: `translateX(${difference}px`, opacity: 0 },
        ],
        options
      );
    }
  }, [
    difference,
    animate,
    inRef.current,
    outRef.current,
    previousComponent,
    direction,
  ]);

  if (media.desktopSmall) {
    return component;
  }

  return (
    <>
      {previousComponent && animate && mounted ? (
        <>
          <Fixed ref={inRef}>{component}</Fixed>
          <Fixed ref={outRef}>{previousComponent}</Fixed>
        </>
      ) : (
        component
      )}
      {mounted && (
        <Portal>
          <HiddenPage ref={aboutRef}>
            <AboutLayout />
          </HiddenPage>
          <HiddenPage ref={otherRef}>
            <Layout />
          </HiddenPage>
        </Portal>
      )}
    </>
  );
}

const Fixed = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  opacity: 1;
  z-index: 2147483647;
  pointer-events: none;
`;

const HiddenPage = styled(Fixed)`
  visibility: hidden;
  opacity: 0;
  z-index: -1;
`;
