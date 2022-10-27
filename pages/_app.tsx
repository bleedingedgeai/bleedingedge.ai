import { usePostHog } from "next-use-posthog";
import dynamic from "next/dynamic";
import Script from "next/script";
import React, { Suspense } from "react";
import { ThemeProvider } from "styled-components";
import { UserProvider } from "@auth0/nextjs-auth0";
import Favicon from "../components/Favicon";
import { OerlayProvider } from "../components/Overlay";
import { GlobalStyle } from "../styles/global";
import { theme } from "../styles/theme";

const DynamicOverlay = dynamic(() => import("../components/Overlay"), {
  suspense: true,
});

export default function App({ Component, pageProps }) {
  usePostHog(process.env.NEXT_PUBLIC_POSTHOG_API_KEY, {
    api_host: "https://app.posthog.com",
    loaded: (posthog) => {
      if (process.env.NODE_ENV === "development") posthog.opt_out_capturing();
    },
  });

  return (
    <>
      <Favicon />
      <GlobalStyle />
      <UserProvider>
        <ThemeProvider theme={theme}>
          <OerlayProvider>
            <Component {...pageProps} />
            <Suspense fallback={null}>
              <DynamicOverlay />
            </Suspense>
          </OerlayProvider>
        </ThemeProvider>
      </UserProvider>
      <div style={{ position: "fixed", zIndex: 100000, top: 0 }}>
        <a href="/api/auth/login">Login</a>
        <a href="/api/auth/logout">Logout</a>
      </div>

      {process.env.NODE_ENV === "production" ? (
        <Script id="insights" src="/va/script.js" strategy="afterInteractive" />
      ) : null}
    </>
  );
}
