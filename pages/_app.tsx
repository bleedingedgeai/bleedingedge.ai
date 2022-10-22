import dynamic from "next/dynamic";
import React, { Suspense } from "react";
import { ThemeProvider } from "styled-components";
import Favicon from "../components/Favicon";
import { OerlayProvider } from "../components/Overlay";
import { GlobalStyle } from "../styles/global";
import { theme } from "../styles/theme";

const DynamicOverlay = dynamic(() => import("../components/Overlay"), {
  suspense: true,
});

export default function App({ Component, pageProps }) {
  return (
    <>
      <Favicon />
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <OerlayProvider>
          <Component {...pageProps} />
          <Suspense fallback={null}>
            <DynamicOverlay />
          </Suspense>
        </OerlayProvider>
      </ThemeProvider>
    </>
  );
}
