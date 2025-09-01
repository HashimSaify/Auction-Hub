import * as React from "react";

/**
 * VisuallyHidden: hides content visually but keeps it accessible to screen readers.
 * Usage: <VisuallyHidden>Hidden text</VisuallyHidden>
 */
export const VisuallyHidden = ({ children, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    style={{
      border: 0,
      clip: "rect(0 0 0 0)",
      height: "1px",
      margin: "-1px",
      overflow: "hidden",
      padding: 0,
      position: "absolute",
      width: "1px",
      whiteSpace: "nowrap",
    }}
    {...props}
  >
    {children}
  </span>
);
