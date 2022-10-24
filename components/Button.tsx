import React from "react";
import styled from "styled-components";

interface ButtonProps {
  text: string;
  type?: "button" | "submit" | "reset";
  onClick?: (event: React.MouseEvent) => any;
  disabled?: boolean;
}

export default function Button({
  onClick,
  type = "submit",
  text,
  disabled,
}: ButtonProps) {
  return (
    <StyledButton
      onClick={onClick && !disabled ? onClick : () => {}}
      type={type}
      disabled={disabled}
    >
      {text}
    </StyledButton>
  );
}

const StyledButton = styled.button`
  background: ${(p) => p.theme.colors.white};
  border-radius: 7px;
  font-family: ${(p) => p.theme.fontFamily.nouvelle};
  font-weight: 500;
  font-size: 18px;
  line-height: 125%;
  text-align: center;
  color: ${(p) => p.theme.colors.black};
  text-shadow: 0px 0px 10px rgba(71, 159, 250, 0.25);
  padding: 15px 16px;
  width: 100%;
  transition: box-shadow 0.25s ease, background 0.25s ease;

  &:focus {
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.8),
      0 0 0 3px rgba(255, 255, 255, 0.24);
  }

  &:disabled {
    cursor: default;
    background: ${(p) => p.theme.colors.off_white};
  }
`;
