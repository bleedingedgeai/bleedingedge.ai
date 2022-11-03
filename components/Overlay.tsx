import React, { useCallback, useContext, useEffect, useReducer } from "react";
import OutsideClickHandler from "react-outside-click-handler";
import { animated, useTransition } from "react-spring";
import styled from "styled-components";
import { scrollable } from "../helpers/dom";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { mq } from "../styles/mediaqueries";
import { theme } from "../styles/theme";
import AuthenticationOverlay from "./AuthenticationOverlay";
import ConfirmationOverlay from "./ConfirmationOverlay";
import IconEx from "./Icons/IconEx";
import Slidein from "./OverlaySlidein";
import Portal from "./Portal";
import SubscribeOverlay from "./SubscribeOverlay";
import SuggestionOverlay from "./SuggestionOverlay";

export enum OverlayType {
  SUGGESTION = "SUGGESTION",
  SUBSCRIBE = "SUBSCRIBE",
  AUTHENTICATION = "AUTHENTICATION",
  CONFIRMATION = "CONFIRMATION",
}

const OverlayComponentMap = {
  [OverlayType.SUGGESTION]: <SuggestionOverlay />,
  [OverlayType.SUBSCRIBE]: <SubscribeOverlay />,
  [OverlayType.AUTHENTICATION]: <AuthenticationOverlay />,
  [OverlayType.CONFIRMATION]: <ConfirmationOverlay />,
};

enum Action {
  SHOW = "SHOW",
  HIDE = "HIDE",
}

interface OverlayAction {
  action: Action;
  type?: OverlayType;
  props?: any;
}

export type ShowOverlayFn = (type: OverlayType, props?: any) => void;
export type HideOverlayFn = (bypassReset?: boolean) => void;

export interface Context {
  OverlayComponent: React.ReactElement;
  showOverlay: ShowOverlayFn;
  hideOverlay: HideOverlayFn;
  overlayProps: any;
}

const defaultContext: Context = {
  OverlayComponent: null,
  showOverlay: () => {},
  hideOverlay: () => {},
  overlayProps: {},
};

export const OverlayContext = React.createContext<Context>(defaultContext);

const initialState = {
  OverlayComponent: null,
  overlayProps: null,
};

function overlayReducer(
  state: typeof initialState,
  { action, type, props }: OverlayAction
): typeof initialState {
  switch (action) {
    case Action.SHOW:
      return {
        OverlayComponent: OverlayComponentMap[type],
        overlayProps: props,
      };
    case Action.HIDE:
      return initialState;
    default:
      return state;
  }
}

export function OerlayProvider(props: React.PropsWithChildren<{}>) {
  const [{ OverlayComponent, overlayProps }, dispatch] = useReducer(
    overlayReducer,
    initialState
  );

  const showOverlay = useCallback(
    (type, props) => {
      dispatch({ action: Action.SHOW, type, props });
      scrollable(false);
    },
    [dispatch]
  );

  const hideOverlay = useCallback(() => {
    dispatch({ action: Action.HIDE });
    scrollable(true);
  }, [dispatch]);

  return (
    <OverlayContext.Provider
      value={{
        OverlayComponent,
        showOverlay,
        hideOverlay,
        overlayProps,
      }}
    >
      {props.children}
    </OverlayContext.Provider>
  );
}

export default function Overlay() {
  const { phablet } = useMediaQuery();
  const { OverlayComponent, hideOverlay } = useContext(OverlayContext);

  const overlayTransitions = useTransition(OverlayComponent, {
    from: { opacity: 0.6, transform: `scale(0.98) translateY(4px)` },
    enter: { opacity: 1, transform: `scale(1) translateY(0px)` },
    leave: {
      opacity: 0,
      transform: `scale(1) translateY(0px)`,
      config: { duration: 0 },
    },
    config: { tension: 888, friction: 55 },
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        hideOverlay();
      }
    };

    if (OverlayComponent) {
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [OverlayComponent]);

  if (phablet) {
    return <Slidein />;
  }

  return (
    <>
      {overlayTransitions(
        (style, item) =>
          item && (
            <Portal>
              <Fixed>
                <OutsideClickHandler onOutsideClick={() => hideOverlay()}>
                  <Container style={style}>
                    <ExitContainer onClick={() => hideOverlay()}>
                      <IconEx size={24} fill={theme.colors.white} />
                    </ExitContainer>
                    <BlueGradientContainer>
                      <BlueGradient />
                    </BlueGradientContainer>
                    {OverlayComponent}
                  </Container>
                </OutsideClickHandler>
              </Fixed>
            </Portal>
          )
      )}
    </>
  );
}

const Fixed = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  padding-bottom: 10vh;
  top: 0;
  left: 0;
  z-index: 2147483647;
`;

const Container = styled(animated.div)`
  width: 444px;
  margin: 0 auto;
  padding: 0 48px 46px;
  background: rgba(22, 22, 22, 0.52);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0px 4px 34px rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(55px);
  border-radius: 14px;
  overflow: hidden;

  ${mq.tablet} {
    width: calc(100% - 96px);
  }

  ${mq.phablet} {
    width: calc(100% - 32px);
  }
`;

const ExitContainer = styled.button`
  position: absolute;
  left: 18px;
  top: 18px;
  z-index: 1;

  ${mq.tablet} {
    left: unset;
    right: 36px;
    top: 36px;
  }

  ${mq.phablet} {
    right: 24px;
    top: 24px;
  }
`;

const BlueGradientContainer = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
`;

const BlueGradient = () => (
  <svg
    width="338"
    height="241"
    viewBox="0 0 338 241"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g filter="url(#filter0_f_174_931)">
      <path
        d="M338 144V241H166.412L144 210.283L166.412 144H338Z"
        fill="url(#paint0_linear_174_931)"
      />
    </g>
    <defs>
      <filter
        id="filter0_f_174_931"
        x="3.8147e-06"
        y="0"
        width="482"
        height="385"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        />
        <feGaussianBlur
          stdDeviation="72"
          result="effect1_foregroundBlur_174_931"
        />
      </filter>
      <linearGradient
        id="paint0_linear_174_931"
        x1="229.601"
        y1="241"
        x2="214.385"
        y2="132.316"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#072839" />
        <stop offset="0.525533" stopColor="#033151" />
        <stop offset="1" stopColor="#28445C" />
      </linearGradient>
    </defs>
  </svg>
);
