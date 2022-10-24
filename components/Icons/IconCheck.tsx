import React from "react";
import { theme } from "../../styles/theme";
import { IconProps } from "./types";

const IconCheck = ({
  fill = theme.colors.orange,
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
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.8165 5.14737C12.0611 5.39203 12.0611 5.78871 11.8165 6.03338L6.99721 10.8526C6.75255 11.0973 6.35587 11.0973 6.1112 10.8526L4.1835 8.92493C3.93883 8.68027 3.93883 8.28359 4.1835 8.03892C4.42816 7.79426 4.82484 7.79426 5.06951 8.03892L6.55421 9.52362L10.9305 5.14737C11.1751 4.9027 11.5718 4.9027 11.8165 5.14737Z"
      fill={fill}
    />
  </svg>
);

export default IconCheck;
