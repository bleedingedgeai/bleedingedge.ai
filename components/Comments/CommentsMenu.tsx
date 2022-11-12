import { useSession } from "next-auth/react";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import OutsideClickHandler from "react-outside-click-handler";
import styled from "styled-components";
import { animated, useTransition } from "@react-spring/web";
import { Editor } from "@tiptap/react";
import {
  STORAGE_COMMENT,
  STORAGE_EDIT,
  STORAGE_REPLY,
} from "../../helpers/storage";
import { copyToClipboard } from "../../helpers/string";
import { useCommentMutations } from "../../lib/hooks/useCommentMutations";
import { ArticleWithLike, CommentWithChildren } from "../../prisma/types";
import { theme } from "../../styles/theme";
import { AlertsContext } from "../Alerts/AlertsProvider";
import IconDelete from "../Icons/IconDelete";
import IconEdit from "../Icons/IconEdit";
import IconOptions from "../Icons/IconOptions";
import IconShare from "../Icons/IconShare";
import { OverlayContext, OverlayType } from "../Overlay/Overlay";
import Portal from "../Portal";

interface CommentMenuProps {
  article: ArticleWithLike;
  comment: CommentWithChildren;
  setEdittingId: React.Dispatch<React.SetStateAction<string>>;
  editor: Editor;
}

export default function CommentsMenu({
  article,
  setEdittingId,
  editor,
  comment,
}: CommentMenuProps) {
  const { showOverlay } = useContext(OverlayContext);
  const { showAlert } = useContext(AlertsContext);
  const commentMutations = useCommentMutations({ article });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const session = useSession();

  const [show, setShow] = useState(false);
  const [dropdownPositionStyles, setDropdownPositionStyles] = useState({
    top: 0,
    left: 0,
  });
  const commentKey = `${STORAGE_COMMENT}-${article.slug}`;
  const editKey = `${STORAGE_EDIT}-${article.slug}`;

  //////////////////////////////////////////////////////////////////////////
  // Methods
  //////////////////////////////////////////////////////////////////////////

  const handleCommentEdit = (event: React.MouseEvent) => {
    event.preventDefault();
    setEdittingId(comment.id);
    editor?.commands?.setContent(comment.content);
    editor?.commands?.focus();
    localStorage.setItem(commentKey, comment.content);
    localStorage.setItem(editKey, comment.id);
    setShow(false);
  };

  const handleDelete = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setShow(false);
    return showOverlay(OverlayType.CONFIRMATION, {
      heading: "Deleting your comment",
      text: "Are you sure you want to delete this comment? This cannot be undone. Any replies you may have received will remain visible.",
      right: {
        text: "Delete",
        action: () => commentMutations.delete.mutate(comment.id),
      },
      delete: true,
    });
  };

  const handleAmaShare = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    copyToClipboard(window.location.href);
    showAlert({
      icon: () => <IconShare fill={theme.colors.white} />,
      text: `Link copied to clipboard`,
    });
  };

  //////////////////////////////////////////////////////////////////////////
  // Animation
  //////////////////////////////////////////////////////////////////////////

  const dropdownTransitions = useTransition(show, {
    from: { transform: "translate(0px, -3px) scale(1)", opacity: 0 },
    enter: { transform: "translate(0px, 0px) scale(1)", opacity: 1 },
    leave: { transform: "translate(0px, -3px) scale(1)", opacity: 0 },
    config: { tension: 1200, friction: 50 },
  });

  //////////////////////////////////////////////////////////////////////////
  // Dropdown toggling
  //////////////////////////////////////////////////////////////////////////

  const handleDropdownShow = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPositionStyles({
        top: rect.top + rect.height + 1,
        left: rect.left - 16,
      });

      // Can't use state callback otherwise it will always show with the click outside logic
      if (show) {
        setShow(false);
      } else {
        setShow(true);
      }
    },
    [show, buttonRef, setDropdownPositionStyles]
  );

  useEffect(() => {
    const handleScroll = () => {
      setShow(false);
    };

    if (show) {
      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [show]);

  if (session.status !== "authenticated") {
    return null;
  }

  return (
    <OutsideClickHandler onOutsideClick={() => setShow(false)}>
      <Button onClick={handleDropdownShow} ref={buttonRef}>
        <IconOptions />
      </Button>
      {dropdownTransitions(
        (style, item) =>
          item && (
            <Portal>
              <Dropdown style={{ ...dropdownPositionStyles, ...style }}>
                <Option onClick={handleCommentEdit}>
                  <IconEdit /> Edit comment
                </Option>
                <Option onClick={handleAmaShare}>
                  <IconShare /> Share AMA
                </Option>
                <Divider />
                <Option
                  onClick={handleDelete}
                  style={{ color: theme.colors.magenta }}
                >
                  <IconDelete fill={theme.colors.magenta} /> Delete comment
                </Option>
              </Dropdown>
            </Portal>
          )
      )}
    </OutsideClickHandler>
  );
}

const Button = styled.button`
  margin-left: 8px;

  svg rect {
    transition: fill 0.2s ease;
  }

  &:hover {
    svg rect {
      fill: ${(p) => p.theme.colors.off_white};
    }
  }
`;

const Dropdown = styled(animated.div)`
  position: fixed;
  background: rgba(133, 133, 133, 0.16);
  border: 1px solid rgba(133, 133, 133, 0.21);
  box-shadow: 0px 4px 35px rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(55px);
  border-radius: 7px;
  padding: 4px;
  width: 200px;
  transform-origin: top right;
  z-index: 2147483647;
`;

const Option = styled.div`
  padding: 8px 10px;
  border-radius: 5px;
  font-family: ${(p) => p.theme.fontFamily.nouvelle};
  font-size: 12px;
  background: transparent;
  transition: background 0.2s ease;
  display: flex;
  align-items: center;
  cursor: pointer;

  svg {
    margin-right: 8px;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
`;

const Divider = styled.div`
  height: 1px;
  width: calc(100% - 22px);
  margin: 5px 11px;
  background: rgba(255, 255, 255, 0.12);
`;
