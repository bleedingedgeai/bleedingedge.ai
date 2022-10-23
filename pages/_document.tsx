import Document, { DocumentContext, DocumentInitialProps } from "next/document";
import { Head, Html, Main, NextScript } from "next/document";
import { ServerStyleSheet } from "styled-components";
import { theme } from "../styles/theme";

export default class MyDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps> {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render(): JSX.Element {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin=""
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Space+Mono&display=swap"
            rel="stylesheet"
          />
          <link href="/fonts/fonts.css" rel="stylesheet" />
          <meta name="theme-color" content={theme.colors.black} />
          <meta
            name="theme-color"
            content={theme.colors.black}
            media="(prefers-color-scheme: light)"
          />
          <meta
            name="theme-color"
            content={theme.colors.black}
            media="(prefers-color-scheme: dark)"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
