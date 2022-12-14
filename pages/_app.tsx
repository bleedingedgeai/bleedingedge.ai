import { SessionProvider } from "next-auth/react";
import { usePostHog } from "next-use-posthog";
import dynamic from "next/dynamic";
import Script from "next/script";
import React, { Suspense, useEffect, useState } from "react";
import { ThemeProvider } from "styled-components";
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import AlertsProvider from "../components/Alerts/AlertsProvider";
import Favicon from "../components/Favicon";
import { KeyType } from "../components/Keys";
import { OverlayProvider } from "../components/Overlay/Overlay";
import PageAnimator from "../components/PageAnimator";
import { GlobalStyle } from "../styles/global";
import { theme } from "../styles/theme";

const DynamicAlerts = dynamic(() => import("../components/Alerts/Alerts"), {
  suspense: true,
});

const DynamicOverlay = dynamic(() => import("../components/Overlay/Overlay"), {
  suspense: true,
});

export default function App({ Component, pageProps }) {
  usePostHog(process.env.NEXT_PUBLIC_POSTHOG_API_KEY, {
    api_host: "https://app.posthog.com",
    loaded: (posthog) => {
      if (process.env.NODE_ENV === "development") posthog.opt_out_capturing();
    },
  });

  useEffect(() => {
    [KeyType.CMD, KeyType["W-RETURN"]].forEach((key) => {
      const img = new Image();
      img.src = `/keys/key-${key.toLowerCase()}.svg`;
    });
  }, []);
  const [queryClient] = useState(() => new QueryClient());

  return (
    <>
      <Favicon />
      <GlobalStyle />
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <SessionProvider session={pageProps.session}>
            <ThemeProvider theme={theme}>
              <AlertsProvider>
                <OverlayProvider>
                  <PageAnimator component={<Component {...pageProps} />} />
                  <Suspense fallback={null}>
                    <DynamicOverlay />
                    <DynamicAlerts />
                  </Suspense>
                </OverlayProvider>
              </AlertsProvider>
            </ThemeProvider>
          </SessionProvider>
        </Hydrate>
      </QueryClientProvider>

      {process.env.NODE_ENV === "production" ? (
        <Script id="insights" src="/va/script.js" strategy="afterInteractive" />
      ) : null}
    </>
  );
}
