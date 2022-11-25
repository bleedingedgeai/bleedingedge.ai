import React from "react";
import { theme } from "../../styles/theme";
import { IconProps } from "./types";

const IconReplied = ({
  fill = theme.colors.light_grey,
  size = 16,
  ...rest
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <path
      d="M10.626 12.5814L8.38063 10.3103L9.53639 9.14189L10.626 10.2315L12.8316 8.0126L14 9.20743L10.626 12.5814ZM2 13.7498V3.66684C2 3.20302 2.16196 2.80937 2.48587 2.48587C2.80979 2.16196 3.20365 2 3.66747 2H11.8863C12.3502 2 12.744 2.16196 13.0679 2.48587C13.3919 2.80937 13.5538 3.20302 13.5538 3.66684V7.05472H7.47505V11.4263H4.32412L2 13.7498Z"
      fill={fill}
    />
  </svg>
);

export default IconReplied;
