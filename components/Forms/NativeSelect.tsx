import React, { useCallback } from "react";
import styled from "styled-components";
import { mq } from "../../styles/mediaqueries";
import { theme } from "../../styles/theme";
import IconEx from "../Icons/IconEx";

interface NativeSelectProps {
  handleSelect: (string) => void;
  reset: () => void;
  label: string;
  options: string[];
  selected: string[];
}

export default function NativeSelect({
  options,
  handleSelect,
  label,
  selected,
  reset,
}: NativeSelectProps) {
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      handleSelect(event.target.value);
    },
    [handleSelect]
  );

  const hasSelected = selected.length > 0;

  return (
    <>
      {hasSelected && (
        <Reset onClick={reset}>
          <IconEx size={16} fill={theme.colors.light_grey} />
        </Reset>
      )}
      <Container>
        <Button>{label}</Button>
        <Select onChange={handleChange}>
          <option value="">Select tag</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
        {hasSelected && <Selected>({selected.length})</Selected>}
      </Container>
    </>
  );
}

const Container = styled.div`
  position: relative;
`;

const Button = styled.button`
  margin-left: 5px;
  padding: 4px 7px 5px;
  margin-right: -7px;
  background: rgba(255, 255, 255, 0);
  border-radius: 5px;
  transition: background 0.25s ease;

  span {
    color: ${(p) => p.theme.colors.light_grey};
  }

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }

  ${mq.tabletUp} {
    display: none;
  }
`;

const Reset = styled.button`
  padding: 2px 16px;
  margin-right: 9px;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
`;

const Select = styled.select`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  opacity: 0;
`;

const Selected = styled.span`
  margin-left: 9px;
`;
