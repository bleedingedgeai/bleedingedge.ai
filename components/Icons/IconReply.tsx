import React from "react";
import { theme } from "../../styles/theme";
import { IconProps } from "./types";

const IconReply = ({
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
      d="M2.66663 3.09271C2.66663 3.04151 2.70813 3 2.75933 3L10.9073 3C10.9585 3 11 3.04151 11 3.09271V9.76858C11 9.81978 10.9585 9.86129 10.9073 9.86129H7.04154C7.01511 9.86129 6.98994 9.87256 6.97235 9.89229L4.9789 12.1274C4.94833 12.1617 4.89159 12.1401 4.89159 12.0941V9.95399C4.89159 9.90279 4.85008 9.86129 4.79888 9.86129H2.75933C2.70813 9.86129 2.66663 9.81978 2.66663 9.76858L2.66663 3.09271Z"
      fill={fill}
      stroke={fill}
    />
    <path
      d="M7.99996 12.1369H9.47585C9.49915 12.1369 9.5216 12.1456 9.53872 12.1614L11.556 14.0231C11.6154 14.0779 11.7116 14.0358 11.7116 13.955V12.2296C11.7116 12.1784 11.7531 12.1369 11.8043 12.1369H13.5739C13.6251 12.1369 13.6666 12.0954 13.6666 12.0442L13.6666 7"
      stroke={fill}
      strokeLinecap="round"
    />
  </svg>
);

export default IconReply;
