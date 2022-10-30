import React from "react";
import { theme } from "../../styles/theme";
import { IconProps } from "./types";

const IconShare = ({
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
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.88423 6.92099L6.30186 4.33862L7.09617 3.54431L11.0279 7.47605L7.09617 11.4078L6.30186 10.6135L8.88423 8.03112H4.436C3.80187 8.03112 3.28312 8.23654 2.87429 8.64538C2.46546 9.05421 2.26004 9.57295 2.26004 10.2071V12.2554C2.26004 12.5619 2.01153 12.8104 1.70497 12.8104C1.39841 12.8104 1.1499 12.5619 1.1499 12.2554V10.2071C1.1499 9.26928 1.4623 8.485 2.08811 7.85919C2.71392 7.23338 3.4982 6.92099 4.436 6.92099H8.88423ZM13.1993 7.47605L10.0619 4.33862L10.8562 3.54431L14.7879 7.47605L10.8562 11.4078L10.0619 10.6135L13.1993 7.47605Z"
      fill="#969696"
    />
  </svg>
);

export default IconShare;
