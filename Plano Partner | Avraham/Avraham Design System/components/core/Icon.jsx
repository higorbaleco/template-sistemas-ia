import React from "react";

/* Thin wrapper over the Lucide CDN sprite the live site uses.
   Renders <i data-lucide="name"> and asks lucide to swap it for the SVG. */
export function Icon({ name, size = 20, strokeWidth = 1.75, color = "currentColor", style }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (window.lucide && ref.current) window.lucide.createIcons({ nameAttr: "data-lucide", icons: window.lucide.icons, attrs: {}, root: ref.current.parentNode || undefined });
  });
  return (
    <i
      ref={ref}
      data-lucide={name}
      style={{ display: "inline-flex", width: size, height: size, color, strokeWidth, flex: "0 0 auto", ...style }}
    />
  );
}
