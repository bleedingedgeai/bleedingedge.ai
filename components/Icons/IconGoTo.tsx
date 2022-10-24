import React from "react";
import { theme } from "../../styles/theme";
import { IconProps } from "./types";

const IconGoTo = ({
  fill = theme.colors.off_white,
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
      d="M8 11.5L8 12L8.5 12L8.5 11.5L8 11.5ZM8.35355 2.64645C8.15829 2.45118 7.84171 2.45118 7.64645 2.64645L4.46447 5.82843C4.2692 6.02369 4.2692 6.34027 4.46447 6.53553C4.65973 6.7308 4.97631 6.7308 5.17157 6.53553L8 3.70711L10.8284 6.53553C11.0237 6.7308 11.3403 6.7308 11.5355 6.53553C11.7308 6.34027 11.7308 6.02369 11.5355 5.82843L8.35355 2.64645ZM3 12L8 12L8 11L3 11L3 12ZM8.5 11.5L8.5 3L7.5 3L7.5 11.5L8.5 11.5Z"
      fill={fill}
    />
  </svg>
);

export default IconGoTo;
