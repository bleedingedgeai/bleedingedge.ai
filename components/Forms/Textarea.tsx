import styled from "styled-components";
import { mq } from "../../styles/mediaqueries";

interface TextareaProps {
  value: string;
  onChange: any;
  placeholder?: string;
}

export default function Textarea({ value, onChange }: TextareaProps) {
  return (
    <StyledTextarea
      value={value}
      onChange={onChange}
      placeholder="Type your suggestion"
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
  font-size: 14px;
  height: 128px;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.16);
  transition: box-shadow 0.25s ease, background 0.25s ease;

  &::placeholder {
    color: rgba(255, 255, 255, 0.16);
  }

  &:not([disabled], :focus):hover {
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.16);
  }

  &:focus {
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.32),
      0 0 0 3px rgba(255, 255, 255, 0.24);
  }

  ${mq.tablet} {
    font-size: 16px;
  }
`;
