export interface IconProps {
  fill?: string
  size?: number
  style?: any
}

export type Icon = ({ fill, size, ...rest }: IconProps) => JSX.Element
