import React from "react";
import { theme } from "../../styles/theme";
import { IconProps } from "./types";

const IconArrowLeft = ({
  fill = theme.colors.white,
  size = 24,
  ...rest
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <path
      d="M4.64645 11.6464C4.45118 11.8417 4.45118 12.1583 4.64645 12.3536L7.82843 15.5355C8.02369 15.7308 8.34027 15.7308 8.53553 15.5355C8.7308 15.3403 8.7308 15.0237 8.53553 14.8284L5.70711 12L8.53553 9.17157C8.7308 8.97631 8.7308 8.65973 8.53553 8.46447C8.34027 8.2692 8.02369 8.2692 7.82843 8.46447L4.64645 11.6464ZM19 11.5L5 11.5L5 12.5L19 12.5L19 11.5Z"
      fill="white"
    />
  </svg>
);

export default IconArrowLeft;
