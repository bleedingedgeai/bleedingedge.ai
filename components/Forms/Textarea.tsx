import styled from "styled-components";
import { mq } from "../../styles/mediaqueries";

interface TextareaProps {
  value: string;
  onChange: any;
  placeholder?: string;
}

export default function Textarea({
  value,
  onChange,
  placeholder,
}: TextareaProps) {
  return (
    <StyledTextarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
}

const StyledTextarea = styled.textarea`
  width: 100%;
  resize: none;
  background: ${(p) => p.theme.colors.black};
  border: none;
  border-radius: 7px;
  padding: 16px;
  font-size: 16px;
  height: 128px;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.16);
  transition: box-shadow 0.25s ease, background 0.25s ease;
  font-family: ${(p) => p.theme.fontFamily.nouvelle};

  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }

  &:not([disabled], :focus):hover {
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.16);
  }

  &:focus {
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.16),
      0 0 0 2px rgba(255, 255, 255, 0.24);
  }

  ${mq.tablet} {
    font-size: 16px;
  }
`;
