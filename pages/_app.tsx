import { usePostHog } from "next-use-posthog";
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
  usePostHog(process.env.POSTHOG_API_KEY, {
    api_host: "https://app.posthog.com",
    loaded: (posthog) => {
      if (process.env.NODE_ENV === "development") posthog.opt_out_capturing();
    },
  });

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
