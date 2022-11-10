import { theme } from "../../styles/theme";
import { IconProps } from "./types";

const IconOptions = ({
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
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M3 8.25C3 7.55964 3.55964 7 4.25 7C4.94036 7 5.5 7.55964 5.5 8.25C5.5 8.94036 4.94036 9.5 4.25 9.5C3.55964 9.5 3 8.94036 3 8.25ZM6.75 8.25C6.75 7.55964 7.30964 7 8 7C8.69036 7 9.25 7.55964 9.25 8.25C9.25 8.94036 8.69036 9.5 8 9.5C7.30964 9.5 6.75 8.94036 6.75 8.25ZM11.75 7C11.0596 7 10.5 7.55964 10.5 8.25C10.5 8.94036 11.0596 9.5 11.75 9.5C12.4404 9.5 13 8.94036 13 8.25C13 7.55964 12.4404 7 11.75 7Z"
      fill={fill}
    />
  </svg>
);

export default IconOptions;
