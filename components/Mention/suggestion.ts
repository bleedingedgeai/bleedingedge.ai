import Fuse from "fuse.js";
import tippy from "tippy.js";
import { ReactRenderer } from "@tiptap/react";
import MentionList from "./MentionList";

const suggestion = (authors) => ({
  items: ({ query, ...rest }) => {
    console.log(query, rest);

    const fuse = new Fuse(authors, {
      threshold: 0.25,
      location: 0,
      distance: 16,
      keys: ["username", "name"],
    });

    const result = query
      ? fuse.search(query).map((result) => result?.item)
      : authors;

    return result.slice(0, 10);
  },

  render: () => {
    let component;
    let popup;

    return {
      onStart: (props) => {
        component = new ReactRenderer(MentionList, {
          props,
          editor: props.editor,
        });

        if (!props.clientRect) {
          return;
        }

        popup = tippy("body", {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: "manual",
          animation: false,
          placement: "top-start",
        });
      },

      onUpdate(props) {
        component.updateProps(props);

        if (!props.clientRect) {
          return;
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        });
      },

      onKeyDown(props) {
        if (props.event.key === "Escape") {
          popup[0].hide();

          return true;
        }

        return component.ref?.onKeyDown(props);
      },

      onExit() {
        popup[0].destroy();
        component.destroy();
      },
    };
  },
});

export default suggestion;
