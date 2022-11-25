import React from "react";
import { theme } from "../../styles/theme";
import { IconProps } from "./types";

const IconShield = ({
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
      d="M8.20302 1.09025C8.07373 1.03279 7.92616 1.03279 7.79688 1.09025L2.84234 3.29227C2.66178 3.37252 2.54541 3.55158 2.54541 3.74918V7.0606C2.54541 10.4242 4.87268 13.5697 7.99995 14.3333C11.1272 13.5697 13.4545 10.4242 13.4545 7.0606V3.74918C13.4545 3.55158 13.3381 3.37252 13.1576 3.29227L8.20302 1.09025ZM6.78783 10.697L4.36359 8.27272L5.21813 7.41817L6.78783 8.98181L10.7818 4.98787L11.6363 5.84848L6.78783 10.697Z"
      fill={fill}
    />
  </svg>
);

export default IconShield;
