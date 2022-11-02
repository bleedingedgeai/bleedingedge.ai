import React from "react";
import { theme } from "../../styles/theme";
import { IconProps } from "./types";

const IconEdit = ({
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
      d="M3 13V10.6267L8.67972 4.947L11.053 7.32028L5.37327 13H3ZM11.7993 6.57399L9.42601 4.20072L10.2798 3.3469C10.5111 3.11563 10.7556 3 11.0133 3C11.271 3 11.5155 3.11563 11.7468 3.3469L12.6531 4.2532C12.8844 4.48447 13 4.72896 13 4.98669C13 5.24441 12.8844 5.48891 12.6531 5.72017L11.7993 6.57399Z"
      fill={fill}
    />
  </svg>
);

export default IconEdit;
