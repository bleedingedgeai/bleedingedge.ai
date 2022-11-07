import React, { useContext, useEffect, useRef, useState } from "react";
import { animated, useSpring, useTransition } from "react-spring";
import styled from "styled-components";
import Portal from "../Portal";
import { Alert, AlertsContext } from "./AlertsProvider";

function Alerts() {
  const { alerts, hideAlert } = useContext(AlertsContext);

  if (alerts.length === 0) {
    return null;
  }

  return (
    <Portal>
      <AlertsContainer>
        {alerts.map((alert) => (
          <AlertsElements key={alert.id} alert={alert} hideAlert={hideAlert} />
        ))}
      </AlertsContainer>
    </Portal>
  );
}

export default Alerts;

const AlertsContainer = styled.div`
  position: fixed;
  top: 26px;
  right: 0;
  left: 0;
  display: grid;
  place-items: center;
  max-height: 100%;
  z-index: 2147483647;
`;

/**
 * <AlertsElements />
 *
 * Handles the rendering of each Alert and makes sure the animation and duration
 * are properly rendering.
 */

const NOOP = () => {};

const TimerType = {
  clear: NOOP,
  pause: NOOP,
  resume: NOOP,
};

function AlertsElements({
  alert,
  hideAlert,
}: {
  alert: Alert;
  hideAlert: (id) => void;
}) {
  const autoDismissTimeout = alert.duration || 3500;
  const autoDismiss =
    typeof alert.autoDismiss === "undefined" ? true : alert.autoDismiss;
  const [show, toggleAnimation] = useState(true);
  const [width, setWidth] = useState(256);
  const alertRef = useRef<HTMLDivElement>(null);

  const transitions = useTransition(show, {
    from: { opacity: 0, transform: "translateY(0px) scale(0.92)", height: 18 },
    enter: { opacity: 1, transform: "translateY(3px) scale(1)", height: 44 },
    leave: { opacity: 0, transform: "translateY(0) scale(0.94)", height: 44 },
    config: { tension: 280, friction: 30 },
    onRest: () => {
      if (!show) {
        hideAlert(alert.id);
      }
    },
  });

  useEffect(() => {
    let timeout: typeof TimerType;

    function startTimer() {
      if (!autoDismiss) {
        return;
      }

      toggleAnimation(true);
      timeout = new Timer(() => {
        toggleAnimation(false);
      }, autoDismissTimeout);
    }

    function clearTimer() {
      toggleAnimation(true);
      if (!autoDismiss) {
        return;
      }
      if (timeout) {
        timeout.clear();
      }
    }

    if (autoDismiss) {
      startTimer();
      return () => clearTimer();
    }
  }, [alert, autoDismiss, autoDismissTimeout]);

  const Icon = alert.content.icon;

  const Text =
    typeof alert.content.text === "string"
      ? // Without ts-ingore it throws a fit we don't typecheck, but we do with typeof above!
        // @ts-ignore
        () => <span dangerouslySetInnerHTML={{ __html: alert.content.text }} />
      : () => <span>{alert.content.text}</span>;

  useEffect(() => {
    if (!alert.dynamicWidth && !alertRef.current) {
      return;
    }

    setWidth(alertRef.current.getBoundingClientRect().width);
  }, [alertRef, alert]);

  const dynamicWidthStyles = useSpring({
    width: alert.dynamicWidth ? width || 256 : width,
    config: { tension: 1200, friction: 80 },
  });

  return (
    <>
      {transitions(
        (style, item) =>
          item && (
            <animated.div style={style as any}>
              <AlertElement
                as={alert.dynamicWidth ? animated.span : "span"}
                onClick={() => toggleAnimation(false)}
                style={
                  {
                    ...(alert.dynamicWidth ? dynamicWidthStyles : {}),
                  } as any
                }
              >
                {Icon && <Icon size={18} />}
                {Text && <Text />}
              </AlertElement>
            </animated.div>
          )
      )}
      {alert.dynamicWidth && (
        <AlertElementHidden ref={alertRef}>
          {Icon && <Icon />}
          {Text && <Text />}
        </AlertElementHidden>
      )}
    </>
  );
}

// Moved this below the component as it's small util
function Timer(cb: () => void, delay: number) {
  let timerId: any;

  this.clear = function () {
    clearTimeout(timerId);
  };

  this.resume = function () {
    clearTimeout(timerId);
    timerId = setTimeout(cb, delay);
  };

  this.resume();
}

const AlertElement = styled.span`
  background: rgb(42, 44, 49);
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: 0px 6px 24px rgba(0, 0, 0, 0.24);
  border-radius: 7px;
  height: 38px;
  display: flex;
  align-items: center;
  color: #fff;
  line-height: 1;
  white-space: nowrap;
  overflow: hidden;
  padding: 0 19px 0px 12px;
  background: rgba(133, 133, 133, 0.21);
  box-shadow: 0px 4px 35px rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(13px);
  font-size: 16px;
  font-family: ${(p) => p.theme.fontFamily.nouvelle};

  svg {
    position: relative;
    top: 3px;
  }

  & > svg {
    top: 1px;
    margin-right: 19px;
  }
`;

const AlertElementHidden = styled.span`
  position: absolute;
  pointer-events: none;
  border-radius: 43px;
  padding: 0 19px 0px 12px;
  height: 38px;
  display: flex;
  align-items: center;
  color: #fff;
  line-height: 1;
  white-space: nowrap;
  overflow: hidden;
  opacity: 0;
  font-size: 16px;
  font-family: ${(p) => p.theme.fontFamily.nouvelle};

  span {
    padding-top: 1px;
  }

  svg {
    position: relative;
    top: 1px;
    margin-right: 19px;
  }
`;
