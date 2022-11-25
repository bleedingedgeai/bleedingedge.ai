import React from "react";
import { theme } from "../../styles/theme";
import { IconProps } from "./types";

const IconArticle = ({
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
      d="M4.91377 11.0708H9.375V10.0471H4.91377V11.0708ZM4.91377 8.50417H11.0862V7.49583H4.91377V8.50417ZM4.91377 5.9529H11.0862V4.92917H4.91377V5.9529ZM3.52373 13.5C3.24873 13.5 3.0093 13.3982 2.80543 13.1946C2.60181 12.9907 2.5 12.7513 2.5 12.4763V3.52373C2.5 3.24873 2.60181 3.0093 2.80543 2.80543C3.0093 2.60181 3.24873 2.5 3.52373 2.5H12.4763C12.7513 2.5 12.9907 2.60181 13.1946 2.80543C13.3982 3.0093 13.5 3.24873 13.5 3.52373V12.4763C13.5 12.7513 13.3982 12.9907 13.1946 13.1946C12.9907 13.3982 12.7513 13.5 12.4763 13.5H3.52373Z"
      fill={fill}
    />
  </svg>
);

export default IconArticle;
