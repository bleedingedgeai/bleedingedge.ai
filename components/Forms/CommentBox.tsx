import styled from "styled-components";
import { mq } from "../../styles/mediaqueries";

interface TextareaProps {
  value: string;
  onChange: any;
  placeholder: string;
}

export default function CommentBox({
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
  border: none;
  border-radius: 14px;
  padding: 16px 18px;
  font-size: 16px;
  height: 128px;
  box-shadow: 0px 4px 34px rgba(0, 0, 0, 0.55);
  transition: box-shadow 0.25s ease, background 0.25s ease;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0px 4px 34px rgba(0, 0, 0, 0.55);
  background: rgba(22, 22, 22, 0.52);
  backdrop-filter: blur(55px);

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
