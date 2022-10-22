import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import ClientOnly from "./ClientOnly";

export default function Portal(
  props: React.PropsWithChildren<{ node?: HTMLElement; debug?: boolean }>
) {
  const [defaultNode, setDefaultNode] = useState(() => {
    if (typeof window !== "undefined") {
      const portal = document.createElement("portal");
      return portal;
    }
  });

  useEffect(() => {
    if (!defaultNode) {
      const portal = document.createElement("portal");

      if (props.debug) {
        portal.setAttribute("data-debug", "true");
      }

      setDefaultNode(portal);
    }
  }, [defaultNode, props.debug]);

  useEffect(() => {
    document.body.appendChild(defaultNode);

    return () => {
      document.body.removeChild(defaultNode);
    };
  }, [defaultNode]);

  if (!props.node && !defaultNode) {
    return null;
  }

  return (
    <ClientOnly>
      {ReactDOM.createPortal(props.children, props.node || defaultNode)}
    </ClientOnly>
  );
}
