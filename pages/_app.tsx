import { usePostHog } from "next-use-posthog";
import dynamic from "next/dynamic";
import Script from "next/script";
import React, { Suspense } from "react";
import { ThemeProvider } from "styled-components";
import { UserProvider, useUser } from "@auth0/nextjs-auth0";
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
            <Login />
            <Component {...pageProps} />
            <Suspense fallback={null}>
              <DynamicOverlay />
            </Suspense>
          </OerlayProvider>
        </ThemeProvider>
      </UserProvider>

      {process.env.NODE_ENV === "production" ? (
        <Script id="insights" src="/va/script.js" strategy="afterInteractive" />
      ) : null}
    </>
  );
}

function Login() {
  const user = useUser();

  if (user.isLoading) {
    return null;
  }

  return (
    <div style={{ position: "fixed", zIndex: 100000, top: 0, padding: 8 }}>
      {user.user ? (
        <>
          <div
            style={{
              display: "flex",
              background: "rgba(255,255,255,0.1)",
              padding: "4px 8px",
              borderRadius: 3,
            }}
          >
            {user?.user?.name}{" "}
            <img
              src={user?.user?.picture}
              style={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                marginLeft: 6,
              }}
            />
          </div>
          <a
            href="/api/auth/logout"
            style={{ margin: "4px 0px 8px 10px", display: "inline-block" }}
          >
            Logout
          </a>
        </>
      ) : (
        <a href="/api/auth/login">Login</a>
      )}
    </div>
  );
}
