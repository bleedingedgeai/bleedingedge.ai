import React from "react";
import { theme } from "../../styles/theme";
import { IconProps } from "./types";

const IconSend = ({
  fill = theme.colors.light_grey,
  size = 18,
  ...rest
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <path
      d="M3.23438 14.2699V10.2353L8.20769 9.00021L3.23438 7.73217V3.73047L15.75 9.00021L3.23438 14.2699Z"
      fill={fill}
    />
  </svg>
);

export default IconSend;
