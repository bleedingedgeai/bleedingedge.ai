import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import React from "react";
import { animated, useTransition } from "react-spring";
import styled from "styled-components";
import { scrollable } from "../helpers/dom";
import { hideScrollBar } from "../styles/css";
import { mq } from "../styles/mediaqueries";
import { Sort } from "./Feed";
import Portal from "./Portal";

interface FilterAndSortMobileProps {
  tags: string[];
  sort: Sort;
  setSort: React.Dispatch<React.SetStateAction<Sort>>;
}

const initialState = { title: null, options: [], type: null };
type SlideInType = "Sort" | "Filter";

export default function FilterAndSortMobile({
  tags,
  sort,
  setSort,
}: FilterAndSortMobileProps) {
  const router = useRouter();
  const tag = router.query?.tag as string;

  const [slidein, setSlidein] = useState<{
    title: string;
    options: string[];
    type: SlideInType;
  }>(initialState);

  const handleExit = useCallback(() => {
    scrollable(true);
    setSlidein(initialState);
  }, []);

  const handleSortClick = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      scrollable(false);
      setSlidein({
        title: "Sort by",
        options: ["Latest first", "Earliest first"],
        type: "Sort",
      });
    },
    [tags, sort]
  );

  const handleFiltersClick = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      scrollable(false);
      setSlidein({
        title: "Filter by",
        options: tags.filter((t) => t !== tag),
        type: "Filter",
      });
    },
    [tags, tag, sort]
  );

  const handleSelect = useCallback(
    (event: React.MouseEvent, option: string) => {
      event.preventDefault();
      handleExit();

      if (slidein.type === "Filter") {
        router.replace(`/tags/${option}`);
      }

      if (slidein.type === "Sort") {
        const sort = (
          option === "Latest first" ? "Latest" : "Earliest"
        ) as Sort;
        setSort(sort);
      }
    },
    [slidein, handleExit]
  );

  return (
    <>
      <Container>
        <Button onClick={handleSortClick}>Sort by</Button>
        <Button onClick={handleFiltersClick}>Filters</Button>
      </Container>
      <FilterAndSortSlidein
        {...slidein}
        onSelect={handleSelect}
        onExit={handleExit}
      />
    </>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  width: 226px;
  height: 38px;
  bottom: 40px;
  left: 0;
  right: 0;
  margin: 0 auto;
  background: rgba(133, 133, 133, 0.21);
  border: 1px solid rgba(255, 255, 255, 0.21);
  box-shadow: 0px 4px 35px rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(13px);
  border-radius: 47px;

  ${mq.phabletUp} {
    display: none;
  }
`;

const Button = styled.button`
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  font-size: 14px;

  &:not(:last-of-type) {
    border-right: 1px solid rgba(255, 255, 255, 0.21);
  }
`;

interface FilterAndSortSlideinProps {
  title: string;
  options: string[];
  onSelect?: (event: React.MouseEvent, value: string) => void;
  onExit: () => void;
}

function FilterAndSortSlidein({
  title,
  options,
  onSelect,
  onExit,
}: FilterAndSortSlideinProps) {
  const show = options.length
    ? {
        title,
        options,
      }
    : null;

  const transitions = useTransition(show, {
    key: (item) => item?.title,
    from: { transform: `translateY(120%)` },
    enter: { transform: "translateY(0%)" },
    config: { tension: 720, friction: 72 },
  });

  return (
    <>
      <CloseTagert
        onClick={onExit}
        style={
          show
            ? { opacity: 1, pointerEvents: "initial" }
            : { opacity: 0, pointerEvents: "none" }
        }
      />
      {transitions((style, item) => {
        if (!item) {
          return null;
        }

        return (
          <Portal>
            <ContainerSlidein style={style}>
              <BlueGradientContainer>
                <BlueGradient />
              </BlueGradientContainer>
              <OptionsContainer>
                <Title>{item.title}</Title>
                <Options>
                  {item.options.map((option) => (
                    <Option
                      key={option}
                      onClick={(event) => onSelect(event, option)}
                    >
                      {option}
                    </Option>
                  ))}
                </Options>
              </OptionsContainer>
            </ContainerSlidein>
          </Portal>
        );
      })}
    </>
  );
}

const CloseTagert = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.64);
  z-index: 2147483647;
  transition: opacity 0.4s;

  ${mq.phabletUp} {
    display: none;
  }
`;

const ContainerSlidein = styled(animated.div)`
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 277px;
  background: #0a0a0a;
  border: 1px solid rgba(255, 255, 255, 0.16);
  box-shadow: 0px -6px 24px rgba(0, 0, 0, 0.6);
  padding: 0 16px;
  z-index: 2147483647;
  transition: transform 0.4s cubic-bezier(0.1, 0.95, 0.15, 1);
  overflow: hidden;

  ${mq.phabletUp} {
    display: none;
  }
`;

const OptionsContainer = styled.div`
  display: flex;
  height: 100%;
`;

const Options = styled.div`
  padding: 36px 0;
  flex: 1;
  overflow: scroll;
  ${hideScrollBar}
`;

const Option = styled.div`
  font-family: ${(p) => p.theme.fontFamily.nouvelle};
  font-size: 21px;
  line-height: 120%;
  color: ${(p) => p.theme.colors.off_white};

  width: 100%;
  &:not(:last-of-type) {
    margin-bottom: 12px;
  }
`;

const Title = styled.h3`
  font-family: ${(p) => p.theme.fontFamily.nouvelle};
  font-weight: 500;
  font-size: 12px;
  line-height: 120%;
  color: ${(p) => p.theme.colors.light_grey};
  padding-top: 41px;
  margin-right: 32px;
`;

const BlueGradientContainer = styled.div`
  position: absolute;
  bottom: 0;
  right: -38px;
  pointer-events: none;
`;

const BlueGradient = () => (
  <svg
    width="316"
    height="184"
    viewBox="0 0 316 184"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g filter="url(#filter0_f_516_3674)">
      <path
        d="M282.024 144.857L354 184H184.071L164.588 165L124 132.714L184.071 124L282.024 144.857Z"
        fill="url(#paint0_linear_516_3674)"
      />
    </g>
    <defs>
      <filter
        id="filter0_f_516_3674"
        x="0"
        y="0"
        width="478"
        height="308"
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
          stdDeviation="62"
          result="effect1_foregroundBlur_516_3674"
        />
      </filter>
      <linearGradient
        id="paint0_linear_516_3674"
        x1="239"
        y1="184"
        x2="232.239"
        y2="116.129"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#072839" />
        <stop offset="0.525533" stopColor="#033151" />
        <stop offset="1" stopColor="#28445C" />
      </linearGradient>
    </defs>
  </svg>
);
