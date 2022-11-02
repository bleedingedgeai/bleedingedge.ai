import { useSession } from "next-auth/react";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mq } from "../styles/mediaqueries";
import { theme } from "../styles/theme";
import IconEx from "./Icons/IconEx";
import IconSend from "./Icons/IconSend";
import { OverlayContext, OverlayType } from "./Overlay";

export default function CommentBox({
  article,
  comments,
  conatinerRef,
  parentId,
  setParentId,
}) {
  const [comment, setComment] = useState("");
  const { showOverlay } = useContext(OverlayContext);
  const session = useSession();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [offset, setOffset] = useState(0);
  const [width, setWidth] = useState(0);

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

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: ["comments", article.id],
    mutationFn: (newComment: any) => {
      return fetch("/api/comments", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newComment),
      });
    },
    onMutate: async (newComment) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["comments", article.id] });

      // Snapshot the previous value
      const previousComments = queryClient.getQueryData([
        "comments",
        article.id,
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData(["comments", article.id], (old) => [
        ...(old as any),
        {
          ...newComment,
          updatedAt: new Date(),
          createdAt: new Date(),
          author: {
            name: session.data.user.name,
            image: session.data.user.image,
          },
        },
      ]);

      setParentId(null);
      setComment("");
      // Return a context object with the snapshotted value
      return { previousComments };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(
        ["comments", article.id],
        context.previousComments
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", article.id] });
    },
  });

  const handleCommentChange = useCallback(
    (event: React.FormEvent<HTMLTextAreaElement>) => {
      setComment(event.currentTarget.value);
    },
    [setComment]
  );

  const handleSubmit = (event) => {
    event.preventDefault();

    if (session.status === "unauthenticated") {
      return showOverlay(OverlayType.AUTHENTICATION);
    }

    mutation.mutate({
      content: comment,
      postId: article.id,
      parentId,
      userId: session.data.user.id,
    });
  };

  const replyingToComment = comments.find((c) => c.id === parentId);

  useEffect(() => {
    if (parentId) {
      queueMicrotask(() => {
        textareaRef.current.focus();
      });
    }
  }, [parentId]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setParentId(null);
      }
    };

    if (parentId) {
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [parentId]);

  return (
    <CommentBoxForm onSubmit={handleSubmit} style={{ left: offset, width }}>
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
      <BlueGradientContainer>
        <BlueGradient />
      </BlueGradientContainer>

      <StyledTextarea
        ref={textareaRef}
        value={comment}
        onChange={handleCommentChange}
        placeholder="Ask my anything"
      />

      <Submit type="submit">
        {session.data.user.name}
        <Divider />
        <IconSend />
      </Submit>
    </CommentBoxForm>
  );
}

const ReplyingTo = styled.div`
  position: absolute;
  top: -28px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  background: #050505;
  border-top-left-radius: 14px;
  border-top-right-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-bottom: none;
  padding: 8px 19px 12px;
  font-size: 13px;
  font-family: ${(p) => p.theme.fontFamily.nouvelle};
  color: ${(p) => p.theme.colors.light_grey};

  span {
    color: ${(p) => p.theme.colors.off_white};
  }
`;

const CommentBoxForm = styled.form`
  position: fixed;
  right: 12%;
  width: 841px;
  height: 91px;
  bottom: 42px;
  z-index: 3;
`;

const Submit = styled.button`
  position: absolute;
  top: 18px;
  right: 16px;
  color: ${(p) => p.theme.colors.light_grey};
  display: flex;
  align-items: center;
`;

const Divider = styled.div`
  height: 16px;
  width: 1px;
  background: rgba(255, 255, 255, 0.21);
  margin: 0 14px;
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

const StyledTextarea = styled.textarea`
  width: 100%;
  resize: none;
  border: none;
  border-radius: 14px;
  padding: 16px 18px;
  font-size: 14px;
  height: 91px;
  box-shadow: 0px 4px 34px rgba(0, 0, 0, 0.55);
  transition: box-shadow 0.25s ease, background 0.25s ease;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0px 4px 34px rgba(0, 0, 0, 0.55);
  background: rgba(22, 22, 22, 0.52);
  backdrop-filter: blur(55px);
  caret-color: ${(p) => p.theme.colors.orange};

  &::placeholder {
    color: rgba(255, 255, 255, 0.16);
  }

  &:not([disabled], :focus):hover {
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.16);
  }

  &:focus {
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.32);
  }

  ${mq.tablet} {
    font-size: 16px;
  }
`;
