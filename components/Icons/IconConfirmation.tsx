import React from "react";
import { IconProps } from "./types";

const IconConfirmation = ({
  fill = "#E6E6E6",
  size = 52,
  ...rest
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 52 52"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <circle cx="26" cy="26" r="26" fill="#E6E6E6" />
    <path
      d="M14.4856 27.4263L22.9885 34.9143L37.5142 17.0857"
      stroke="black"
      stroke-width="3"
    />
  </svg>
);

export default IconConfirmation;
