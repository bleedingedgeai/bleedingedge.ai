// import "./MentionList.css";

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import Avatar from "../Avatar";

export default forwardRef((props: any, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [disableMouse, setDisableMouse] = useState(false);
  const itemsRef = useRef<HTMLDivElement>(null);

  const handleSelectIndex = (index) => {
    setSelectedIndex(index);

    const list = itemsRef.current;

    if (!list) {
      return;
    }

    const OPTION_HEIGHT = 30;
    const optionsVisible = 3;

    const visibleTop = list.scrollTop;
    const visibleBottom = list.scrollTop + list.offsetHeight;
    const itemOffsetTop = index * OPTION_HEIGHT;
    const itemOffsetBottom = (index + 1) * OPTION_HEIGHT;

    if (itemOffsetBottom > visibleBottom) {
      list.scrollTo({
        top: (index - optionsVisible) * OPTION_HEIGHT + OPTION_HEIGHT / 2 + 4,
      });
    }

    if (itemOffsetTop < visibleTop) {
      list.scrollTo({
        top: index * OPTION_HEIGHT,
      });
    }
  };

  const selectItem = (index) => {
    const item = props.items[index].username;

    if (item) {
      props.command({ id: item });
    }
  };

  const upHandler = () => {
    const index = selectedIndex === 0 ? 0 : selectedIndex - 1;
    handleSelectIndex(index);
  };

  const downHandler = () => {
    const index =
      selectedIndex === props.items.length - 1
        ? props.items.length - 1
        : selectedIndex + 1;
    handleSelectIndex(index);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useEffect(() => setSelectedIndex(0), [props.items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      setDisableMouse(true);
      if (event.key === "ArrowUp") {
        upHandler();
        return true;
      }

      if (event.key === "ArrowDown") {
        downHandler();
        return true;
      }

      if (event.key === "Enter") {
        enterHandler();
        return true;
      }

      return false;
    },
    onKeyUp: () => {
      setDisableMouse(false);
    },
  }));

  useEffect(() => {
    document.addEventListener("keydown", () => setDisableMouse(true));
    document.addEventListener("keyup", () => setDisableMouse(false));

    return () => {
      document.removeEventListener("keydown", () => setDisableMouse(true));
      document.removeEventListener("keyup", () => setDisableMouse(false));
    };
  }, []);

  return (
    <Items ref={itemsRef}>
      {props.items.length ? (
        props.items.map((item, index) => (
          <Item
            isSelected={index === selectedIndex}
            className={`item ${index === selectedIndex ? "is-selected" : ""}`}
            key={index}
            onClick={() => selectItem(index)}
            onMouseEnter={
              disableMouse ? () => {} : () => setSelectedIndex(index)
            }
          >
            <Avatar src={item.image} size={16} outline={false} />
            <span>
              <Name>{item.name}</Name> <Username>@{item.username}</Username>
            </span>
          </Item>
        ))
      ) : (
        <NoResults className="item">No result</NoResults>
      )}
    </Items>
  );
});

const Items = styled.div`
  background: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05), 0px 10px 20px rgba(0, 0, 0, 0.1);
  color: rgba(0, 0, 0, 0.8);
  font-size: 0.9rem;
  overflow: hidden;
  padding: 0.2rem;
  position: relative;

  width: 218px;
  left: -10px;

  background: rgba(133, 133, 133, 0.16);
  border: 1px solid rgba(133, 133, 133, 0.21);
  box-shadow: 0px 4px 35px rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(13px);
  border-radius: 7px;
  padding: 5px 4px;
  max-height: 113px;
  overflow: scroll;
`;

const Item = styled.button<{ isSelected: boolean }>`
  display: block;
  margin: 0;
  text-align: left;
  width: 100%;
  display: flex;
  display: grid;
  grid-gap: 8px;
  grid-template-columns: 16px 1fr;
  padding: 7px 8px;
  background: ${(p) =>
    p.isSelected ? "rgba(255, 255, 255, 0.08)" : "transpaernt"};
  border-radius: 5px;
`;

const Name = styled.span`
  font-family: ${(p) => p.theme.fontFamily.nouvelle};
  font-size: 12px;
  line-height: 130%;
  color: ${(p) => p.theme.colors.white};
`;

const Username = styled(Name)`
  color: ${(p) => p.theme.colors.light_grey};
`;

const NoResults = styled.div`
  font-family: ${(p) => p.theme.fontFamily.nouvelle};
  font-size: 12px;
  line-height: 130%;
  color: ${(p) => p.theme.colors.light_grey};
  padding: 8px;
`;
