import React from "react";
import { theme } from "../../styles/theme";
import { IconProps } from "./types";

const IconUpvote = ({
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
      d="M8 14.5C11.5899 14.5 14.5 11.5899 14.5 8C14.5 4.41015 11.5899 1.5 8 1.5C4.41015 1.5 1.5 4.41015 1.5 8C1.5 11.5899 4.41015 14.5 8 14.5ZM8.25723 5.42875C8.14071 5.23455 7.85925 5.23454 7.74273 5.42874L5.2725 9.54565C5.15252 9.7456 5.29655 10 5.52974 10H10.47C10.7032 10 10.8473 9.74561 10.7273 9.54566L8.25723 5.42875Z"
      fill="#969696"
    />
  </svg>
);

export default IconUpvote;
