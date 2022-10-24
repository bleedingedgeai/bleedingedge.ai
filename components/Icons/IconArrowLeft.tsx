import React from "react";
import { theme } from "../../styles/theme";
import { IconProps } from "./types";

const IconArrowLeft = ({
  fill = theme.colors.white,
  size = 36,
  ...rest
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <path
      d="M6.96967 17.4697C6.67678 17.7626 6.67678 18.2374 6.96967 18.5303L11.7426 23.3033C12.0355 23.5962 12.5104 23.5962 12.8033 23.3033C13.0962 23.0104 13.0962 22.5355 12.8033 22.2426L8.56066 18L12.8033 13.7574C13.0962 13.4645 13.0962 12.9896 12.8033 12.6967C12.5104 12.4038 12.0355 12.4038 11.7426 12.6967L6.96967 17.4697ZM28.5 17.25L7.5 17.25L7.5 18.75L28.5 18.75L28.5 17.25Z"
      fill="white"
    />
  </svg>
);

export default IconArrowLeft;
