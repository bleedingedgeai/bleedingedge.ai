import { useRouter } from "next/router";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import styled from "styled-components";
import { $ } from "../helpers/dom";
import AboutPage from "../pages/about";
import Layout from "./Layout";
import Portal from "./Portal";

export default function PageAnimator({ Component }) {
  const [currentPage, setCurrentPage] = useState(Component);
  const [previousPage, setPreviousPage] = useState(null);
  const [difference, setDiffernce] = useState(0);
  const [animate, setAnimate] = useState(false);
  const router = useRouter();

  const aboutRef = useRef<HTMLDivElement>(null);
  const otherRef = useRef<HTMLDivElement>(null);
  const isOnAboutPage = router.pathname === "/about";

  useLayoutEffect(() => {
    setPreviousPage(currentPage);
    setCurrentPage(Component);

    const timeout = setTimeout(() => {
      setPreviousPage(null);
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [Component, router.pathname]);

  useEffect(() => {
    const handleRouteChange = (url) => {
      console.log(url, router.pathname);
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

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router.pathname]);

  if (previousPage && animate) {
    if (isOnAboutPage) {
      console.log({ difference, isOnAboutPage });
      return (
        <>
          <InAbout difference={difference}>{Component}</InAbout>
          <OutAbout difference={difference * -1}>{previousPage}</OutAbout>
        </>
      );
    }

    return (
      <>
        <InOther difference={difference * -1}>{Component}</InOther>
        <OutOther difference={difference}>{previousPage}</OutOther>
      </>
    );
  }

  return (
    <>
      {Component}
      <Portal>
        <HiddenPage ref={aboutRef}>
          <AboutPage />
        </HiddenPage>
        <HiddenPage ref={otherRef}>
          <Layout />
        </HiddenPage>
      </Portal>
    </>
  );
}

const OutAbout = styled.div<{ difference: number }>`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  opacity: 1;
  animation: outAbout 1s cubic-bezier(0.68, 0, 0.32, 1) forwards;
  z-index: 2147483647;
  will-change: opacity;

  @keyframes outAbout {
    0% {
      transform: translateX(0);
      opacity: 1;
    }
    80% {
      opacity: 1;
    }
    100% {
      transform: translateX(${(p) => p.difference}px);
      opacity: 0;
    }
  }
`;

const InAbout = styled.div<{ difference: number }>`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  opacity: 1;
  animation: inAbout 1s cubic-bezier(0.68, 0, 0.32, 1) forwards;
  z-index: 2147483647;
  will-change: opacity;

  @keyframes inAbout {
    from {
      transform: translateX(${(p) => p.difference}px);
    }
    to {
      transform: translateX(0);
    }
  }
`;

const OutOther = styled.div<{ difference: number }>`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  opacity: 1;
  animation: out 1s cubic-bezier(0.68, 0, 0.32, 1) forwards;
  z-index: 2147483647;
  will-change: opacity;

  @keyframes out {
    0% {
      transform: translateX(0);
      opacity: 1;
    }
    80% {
      opacity: 1;
    }
    100% {
      transform: translateX(${(p) => p.difference}px);
      opacity: 0;
    }
  }
`;

const InOther = styled.div<{ difference: number }>`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  opacity: 1;
  animation: in 1s cubic-bezier(0.68, 0, 0.32, 1) forwards;
  z-index: 2147483647;
  will-change: opacity;

  @keyframes in {
    from {
      transform: translateX(${(p) => p.difference}px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

const HiddenPage = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  visibility: hidden;
  opacity: 0;
  pointer-events: none;
`;
