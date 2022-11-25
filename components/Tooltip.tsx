import React, {
  Children,
  ReactElement,
  cloneElement,
  useEffect,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import { animated, useTransition } from "@react-spring/web";
import Portal from "./Portal";

type Offset = {
  top?: number;
  left?: number;
};

interface TooltipProps {
  label: any;
  disable?: boolean;
  placement?: "top" | "right" | "bottom" | "left";
  offset?: Offset;
  children: ReactElement;
}

function Tooltip({
  label,
  placement = "bottom",
  offset,
  children,
  disable = false,
}: TooltipProps) {
  const child = Children.only(children);

  const [tooltipID, setTooltipID] = useState("");
  const [tooltipWasOpened, setTooltipWasOpened] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(disable);
  const [position, setPosition] = useState({});
  const [transition, setTransition] = useState({});

  useEffect(() => {
    // Required to set here for Next.js server side rendering
    setTooltipID(new Date().getTime().toString());
  }, []);

  useEffect(() => {
    if (disable) {
      setVisible(false);
    }
  }, [disable]);

  useEffect(() => {
    const target = document.querySelector(`[data-tooltip="${tooltipID}"]`);
    // Timeouts: keep it alive if hovering another element with a tip
    let restTimeout;
    let wasOpenedTimeout;

    function startRestTimer() {
      clearTimeout(restTimeout);

      // If we notice a tooltip was previously opened we don't need the timer
      if (document.querySelector(`[data-tooltip-opened="true"]`)) {
        setVisible(true);
        setTooltipWasOpened(true);
      } else {
        restTimeout = setTimeout(() => {
          setTooltipWasOpened(true);
          setVisible(true);
        }, 400);
      }
    }

    function clearRestTimer() {
      clearTimeout(restTimeout);
      clearTimeout(wasOpenedTimeout);
    }

    function handleLeave() {
      clearRestTimer();
      setVisible(false);

      wasOpenedTimeout = setTimeout(() => {
        setTooltipWasOpened(false);
      }, 600);
    }

    function handleEnter() {
      startRestTimer();
    }

    if (!target) {
      return;
    }

    target.addEventListener("blur", handleLeave);
    target.addEventListener("mouseenter", handleEnter);
    target.addEventListener("mouseleave", handleLeave);
    target.addEventListener("click", handleLeave);

    return () => {
      handleLeave();
      target.removeEventListener("blur", handleLeave);
      target.removeEventListener("mouseenter", handleEnter);
      target.removeEventListener("mouseleave", handleLeave);
      target.removeEventListener("click", handleLeave);
    };
  }, [setVisible, tooltipID]);

  useEffect(() => {
    if (visible) {
      const handleScroll = () => setVisible(false);
      window?.addEventListener("scroll", handleScroll);
      return () => {
        window?.removeEventListener("scroll", handleScroll);
      };
    }
  }, [visible]);

  useEffect(() => {
    if (disable || !tooltipRef.current) {
      return;
    }

    const target = document.querySelector(`[data-tooltip="${tooltipID}"]`);

    function calculateTooltipPosition() {
      const childBox = target.getBoundingClientRect();
      const tooltipBox = tooltipRef?.current.getBoundingClientRect();

      let top = 0;
      let left = 0;

      const offsetDefaults = { left: 0, top: 0 };
      const os = { ...offsetDefaults, ...offset };

      switch (placement) {
        case "top":
          top = childBox.top - tooltipBox.height * 1.08 - 10 + os.top;
          left =
            childBox.left + childBox.width / 2 - tooltipBox.width / 2 + os.left;
          break;
        case "right":
          top =
            childBox.top +
            childBox.height / 2 -
            (tooltipBox.height * 1.08) / 2 +
            os.top;
          left = childBox.right + 10 + os.left;
          break;
        case "bottom":
          top = childBox.top + childBox.height + 10 + os.top;
          left =
            childBox.left + childBox.width / 2 - tooltipBox.width / 2 + os.left;
          break;
        case "left":
          top =
            childBox.top +
            childBox.height / 2 -
            (tooltipBox.height * 1.08) / 2 +
            os.top;
          left = childBox.left - tooltipBox.width - 10 + os.left;
          break;
      }

      setPosition({ top: `${top}px`, left: `${left}px` });
    }

    if (visible) {
      calculateTooltipPosition();
    }
  }, [visible, placement, offset, tooltipID, disable, tooltipRef.current]);

  useEffect(() => {
    let transition;

    switch (placement) {
      case "top":
        transition = {
          from: { opacity: 0, transform: `scale(0.97) translateY(2px)` },
          enter: { opacity: 1, transform: `scale(1) translateY(0px)` },
          leave: { opacity: 0, transform: `scale(0.97) translateY(2px)` },
        };
        break;
      case "right":
        transition = {
          from: { opacity: 0, transform: `scale(0.97) translateX(-3px)` },
          enter: { opacity: 1, transform: `scale(1) translateX(0px)` },
          leave: { opacity: 0, transform: `scale(0.97) translateX(-3px)` },
        };
        break;
      case "bottom":
        transition = {
          from: { opacity: 0, transform: `scale(0.97) translateY(-2px)` },
          enter: { opacity: 1, transform: `scale(1) translateY(0px)` },
          leave: { opacity: 0, transform: `scale(0.97) translateY(-2px)` },
        };
        break;
      case "left":
        transition = {
          from: { opacity: 0, transform: `scale(0.98) translateX(3px)` },
          enter: { opacity: 1, transform: `scale(1) translateX(0px)` },
          leave: { opacity: 0, transform: `scale(0.98) translateX(3px)` },
        };
        break;
    }

    setTransition(transition);
  }, [setTransition, placement]);

  const transitions = useTransition(visible, {
    ...transition,
    config: { tension: 800, friction: 30, ...(disable && { duration: 0 }) },
  });

  return (
    <>
      {cloneElement(child, {
        "data-tooltip": tooltipID,
        ...(tooltipWasOpened ? { "data-tooltip-opened": true } : {}),
      })}
      {transitions((style, item) => {
        if (!item) {
          return null;
        }

        return (
          <Portal>
            <Container ref={tooltipRef} style={{ ...style, ...position }}>
              <Content textOnly={typeof label === "string"}>{label}</Content>
            </Container>
          </Portal>
        );
      })}
    </>
  );
}

export default Tooltip;

const Container = styled(animated.div)`
  position: fixed;
  pointer-events: none;
  transform-origin: center center;
  z-index: 10000;
  pointer-events: none;
`;

const Content = styled.div<{ textOnly?: boolean }>`
  display: flex;
  align-items: center;
  padding: ${(p) => (p.textOnly ? "2px 12px 3px" : "6px 6px 6px 8px")};
  font-family: ${(p) => p.theme.fontFamily.nouvelle};
  font-size: 14px;
  background: #000;
  background: rgba(133, 133, 133, 0.16);
  border: 1px solid rgba(133, 133, 133, 0.21);
  box-shadow: 0px 4px 35px rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(13px);
  border-radius: 7px;

  & > span {
    margin-left: 24px;
  }
`;
