import Fuse from "fuse.js/dist/fuse.basic";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import OutsideClickHandler from "react-outside-click-handler";
import { animated, useSpring, useTransition } from "react-spring";
import styled from "styled-components";
import { inputIsFocused } from "../../helpers/input";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { mq } from "../../styles/mediaqueries";
import IconEx from "../Icons/IconEx";

interface SelectProps {
  options: string[];
}
export default function Select({ options: initialOptions }: SelectProps) {
  const router = useRouter();
  const tag = router.query.tag as string;
  const media = useMediaQuery();
  const [selected, setSelected] = useState(tag);
  const [options, setOptions] = useState(initialOptions);
  const [highlighted, setHighlighted] = useState(0);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const filteredOptions = useMemo(() => {
    return options?.filter((option) => selected !== option);
  }, [selected, options]);

  ////////////////////////////////////////////////////////////////
  // Event handlers and utility methods
  ////////////////////////////////////////////////////////////////

  const reset = useCallback(() => {
    setOpen(false);
    setHighlighted(0);
    setValue("");
  }, [setHighlighted, setOpen, setValue]);

  const handleSelect = useCallback(
    (value) => {
      if (value) {
        router.replace(`/tags/${value}`);
      } else {
        router.replace(`/`);
      }

      setSelected(value);
      reset();
    },
    [reset]
  );

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setHighlighted(0);
      setValue(value);
    },
    []
  );

  useEffect(() => {
    setHighlighted(0);
    setValue(value);

    if (value) {
      const fuse = new Fuse(options, {
        threshold: 0.25,
        location: 0,
        distance: 16,
      });
      const results = value
        ? fuse.search(value).map((result) => result?.item)
        : initialOptions;

      setOptions(results);
    } else {
      setOptions(initialOptions);
    }
  }, [value, initialOptions]);

  ////////////////////////////////////////////////////////////////
  // Keyboard events
  ////////////////////////////////////////////////////////////////

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowUp":
          setHighlighted((prev) => (prev === 0 ? prev : prev - 1));
          break;
        case "ArrowDown":
          setHighlighted((prev) =>
            prev === options.length - 1 ? prev : prev + 1
          );
          break;
        case "Enter":
          handleSelect(options[highlighted]);
          break;
        case "Escape":
          reset();
          break;
      }
    };

    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [open, options, highlighted, handleSelect]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (inputIsFocused()) {
        return;
      }

      if (event.code === "KeyF") {
        setOpen(true);
        event.stopPropagation();
        event.preventDefault();
      }

      if (event.key === "Backspace") {
        if (selected) {
          handleSelect(null);
        }
      }
    };

    if (!open) {
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [open, options, highlighted, handleSelect]);

  ////////////////////////////////////////////////////////////////
  // Dropdown animation styles
  ////////////////////////////////////////////////////////////////

  const INPUT_HEIGHT = 31;
  const OPTION_HEIGHT = 28;
  const [dropdownStyles] = useSpring(
    {
      height:
        filteredOptions?.length === 0
          ? INPUT_HEIGHT + 10
          : filteredOptions?.length * OPTION_HEIGHT + INPUT_HEIGHT + 13,
      config: { tension: 2650, friction: 100 },
    },
    [filteredOptions]
  );

  const dropdownTransitions = useTransition(open, {
    from: { transform: "translate(0px, -3px) scale(0.985)", opacity: 0 },
    enter: { transform: "translate(0px, 0px) scale(1)", opacity: 1 },
    leave: { transform: "translate(0px, -4px) scale(0.98)", opacity: 0 },
    config: { tension: 1000, friction: 40 },
  });

  return (
    <OutsideClickHandler onOutsideClick={reset}>
      <Container>
        {tag && (
          <Tag onClick={() => handleSelect(null)} key={tag}>
            <span>{tag}</span> <IconEx />
          </Tag>
        )}
        <Button onClick={() => setOpen((prev) => !prev)}>Filter</Button>
        {dropdownTransitions(
          (style, item) =>
            item && (
              <Dropdown style={{ ...dropdownStyles, ...style }}>
                <InuputContainer>
                  <StyledInput
                    value={value}
                    onChange={handleChange}
                    placeholder="Filter by tags"
                    autoFocus={!media.tablet}
                  />
                  <IconShortcut />
                </InuputContainer>
                {filteredOptions.map((option, index) => {
                  return (
                    <Option
                      key={option}
                      highlight={index === highlighted}
                      onMouseOver={() => setHighlighted(index)}
                      onMouseDown={() => handleSelect(filteredOptions[index])}
                    >
                      {option}
                    </Option>
                  );
                })}
              </Dropdown>
            )
        )}
      </Container>
    </OutsideClickHandler>
  );
}

const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Button = styled.button`
  margin-left: 7px;
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

  ${mq.desktopSmall} {
    &:hover {
      background: transparent;
    }
  }
`;

const Dropdown = styled(animated.div)`
  position: absolute;
  background: rgba(133, 133, 133, 0.16);
  border: 1px solid rgba(133, 133, 133, 0.21);
  box-shadow: 0px 4px 35px rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(55px);
  border-radius: 7px;
  right: -15px;
  top: 38px;
  padding: 4px;
  width: 200px;
  transform-origin: top right;

  ${mq.tablet} {
    right: 0;
  }
`;

const Option = styled.div<{ highlight: boolean }>`
  padding: 7px 12px 5px;
  border-radius: 5px;
  font-family: ${(p) => p.theme.fontFamily.nouvelle};
  font-size: 14px;
  background: ${(p) =>
    p.highlight ? "rgba(255, 255, 255, 0.08)" : "transparent"};
  color: ${(p) =>
    p.highlight ? p.theme.colors.white : p.theme.colors.light_grey};
`;

const InuputContainer = styled.div`
  display: flex;
  align-items: center;
  padding-right: 12px;
  margin-bottom: 3px;

  svg {
    min-width: 16px;
    min-height: 16px;
  }
`;

const StyledInput = styled.input`
  font-family: ${(p) => p.theme.fontFamily.nouvelle};
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  color: #fff;
  padding: 7px 3px 7px 12px;

  &::placeholder {
    color: rgba(255, 255, 255, 0.12);
  }
`;

const IconShortcut = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_145_610)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.32698 1.63803C0 2.27976 0 3.11984 0 4.8V11.2C0 12.8802 0 13.7202 0.32698 14.362C0.614601 14.9265 1.07354 15.3854 1.63803 15.673C2.27976 16 3.11984 16 4.8 16H11.2C12.8802 16 13.7202 16 14.362 15.673C14.9265 15.3854 15.3854 14.9265 15.673 14.362C16 13.7202 16 12.8802 16 11.2V4.8C16 3.11984 16 2.27976 15.673 1.63803C15.3854 1.07354 14.9265 0.614601 14.362 0.32698C13.7202 0 12.8802 0 11.2 0H4.8C3.11984 0 2.27976 0 1.63803 0.32698C1.07354 0.614601 0.614601 1.07354 0.32698 1.63803ZM6.606 8.66195V12.4H5.5V3.80396H10.75V4.78396H6.606V7.68195H10.498V8.66195H6.606Z"
        fill="white"
      />
    </g>
    <defs>
      <clipPath id="clip0_145_610">
        <rect width="16" height="16" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const Tag = styled.button`
  background: rgba(133, 133, 133, 0.16);
  border: 1px solid rgba(133, 133, 133, 0.2);
  border-radius: 3px;
  font-family: ${(p) => p.theme.fontFamily.nouvelle};
  font-size: 9px;
  line-height: 120%;
  text-align: center;
  color: ${(p) => p.theme.colors.light_grey};
  display: inline-flex;
  align-items: center;
  padding: 2px 2px 1px 0px;

  &:not(:first-of-type) {
    margin-left: 8px;
  }

  span {
    margin: 0 8px;
  }

  transition: background 0.2s ease, border-color 0.2s ease;
  &:hover {
    background: rgba(133, 133, 133, 0.24);
    border-color: rgba(133, 133, 133, 0.32);
  }
`;
