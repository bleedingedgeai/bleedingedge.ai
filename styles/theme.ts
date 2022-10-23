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
    nouvelle: "'Nouvelle Grotesk', monospace, sans-serif",
    space: "'Space Mono', monospace, sans-serif",
  },
};
