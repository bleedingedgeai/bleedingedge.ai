import React from "react";
import { IconProps } from "./types";

const IconArrow = ({ fill = "#CECECE", size = 24, ...rest }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <path
      d="M12.8227 15.875C12.4571 16.5083 11.5429 16.5083 11.1773 15.875M12.8227 15.875L11.1773 15.875M12.8227 15.875L12.2598 15.55L11.1773 15.875M12.8227 15.875L16.6332 9.275C16.9989 8.64167 16.5418 7.85 15.8105 7.85H8.18949C7.45818 7.85 7.00111 8.64166 7.36676 9.275L11.1773 15.875"
      stroke={fill}
      strokeWidth="1.3"
    />
  </svg>
);

export default IconArrow;
