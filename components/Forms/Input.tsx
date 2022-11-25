import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { ellipsis } from "../../styles/css";

interface InputProps {
  name: string;
  label: string;
  value: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  type?: string;
  onChange?: any;
  autoFocus?: boolean;
}

export default function Input({
  onChange,
  value,
  name,
  label,
  placeholder,
  disabled,
  autoFocus,
  type,
  error,
}: InputProps) {
  const [focus, setFocus] = useState(false);
  const inputRef = useRef(null);
  const labelIsAnimated =
    focus || (value?.length > 0 && typeof value !== "undefined");

  useEffect(() => {
    if (autoFocus) {
      queueMicrotask(() => inputRef.current.focus());
    }
  }, [autoFocus, inputRef]);

  return (
    <Container>
      <input
        tabIndex={-1}
        type={type || "text"}
        name={name}
        style={{ opacity: 0, height: 0, width: 0, position: "absolute" }}
        aria-hidden="true"
      />
      <StyledInput
        ref={inputRef}
        id={name}
        type={type || "text"}
        autoComplete="off"
        onChange={onChange}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        autoFocus={autoFocus}
      />
      <LabelAnimation labelIsAnimated={labelIsAnimated}>
        <Label htmlFor={name} error={error}>
          {error ? error : label}
        </Label>
      </LabelAnimation>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
`;

const Label = styled.label<{ error: string }>`
  display: block;
  font-size: 16px;
  border: none;
  pointer-events: none;
  color: rgba(255, 255, 255, 0.3);
  position: relative;
  top: -2px;
  white-space: nowrap;
  transition: color 0.3s ease;

  ${(p) =>
    p.error &&
    `
    color: ${p.theme.colors.magenta} !important;
    opacity: 1 !important;

  `}
`;

const LabelAnimation = styled.span<{ labelIsAnimated: boolean }>`
  display: block;
  position: absolute;
  bottom: 0;
  top: 0;
  pointer-events: none;
  font-weight: 400;
  padding: 17px 16px 16px;
  will-change: transform, font-weight;
  transform: perspective(100px);
  transform-origin: 0 0;
  transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1),
    font-weight 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  font-family: ${(p) => p.theme.fontFamily.nouvelle};

  ${(p) =>
    p.labelIsAnimated &&
    `
    label { color: ${p.theme.colors.light_grey}; opacity: 1; }
    font-weight: 600;
    transform: translate(6px, -1px) scale(0.6) perspective(100px) translateZ(0.001px);
  `};
`;

const StyledInput = styled.input`
  appearance: none;
  height: 48px;
  width: 100%;
  font-size: 16px;
  font-family: ${(p) => p.theme.fontFamily.nouvelle};
  padding: 24px 16px 14px;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.16);
  border-radius: 7px;
  border: none;
  background: ${(p) => p.theme.colors.black};
  transition: box-shadow 0.25s ease, background 0.25s ease;
  width: 100%;
  margin: 0px;
  white-space: nowrap;
  color: #fff;
  ${ellipsis}

  &:disabled {
    color: ${(p) => p.theme.colors.light_grey};
    cursor: default;
  }

  &:not([disabled], :focus):hover {
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.16);
  }

  &:focus {
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.16),
      0 0 0 2px rgba(255, 255, 255, 0.24);
  }

  &::-webkit-input-placeholder {
    user-select: none;
    color: transparent;
    transition: color 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  }

  &:focus::-webkit-input-placeholder,
  &:not(:empty)::-webkit-input-placeholder {
    color: rgba(255, 255, 255, 0.2);
  }

  &::-webkit-textfield-decoration-container {
    visibility: hidden;
  }
`;
