import styled, { css } from "styled-components";
import { EditorContent, Editor as EditorType } from "@tiptap/react";
import { mq } from "../../styles/mediaqueries";

export default function Editor({
  editor,
  fontSize = 16,
}: {
  editor: EditorType;
  fontSize?: number;
}) {
  return (
    <Container fontSize={fontSize}>
      <EditorContent editor={editor} />
    </Container>
  );
}

export const editorCss = css<{ fontSize: number }>`
  caret-color: ${(p) => p.theme.colors.orange};

  ${mq.tablet} {
    font-size: 16px;
  }

  .is-editor-empty:first-of-type::before {
    content: attr(data-placeholder);
    float: left;
    pointer-events: none;
    height: 0;
    font-size: ${(p) => p.fontSize}px;
    font-family: ${(p) => p.theme.fontFamily.nouvelle};
    color: rgba(255, 255, 255, 0.16);
  }

  p {
    font-size: ${(p) => p.fontSize}px;
    font-family: ${(p) => p.theme.fontFamily.nouvelle};
    color: ${(p) => p.theme.colors.off_white};

    ${mq.desktopMaxUp} {
      font-size: 16px;
    }

    &:not(:last-of-type) {
      margin-bottom: 6px;
    }
  }

  a {
    text-decoration: underline;
    word-break: break-all;
  }
`;

const Container = styled.div<{ fontSize: number }>`
  width: 100%;
  border-radius: 14px;
  max-width: 687px;
  width: 90%;

  .ProseMirror {
    ${editorCss}
  }
`;
