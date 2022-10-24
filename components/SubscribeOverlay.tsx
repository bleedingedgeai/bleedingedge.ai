import { useCallback, useState } from "react";
import styled from "styled-components";
import Button from "./Button";
import Input from "./Forms/Input";
import OverlaySuccess from "./OverlaySuccess";

enum FormSteps {
  "Initial" = "Initial",
  "Success" = "Success",
  "Error" = "Error",
}

export default function SubscribeOverlay() {
  const [value, setValue] = useState("");
  const [formStep, setFormStep] = useState(FormSteps.Initial);
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setLoading(true);
      try {
        const response = await fetch("/api/subscribe", {
          method: "post",
          body: JSON.stringify({ email: value }),
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
      <OverlaySuccess
        heading="You have been subscribed"
        subheading={`I’ll send news about AI and Machine learning to ${value}`}
      />
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
            value={value}
            onChange={(event) => setValue(event.target.value)}
            label="Email address"
            name="email"
            error={formStep === FormSteps.Error ? "Invalid email" : ""}
          />
        </InputContainer>
        <div>
          <Button text="Subscribe" onClick={handleSubmit} disabled={loading} />
        </div>
      </Form>
    </Contiainer>
  );
}
const Contiainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`;

const Heading = styled.h2`
  font-family: ${(p) => p.theme.fontFamily.nouvelle};
  font-weight: 500;
  font-size: 22px;
  line-height: 120%;
  color: ${(p) => p.theme.colors.white};
  margin-bottom: 8px;
`;

const Subheading = styled.p`
  font-family: ${(p) => p.theme.fontFamily.nouvelle};
  font-size: 16px;
  line-height: 120%;
  color: ${(p) => p.theme.colors.off_white};
  margin-bottom: 24px;
`;

const Form = styled.form`
  position: relative;
`;

const InputContainer = styled.div`
  margin-bottom: 24px;
`;
