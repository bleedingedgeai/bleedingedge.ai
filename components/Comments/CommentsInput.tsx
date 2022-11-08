import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { Suspense, useContext, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import Document from "@tiptap/extension-document";
import History from "@tiptap/extension-history";
import Link from "@tiptap/extension-link";
import Mention from "@tiptap/extension-mention";
import Paragraph from "@tiptap/extension-paragraph";
import Placeholder from "@tiptap/extension-placeholder";
import Text from "@tiptap/extension-text";
import { useEditor } from "@tiptap/react";
import { uniqBy } from "../../helpers/methods";
import { useCommentMutations } from "../../lib/hooks/useCommentMutations";
import { mq } from "../../styles/mediaqueries";
import { theme } from "../../styles/theme";
import { AlertsContext } from "../Alerts/AlertsProvider";
import IconEx from "../Icons/IconEx";
import IconSend from "../Icons/IconSend";
import suggestion from "../Mention/suggestion";
import { OverlayContext, OverlayType } from "../Overlay/Overlay";
import Portal from "../Portal";

const DynamicEditor = dynamic(() => import("../Forms/Editor"), {
  suspense: true,
});

export default function CommentsInput({
  article,
  comments,
  conatinerRef,
  parentId,
  setParentId,
  setEditId,
  editId,
}) {
  const { showOverlay } = useContext(OverlayContext);
  const session = useSession();
  const [offset, setOffset] = useState(0);
  const [width, setWidth] = useState(0);
  const { showAlert } = useContext(AlertsContext);
  const replyingToComment = comments.find((c) => c.id === parentId);

  const allAuthors = useMemo(() => {
    const postAuthors = article.authors;
    const commentAuthors = comments
      .filter((comment) => comment.author)
      .map(({ author }) => author);
    return uniqBy([...postAuthors, ...commentAuthors], (a) => a.id);
  }, [comments, article.authors]);

  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Link,
      History,
      Placeholder.configure({
        placeholder: "Ask me anything...",
      }),
      Mention.configure({
        HTMLAttributes: { class: "mention" },
        suggestion: suggestion(article.authors, allAuthors),
      }),
    ],
    onUpdate({ editor }) {
      if (editor.isEmpty) {
        localStorage.removeItem(`comment-${article.slug}`);
      } else {
        localStorage.setItem(`comment-${article.slug}`, editor.getHTML());
      }
    },
  });

  const resetInput = () => {
    setParentId(null);
    editor.commands.clearContent();
    localStorage.removeItem(`comment-${article.slug}`);
  };

  const commentMutations = useCommentMutations({
    article,
    onCreate: resetInput,
    onUpdate: resetInput,
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    if (session.status === "unauthenticated") {
      showOverlay(OverlayType.AUTHENTICATION);
      return;
    }

    if (editor.isEmpty) {
      showAlert({
        icon: IconSend,
        text: "Empty comments are not allowed",
      });
      return;
    }

    const content = editor.getHTML();

    if (editId) {
      commentMutations.update.mutate({
        content,
        commentId: editId,
      });
      return;
    }

    commentMutations.create.mutate({
      content,
      postId: article.id,
      parentId,
      userId: session.data.user.id,
    });
  };

  useEffect(() => {
    function handleResize() {
      const rect = conatinerRef.current.getBoundingClientRect();
      setOffset(rect.x);
      setWidth(rect.width);
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [conatinerRef]);

  useEffect(() => {
    const commentFromStorage = localStorage.getItem(`comment-${article.slug}`);
    if (commentFromStorage && editor) {
      editor?.commands?.setContent(commentFromStorage);
    }
  }, [article.slug, editor]);

  useEffect(() => {
    if (parentId && editor) {
      queueMicrotask(() => {
        editor?.commands?.focus();
      });
    }
  }, [parentId]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setParentId(null);
        setEditId(null);
      }
    };

    if (parentId || editId) {
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [parentId, editId, handleSubmit]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" && event.metaKey) {
        handleSubmit(event);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [parentId, handleSubmit]);

  const commentToEdit = comments.find((comment) => comment.id === editId);

  useEffect(() => {
    if (commentToEdit) {
      editor.commands.setContent(commentToEdit.content);

      queueMicrotask(() => {
        editor?.commands?.focus();
      });
    }
  }, [commentToEdit]);

  return (
    <Portal>
      <Container style={{ left: offset, width }}>
        {replyingToComment && (
          <ReplyingTo>
            <div>
              Replying to <span>{replyingToComment.author.name}</span>
            </div>
            <button onClick={() => setParentId(null)}>
              <IconEx size={16} fill={theme.colors.white} />
            </button>
          </ReplyingTo>
        )}
        {commentToEdit && (
          <ReplyingTo>
            <div>Editing message</div>
            <button
              onClick={() => {
                localStorage.removeItem(`comment-${article.slug}`);
                editor.commands.clearContent();
                setEditId(null);
              }}
            >
              <IconEx size={16} fill={theme.colors.white} />
            </button>
          </ReplyingTo>
        )}
        <Inner>
          <BlueGradientContainer>
            <BlueGradient />
          </BlueGradientContainer>
          <CommentInputForm
            onSubmit={handleSubmit}
            onClick={() => editor?.commands?.focus()}
          >
            <Suspense fallback={null}>
              <DynamicEditor editor={editor} />
            </Suspense>
          </CommentInputForm>
          {session.data ? (
            <Submit type="submit" onClick={handleSubmit}>
              <span>
                @{session?.data?.user.username}
                <Divider />
              </span>
              <IconSend />
            </Submit>
          ) : (
            <Submit type="submit" onClick={handleSubmit}>
              <IconSend />
            </Submit>
          )}
        </Inner>
      </Container>
    </Portal>
  );
}

const Container = styled.div`
  position: fixed;
  right: 12%;
  width: 841px;
  height: 91px;
  bottom: 42px;
  z-index: 12;
  border-radius: 14px;

  ${mq.tablet} {
    height: 46px;
  }
`;

const Inner = styled.div`
  position: relative;
  border-radius: 14px;
  overflow: hidden;
`;

const ReplyingTo = styled.div`
  position: absolute;
  top: -30px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  background: #050505;
  border-top-left-radius: 14px;
  border-top-right-radius: 14px;
  border-bottom: none;
  padding: 8px 19px 20px;
  font-size: 13px;
  font-family: ${(p) => p.theme.fontFamily.nouvelle};
  color: ${(p) => p.theme.colors.light_grey};

  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.06) 0%,
    rgba(255, 255, 255, 0) 100%
  );

  span {
    color: ${(p) => p.theme.colors.off_white};
  }

  div,
  button {
    position: relative;
  }

  &::before {
    content: "";
    position: absolute;
    left: 1px;
    top: 1px;
    background: #050505;
    width: calc(100% - 2px);
    height: 100%;
    border-top-left-radius: 14px;
    border-top-right-radius: 14px;
  }
`;

const CommentInputForm = styled.form`
  transition: box-shadow 0.25s ease, background 0.25s ease;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0px 4px 34px rgba(0, 0, 0, 0.55);
  background: rgba(22, 22, 22, 0.52);
  backdrop-filter: blur(55px);
  border-radius: 14px;
  padding: 16px 18px;
  height: 91px;
  overflow: scroll;

  ${mq.tablet} {
    height: 46px;
    padding: 12px 18px;
  }
`;

const Divider = styled.div`
  height: 16px;
  width: 1px;
  background: rgba(255, 255, 255, 0.21);
  margin: 0 14px;
  transition: background 0.25s ease;
`;

const Submit = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  color: ${(p) => p.theme.colors.light_grey};
  display: flex;
  align-items: center;
  margin-right: -10px;
  margin-top: -6px;
  padding: 6px 10px;
  background: rgba(255, 255, 255, 0);
  border-radius: 7px;
  transition: background 0.25s ease, color 0.25s ease;
  font-size: 12px;

  span {
    display: flex;
    align-items: center;
  }
  svg path {
    transition: fill 0.25s ease;
  }

  &:hover {
    color: ${(p) => p.theme.colors.white};
    background: rgba(255, 255, 255, 0.06);
    svg path {
      fill: ${(p) => p.theme.colors.white};
    }

    ${Divider} {
      background: rgba(255, 255, 255, 0.42);
    }
  }

  ${mq.tablet} {
    top: 14px;
  }

  ${mq.phablet} {
    span {
      display: none;
    }
  }
`;

const BlueGradientContainer = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  pointer-events: none;
`;

const BlueGradient = () => (
  <svg
    width="354"
    height="91"
    viewBox="0 0 354 91"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g filter="url(#filter0_f_768_3122)">
      <path
        d="M374 74V142H170.571L144 120.467L170.571 74H374Z"
        fill="url(#paint0_linear_768_3122)"
      />
    </g>
    <defs>
      <filter
        id="filter0_f_768_3122"
        x="0"
        y="-70"
        width="518"
        height="356"
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
          stdDeviation="54"
          result="effect1_foregroundBlur_768_3122"
        />
      </filter>
      <linearGradient
        id="paint0_linear_768_3122"
        x1="245.485"
        y1="142"
        x2="239.098"
        y2="64.8444"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#072839" />
        <stop offset="0.525533" stopColor="#033151" />
        <stop offset="1" stopColor="#28445C" />
      </linearGradient>
    </defs>
  </svg>
);
