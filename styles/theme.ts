import { Space_Mono } from "@next/font/google";
import localFont from "@next/font/local";

const nouvelle = localFont({
  src: [
    {
      path: "./fonts/nouvelle/NNNouvelleGroteskSTD-Normal.woff2",
      weight: "400",
    },
    {
      path: "./fonts/nouvelle/NNNouvelleGroteskSTD-Medium.woff2",
      weight: "500",
    },
  ],
  display: "swap",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: false,
  fallback: ["monospace"],
});

export interface BleedingEdgeTheme {
  colors: {
    white: string;
    off_white: string;
    light_grey: string;
    dark_grey: string;
    black: string;
    orange: string;
    magenta: string;
  };
  fontFamily: {
    nouvelle: string;
    space: string;
  };
}

export const theme: BleedingEdgeTheme = {
  colors: {
    white: "#FFFFFF",
    off_white: "#CECECE",
    light_grey: "#969696",
    orange: "#D19F64",
    dark_grey: "#0A0A0A",
    black: "#000000",
    magenta: "#FA2162",
  },
  fontFamily: {
    nouvelle: nouvelle.style.fontFamily,
    space: spaceMono.style.fontFamily,
  },
};
