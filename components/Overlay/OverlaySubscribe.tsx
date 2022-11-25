import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import Button from "../Button";
import Input from "../Forms/Input";
import OverlaySuccess from "./OverlaySuccess";

enum FormSteps {
  "Initial" = "Initial",
  "Success" = "Success",
  "Error" = "Error",
}

const options = ["Daily", "Weekly", "Monthly"];
const frequency = ["day", "week", "month"];
export default function OverlaySubscribe() {
  const [value, setValue] = useState("");
  const [selectedOption, setSelectedOpen] = useState(options[1]);
  const [formStep, setFormStep] = useState(FormSteps.Initial);
  const [loading, setLoading] = useState(false);
  const media = useMediaQuery();

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setLoading(true);
      try {
        const response = await fetch("/api/subscribe", {
          method: "post",
          body: JSON.stringify({
            email: value,
            frequency: selectedOption?.toLowerCase(),
          }),
        });
        const res = await response.json();
        if (res.message !== "Subscribed") {
          throw "Invalid input";
        }
        setLoading(false);
        setFormStep(FormSteps.Success);
      } catch (error) {
        setLoading(false);
        setFormStep(FormSteps.Error);
        setValue("");
      }
    },
    [value]
  );

  if (formStep === FormSteps.Success) {
    return (
      <SuccessContainer>
        <OverlaySuccess
          heading="You have been subscribed"
          subheading={`I’ll send news about AI and Machine Learning to your email once a ${
            frequency[options.indexOf(selectedOption)]
          }`}
        />
      </SuccessContainer>
    );
  }

  return (
    <Contiainer>
      <Heading>Newsletter</Heading>
      <Subheading>
        Subscribe to receive updates about AI, Machine Learning and more.
      </Subheading>
      <Form onSubmit={handleSubmit}>
        <InputContainer>
          <Input
            type="email"
            name="subscribe"
            label="Email address"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            error={formStep === FormSteps.Error ? "Invalid email" : ""}
            autoFocus={!media.tablet}
          />
        </InputContainer>
        <Options>
          {options.map((option) => {
            const checked = selectedOption === option;

            return (
              <Option key={option} checked={checked}>
                <Radio
                  type="radio"
                  value={option}
                  checked={selectedOption === option}
                  onChange={(event) => setSelectedOpen(event.target.value)}
                />
                <span>{option} updates</span>{" "}
                {checked ? <IconSelected /> : <IconUnselected />}
              </Option>
            );
          })}
        </Options>

        <div>
          <Button text="Subscribe" onClick={handleSubmit} disabled={loading} />
        </div>
      </Form>
    </Contiainer>
  );
}

const SuccessContainer = styled.div`
  min-height: calc(480px - 48px);
  display: grid;
  place-items: center;
  padding-bottom: 48px;
`;

const Options = styled.div`
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 7px;
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
`;

const Option = styled.label<{ checked?: boolean }>`
  padding: 12px 0;
  font-family: ${(p) => p.theme.fontFamily.nouvelle};
  font-size: 16px;
  line-height: 120%;
  color: ${(p) =>
    p.checked ? p.theme.colors.white : p.theme.colors.light_grey};
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: color 0.25s ease;
  cursor: pointer;

  &:not(:last-of-type) {
    border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  }

  &:hover {
    color: ${(p) =>
      p.checked ? p.theme.colors.white : p.theme.colors.off_white};
  }
`;

const Radio = styled.input`
  appearance: none;
  display: none;
`;

const Contiainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  padding-top: 64px;
`;

const Heading = styled.h2`
  font-family: ${(p) => p.theme.fontFamily.nouvelle};
  font-weight: 500;
  font-size: 18px;
  line-height: 120%;
  color: ${(p) => p.theme.colors.white};
  margin-bottom: 8px;
`;

const Subheading = styled.p`
  font-family: ${(p) => p.theme.fontFamily.nouvelle};
  font-size: 16px;
  line-height: 120%;
  color: ${(p) => p.theme.colors.light_grey};
  margin-bottom: 20px;
  max-width: 308px;
`;

const Form = styled.form`
  position: relative;
`;

const InputContainer = styled.div`
  margin-bottom: 8px;
`;

const IconUnselected = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="5.6"
      y="5.6"
      width="12.8"
      height="12.8"
      rx="6.4"
      stroke="white"
      strokeWidth="1.2"
    />
  </svg>
);

const IconSelected = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <mask id="path-1-inside-1_1067_3414" fill="white">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5ZM15.9596 9.95959C16.2135 9.70575 16.2135 9.2942 15.9596 9.04036C15.7058 8.78652 15.2942 8.78652 15.0404 9.04036L10.5 13.5807L8.95963 12.0404C8.70578 11.7865 8.29423 11.7865 8.04039 12.0404C7.78655 12.2942 7.78655 12.7058 8.04039 12.9596L10.0404 14.9596C10.2942 15.2134 10.7058 15.2134 10.9596 14.9596L15.9596 9.95959Z"
      />
    </mask>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5ZM15.9596 9.95959C16.2135 9.70575 16.2135 9.2942 15.9596 9.04036C15.7058 8.78652 15.2942 8.78652 15.0404 9.04036L10.5 13.5807L8.95963 12.0404C8.70578 11.7865 8.29423 11.7865 8.04039 12.0404C7.78655 12.2942 7.78655 12.7058 8.04039 12.9596L10.0404 14.9596C10.2942 15.2134 10.7058 15.2134 10.9596 14.9596L15.9596 9.95959Z"
      fill="white"
    />
    <path
      d="M15.9596 9.04036L16.8082 8.19183L16.8082 8.19183L15.9596 9.04036ZM15.0404 9.04036L14.1919 8.19183L14.1919 8.19183L15.0404 9.04036ZM10.5 13.5807L9.65148 14.4293L10.5 15.2778L11.3485 14.4293L10.5 13.5807ZM8.95963 12.0404L8.1111 12.8889L8.1111 12.8889L8.95963 12.0404ZM8.04039 12.9596L8.88891 12.1111H8.88891L8.04039 12.9596ZM10.0404 14.9596L10.8889 14.1111L10.8889 14.1111L10.0404 14.9596ZM10.9596 14.9596L10.1111 14.1111L10.1111 14.1111L10.9596 14.9596ZM6.2 12C6.2 8.79675 8.79675 6.2 12 6.2V3.8C7.47127 3.8 3.8 7.47127 3.8 12H6.2ZM12 17.8C8.79675 17.8 6.2 15.2033 6.2 12H3.8C3.8 16.5287 7.47127 20.2 12 20.2V17.8ZM17.8 12C17.8 15.2033 15.2033 17.8 12 17.8V20.2C16.5287 20.2 20.2 16.5287 20.2 12H17.8ZM12 6.2C15.2033 6.2 17.8 8.79675 17.8 12H20.2C20.2 7.47127 16.5287 3.8 12 3.8V6.2ZM15.1111 9.88888C14.8963 9.6741 14.8963 9.32586 15.1111 9.11107L16.8082 10.8081C17.5306 10.0857 17.5306 8.9143 16.8082 8.19183L15.1111 9.88888ZM15.8889 9.88889C15.6741 10.1037 15.3259 10.1037 15.1111 9.88889L16.8082 8.19183C16.0857 7.46936 14.9143 7.46936 14.1919 8.19183L15.8889 9.88889ZM11.3485 14.4293L15.8889 9.88888L14.1919 8.19183L9.65148 12.7322L11.3485 14.4293ZM8.1111 12.8889L9.65148 14.4293L11.3485 12.7322L9.80815 11.1918L8.1111 12.8889ZM8.88892 12.8889C8.67413 13.1037 8.32589 13.1037 8.1111 12.8889L9.80815 11.1918C9.08568 10.4694 7.91433 10.4694 7.19186 11.1918L8.88892 12.8889ZM8.88891 12.1111C9.1037 12.3259 9.1037 12.6741 8.88892 12.8889L7.19186 11.1918C6.46939 11.9143 6.46939 13.0857 7.19186 13.8081L8.88891 12.1111ZM10.8889 14.1111L8.88891 12.1111L7.19186 13.8081L9.19186 15.8081L10.8889 14.1111ZM10.1111 14.1111C10.3259 13.8963 10.6741 13.8963 10.8889 14.1111L9.19186 15.8081C9.91433 16.5306 11.0857 16.5306 11.8082 15.8081L10.1111 14.1111ZM15.1111 9.11107L10.1111 14.1111L11.8082 15.8081L16.8082 10.8081L15.1111 9.11107Z"
      fill="white"
      mask="url(#path-1-inside-1_1067_3414)"
    />
  </svg>
);
