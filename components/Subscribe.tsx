import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { inputIsFocused } from "../helpers/input";
import { theme } from "../styles/theme";
import IconCheck from "./Icons/IconCheck";
import IconEx from "./Icons/IconEx";
import IconSubmit from "./Icons/IconSubmit";

enum FormSteps {
  "Initial" = "Initial",
  "Success" = "Success",
  "Error" = "Error",
}

export default function Subscribe() {
  const [value, setValue] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [inputWidth, setInputWidth] = useState(0);
  const [formStep, setFormStep] = useState(FormSteps.Initial);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleResize() {
      setInputWidth(inputRef.current?.getBoundingClientRect().width);
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSubscribeClick = useCallback(() => {
    setFormStep(FormSteps.Initial);
    setShowForm(true);
    queueMicrotask(() => {
      inputRef.current?.focus();
    });
  }, [inputRef]);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      try {
        const response = await fetch("/api/subscribe", {
          method: "post",
          body: JSON.stringify({ email: value }),
        });
        const res = await response.json();
        if (res.message !== "Subscribed") {
          throw "Invalid input";
        }
        setFormStep(FormSteps.Success);
        setValue("");
      } catch (error) {
        setFormStep(FormSteps.Error);
        setValue("");
      }
    },
    [value]
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (inputIsFocused()) {
        if (event.code === "Escape") {
          setShowForm(false);
          setValue("");
          inputRef.current?.blur();
        }
        return;
      }

      if (event.code === "KeyS") {
        event.preventDefault();
        handleSubscribeClick();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleSubscribeClick]);

  return (
    <Contiainer>
      <SubscribeButton onClick={handleSubscribeClick}>
        Subscribe
      </SubscribeButton>
      <Form
        style={
          showForm ? { opacity: 1 } : { pointerEvents: "none", opacity: 0 }
        }
        ref={formRef}
        onSubmit={handleSubmit}
      >
        <Input
          value={value}
          ref={inputRef}
          onChange={(event) => setValue(event.target.value)}
          placeholder="enter your email"
        />
        <HiddenInput
          value={value}
          ref={hiddenInputRef}
          onChange={(event) => setValue(event.target.value)}
          placeholder="enter your email"
        />
        <Mask
          style={{
            width: inputWidth,
            ...(showForm
              ? {
                  transform: `translateX(${inputWidth + 24}px`,
                }
              : {
                  transform: `translateX(0px)`,
                }),
          }}
        />
        <IconContainer
          style={
            showForm
              ? {
                  transform: `translateX(0px)`,
                }
              : {
                  transform: `translateX(-${inputWidth + 6}px)`,
                }
          }
        >
          <IconSubmit />
        </IconContainer>
        {formStep === FormSteps.Error && (
          <Error onClick={handleSubscribeClick}>
            <span>
              Invalid Input <IconEx size={16} fill={theme.colors.magenta} />
            </span>
          </Error>
        )}
        {formStep === FormSteps.Success && (
          <Success onClick={handleSubscribeClick}>
            <span>
              You've been subscribed <IconCheck />
            </span>
          </Success>
        )}
      </Form>
    </Contiainer>
  );
}

const Success = styled.button`
  position: absolute;
  left: 0;
  background: ${(p) => p.theme.colors.black};
  color: ${(p) => p.theme.colors.orange};
  display: flex;
  width: 185px;
`;

const Error = styled.button`
  position: absolute;
  left: 0;
  background: ${(p) => p.theme.colors.black};
  color: ${(p) => p.theme.colors.magenta};
  display: flex;
  width: 185px;
`;

const Contiainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  overflow: hidden;
`;

const SubscribeButton = styled.button`
  position: relative;
  font-weight: 400;
  font-size: 12px;
  line-height: 130%;
  margin-right: 12px;
  z-index: 1;
`;

const Form = styled.form`
  position: relative;
  display: flex;
  align-items: center;
  transition: opacity 0.2s ease, transform 0.2s ease;
`;

const Input = styled.input`
  color: #fff;
  caret-color: ${(p) => p.theme.colors.orange};
  font-size: 12px;
  line-height: 130%;
  width: 204px;
  padding-right: 6px;
`;

const HiddenInput = styled(Input)`
  position: absolute;
  opacity: 0;
  visibility: none;
  pointer-events: none;
`;

const IconContainer = styled.button`
  transition: opacity 0.1s ease, transform 0.67s cubic-bezier(0.45, 0, 0.55, 1);
`;

const Mask = styled.div`
  position: absolute;
  transition: opacity 0.1s ease, transform 0.67s cubic-bezier(0.45, 0, 0.55, 1);
  height: 0;
  left: 0;
  border-radius: 50%;
  box-shadow: 0 0 24px 64px ${(p) => p.theme.colors.black};
  background: ${(p) => p.theme.colors.black};
  box-shadow: 0 0 16px 16px ${(p) => p.theme.colors.black};
`;
