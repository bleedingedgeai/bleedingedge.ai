import React, { useCallback, useContext, useEffect, useRef } from "react";
import styled from "styled-components";
import { OverlayContext } from "./Overlay";

export default function OverlayConfirmation({ heading, text, left, right }) {
  const { hideOverlay } = useContext(OverlayContext);

  const buttonLeftRef = useRef<HTMLButtonElement>(null);
  const buttonRightRef = useRef<HTMLButtonElement>(null);

  ///////////////////////////////////////////////////////////////////////////
  // Wrapping the Confirm and Cancel actions in hideModal and using these
  ///////////////////////////////////////////////////////////////////////////

  const leftButtonAction = useCallback(() => {
    hideOverlay();

    if (left?.action) {
      left.action();
    }
  }, [left, hideOverlay]);

  const rightButtonAction = useCallback(() => {
    hideOverlay();

    if (right?.action) {
      right.action();
    }
  }, [right, hideOverlay]);

  ///////////////////////////////////////////////////////////////////////////
  // Handling Keyboard events (Escsape, Enter, ArrowKeys)
  ///////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    setTimeout(() => {
      buttonRightRef.current.focus();
    }, 0);
  }, [buttonRightRef]);

  const handleFocus = useCallback(
    (buttonElement: HTMLButtonElement) => {
      buttonLeftRef.current.classList.remove("focus");
      buttonRightRef.current.classList.remove("focus");
      buttonElement.classList.add("focus");
      buttonElement.focus();
    },
    [buttonLeftRef, buttonRightRef]
  );

  ///////////////////////////////////////////////////////////////////////////
  // Handling Mouse events
  ///////////////////////////////////////////////////////////////////////////

  function handleMouseOver(buttonRef: React.RefObject<HTMLButtonElement>) {
    handleFocus(buttonRef.current);
  }

  return (
    <Frame>
      <Heading dangerouslySetInnerHTML={{ __html: heading }} />
      <Subheading dangerouslySetInnerHTML={{ __html: text }} />
      <ButtonContainer>
        <ButtonAction
          ref={buttonRightRef}
          onClick={rightButtonAction}
          onMouseOver={() => handleMouseOver(buttonRightRef)}
          className="focus"
          dangerouslySetInnerHTML={{ __html: right.text }}
        />
        <Button
          ref={buttonLeftRef}
          onClick={leftButtonAction}
          onMouseOver={() => handleMouseOver(buttonLeftRef)}
          dangerouslySetInnerHTML={{
            __html: left?.text ? left.text : "Cancel",
          }}
        />
      </ButtonContainer>
    </Frame>
  );
}

const Frame = styled.div`
  position: relative;
  padding-top: 44px;
`;

const Heading = styled.h3`
  margin-bottom: 16px;
  font-family: ${(p) => p.theme.fontFamily.nouvelle};
  font-weight: 500;
  font-size: 18px;
  line-height: 120%;
  margin-bottom: 8px;
`;

const Subheading = styled.p`
  max-width: 342px;
  font-family: ${(p) => p.theme.fontFamily.nouvelle};
  font-size: 16px;
  line-height: 120%;
  color: ${(p) => p.theme.colors.light_grey};
  margin-bottom: 32px;
`;

const ButtonContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 16px;
  grid-auto-flow: dense;

  button:first-of-type {
    grid-column: 2;
  }
`;

const Button = styled.button`
  height: 46px;
  font-size: 18px;
  flex: 1;
  display: grid;
  place-items: center;
  border-radius: 5px;
  font-family: ${(p) => p.theme.fontFamily.nouvelle};
  background: transparent;
  border: 1px solid ${(p) => p.theme.colors.light_grey};
  transition: box-shadow 0.15s ease;
  line-height: 1;
  text-shadow: 0px 0px 10px rgba(71, 159, 250, 0.25);
`;

const ButtonAction = styled(Button)`
  background: ${(p) => p.theme.colors.magenta};
  font-weight: 500;
  border: none;
`;
