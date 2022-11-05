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
      d="M8 1.72681L11.8 5.52681L10.86 6.47347L8.66667 4.27347V10.6668H7.33333V4.27347L5.13333 6.47347L4.19333 5.52681L8 1.72681ZM13.3295 10.0001C13.6992 10.0001 13.9983 10.3009 13.9962 10.6706L13.9867 12.3401C13.9867 13.2601 13.24 14.0001 12.32 14.0001H3.66667C2.74 14.0001 2 13.2535 2 12.3335V10.6668C2 10.2986 2.29848 10.0001 2.66667 10.0001C3.03486 10.0001 3.33333 10.2986 3.33333 10.6668V12.3335C3.33333 12.5201 3.48 12.6668 3.66667 12.6668H12.32C12.5067 12.6668 12.6533 12.5201 12.6533 12.3335L12.6629 10.663C12.665 10.2963 12.9628 10.0001 13.3295 10.0001Z"
      fill={fill}
    />
  </svg>
);

export default IconShare;
