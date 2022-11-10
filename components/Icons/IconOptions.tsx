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
    <rect x="3" y="7" width="2.5" height="2.5" fill={fill} />
    <rect x="6.75" y="7" width="2.5" height="2.5" fill={fill} />
    <rect x="10.5" y="7" width="2.5" height="2.5" fill={fill} />
  </svg>
);

export default IconOptions;
