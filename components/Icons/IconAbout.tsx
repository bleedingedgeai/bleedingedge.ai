import React from "react";
import { IconProps } from "./types";

const IconAbout = ({ fill = "#797674", size = 16, ...rest }: IconProps) => (
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
      d="M8.00005 7.82998C9.47189 7.82998 10.665 6.63682 10.665 5.16499C10.665 3.69316 9.47189 2.5 8.00005 2.5C6.52822 2.5 5.33506 3.69316 5.33506 5.16499C5.33506 6.63682 6.52822 7.82998 8.00005 7.82998ZM8.00005 8.46959C7.57361 8.46959 4.37567 8.46961 3.73608 10.8681C3.46957 11.9341 5.17517 13.0001 8.00005 13.0001C10.8249 13.0001 12.5305 11.9341 12.264 10.8681C11.6245 8.46961 8.4265 8.46959 8.00005 8.46959Z"
      fill={fill}
    />
  </svg>
);

export default IconAbout;
