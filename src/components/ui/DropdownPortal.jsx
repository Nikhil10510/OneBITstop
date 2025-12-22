import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export default function DropdownPortal({ anchorRef, open, children }) {
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const portalRef = useRef(null);

  useEffect(() => {
    if (open && anchorRef?.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [open, anchorRef]);

  if (!open) return null;

  return createPortal(
    <div
      ref={portalRef}
      style={{
        position: "absolute",
        top: position.top,
        left: position.left,
        minWidth: position.width,
        zIndex: 9999,
      }}
    >
      {children}
    </div>,
    document.body
  );
} 