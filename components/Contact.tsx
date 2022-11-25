import { useContext } from "react";
import styled from "styled-components";
import IconGoTo from "./Icons/IconGoTo";
import { OverlayContext, OverlayType } from "./Overlay/Overlay";

export default function Contact() {
  const { showOverlay } = useContext(OverlayContext);

  return (
    <div>
      <Row>
        <Label>email</Label>
        <ContactLink href="mailto:lachy@bleedingedge.ai">
          lachy@bleedingedge.ai
        </ContactLink>
        <IconGoTo />
      </Row>
      <Row>
        <Label>twitter</Label>
        <ContactLink href="https://twitter.com/bleedingedgeai" target="_blank">
          @bleedingedgeai
        </ContactLink>
        <IconGoTo />
      </Row>
      <Row>
        <Button onClick={() => showOverlay(OverlayType.SUGGESTION)}>
          Suggest an entry
        </Button>
      </Row>
      <Row>
        <Button onClick={() => showOverlay(OverlayType.SUBSCRIBE)}>
          Subscribe
        </Button>
      </Row>
    </div>
  );
}

const Button = styled.button`
  line-height: 200%;
`;

const Label = styled.span`
  margin-right: 9px;
`;

const ContactLink = styled.a`
  color: ${(p) => p.theme.colors.light_grey};
  margin-right: 6px;
`;

const Row = styled.div`
  position: relative;
  z-index: 1;

  &:not(:last-of-type) {
    margin-bottom: 3px;
  }
`;
