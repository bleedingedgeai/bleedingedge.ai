import styled from "styled-components";
import { EditorContent, Editor as EditorType } from "@tiptap/react";
import { mq } from "../../styles/mediaqueries";

export default function Editor({ editor }: { editor: EditorType }) {
  return (
    <Container>
      <EditorContent editor={editor} />
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  border-radius: 14px;
  max-width: 687px;
  width: 90%;

  .mention {
  }

  .ProseMirror {
    caret-color: ${(p) => p.theme.colors.orange};

    ${mq.tablet} {
      font-size: 16px;
    }

    .is-editor-empty:first-of-type::before {
      content: attr(data-placeholder);
      float: left;
      pointer-events: none;
      height: 0;
      font-size: 16px;
      font-family: ${(p) => p.theme.fontFamily.nouvelle};
      color: rgba(255, 255, 255, 0.16);
    }

    p {
      font-size: 16px;
      font-family: ${(p) => p.theme.fontFamily.nouvelle};

      ${mq.tablet} {
        font-size: 16px;
      }
    }

    a {
      text-decoration: underline;
    }
  }
`;
