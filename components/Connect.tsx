import { useRouter } from "next/router";
import { useContext } from "react";
import styled from "styled-components";
import IconGoTo from "../components/Icons/IconGoTo";
import { OverlayContext, OverlayType } from "./Overlay";
import Subscribe from "./Subscribe";

export default function Conenct() {
  const { showOverlay } = useContext(OverlayContext);

  return (
    <div>
      <Row>
        <Label>email</Label>
        <ContactLink href="mailto:lachygroom@gmail.com">
          lachygroom@gmail.com
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
        <Subscribe />
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
