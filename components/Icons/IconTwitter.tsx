import React from "react";
import { theme } from "../../styles/theme";
import { IconProps } from "./types";

const IconTwitter = ({
  fill = theme.colors.light_grey,
  size = 16,
  ...rest
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17.7583 7.89793C18.3838 7.52298 18.8641 6.9293 19.0903 6.22192C18.505 6.56905 17.8566 6.82117 17.1666 6.95706C16.614 6.36829 15.8266 6.00037 14.9553 6.00037C13.2822 6.00037 11.9258 7.35674 11.9258 9.02972C11.9258 9.26715 11.9527 9.49837 12.0043 9.72009C9.48653 9.59376 7.25432 8.3877 5.76017 6.55489C5.49941 7.00232 5.35001 7.52271 5.35001 8.07789C5.35001 9.12888 5.88488 10.0561 6.69774 10.5994C6.20112 10.5837 5.73403 10.4474 5.32555 10.2205C5.32533 10.2331 5.32533 10.2458 5.32533 10.2586C5.32533 11.7264 6.36957 12.9508 7.75544 13.2291C7.50121 13.2983 7.23358 13.3353 6.95727 13.3353C6.76207 13.3353 6.57228 13.3163 6.38734 13.281C6.77282 14.4845 7.8916 15.3604 9.21724 15.3848C8.18045 16.1973 6.8742 16.6816 5.4549 16.6816C5.2104 16.6816 4.96924 16.6673 4.73224 16.6393C6.07289 17.4989 7.66529 18.0004 9.37608 18.0004C14.9483 18.0004 17.9953 13.3842 17.9953 9.38101C17.9953 9.24965 17.9924 9.119 17.9866 8.9891C18.5784 8.56199 19.0921 8.02842 19.4982 7.4209C18.9549 7.66184 18.3711 7.82469 17.7583 7.89793Z"
      fill={fill}
    />
  </svg>
);

export default IconTwitter;