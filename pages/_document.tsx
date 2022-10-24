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
        </Head>
        <body>
          <Main />
          <SvgDefs />
          <NextScript />
        </body>
      </Html>
    );
  }
}

function SvgDefs() {
  return (
    <svg style={{ height: 0, width: 0 }}>
      <defs>
        <linearGradient
          id="ArticleOrange"
          x1="113.714"
          y1="2.46111"
          x2="180.287"
          y2="198.413"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#A56645" />
          <stop offset="0.335547" stopColor="#D98B63" />
          <stop offset="0.642442" stopColor="#C77B53" />
          <stop offset="1" stopColor="#D08067" />
        </linearGradient>
      </defs>
      <defs>
        <linearGradient
          id="ArticleBlue"
          x1="144"
          y1="0"
          x2="135.111"
          y2="87.0586"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#072839" />
          <stop offset="0.525533" stopColor="#033151" />
          <stop offset="1" stopColor="#28445C" />
        </linearGradient>
      </defs>
    </svg>
  );
}
