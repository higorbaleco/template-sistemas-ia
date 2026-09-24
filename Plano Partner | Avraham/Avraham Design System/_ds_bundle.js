/* @ds-bundle: {"format":4,"namespace":"AvrahamDesignSystem_609133","components":[{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Eyebrow","sourcePath":"components/core/Eyebrow.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"IconTile","sourcePath":"components/core/IconTile.jsx"},{"name":"Pill","sourcePath":"components/core/Pill.jsx"},{"name":"SectionHeading","sourcePath":"components/core/SectionHeading.jsx"},{"name":"Avatar","sourcePath":"components/data/Avatar.jsx"},{"name":"AvatarGroup","sourcePath":"components/data/Avatar.jsx"},{"name":"DataTable","sourcePath":"components/data/DataTable.jsx"},{"name":"ProgressBar","sourcePath":"components/data/ProgressBar.jsx"},{"name":"ScoreRing","sourcePath":"components/data/ScoreRing.jsx"},{"name":"StatTile","sourcePath":"components/data/StatTile.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Tabs","sourcePath":"components/forms/Tabs.jsx"},{"name":"Toggle","sourcePath":"components/forms/Toggle.jsx"},{"name":"AchievementBadge","sourcePath":"components/patterns/AchievementBadge.jsx"},{"name":"ChatMessage","sourcePath":"components/patterns/ChatMessage.jsx"},{"name":"ChecklistItem","sourcePath":"components/patterns/ChecklistItem.jsx"},{"name":"KanbanCard","sourcePath":"components/patterns/KanbanCard.jsx"},{"name":"NumberedCard","sourcePath":"components/patterns/NumberedCard.jsx"},{"name":"SidebarNav","sourcePath":"components/patterns/SidebarNav.jsx"},{"name":"SolutionCard","sourcePath":"components/patterns/SolutionCard.jsx"}],"sourceHashes":{"components/core/Badge.jsx":"c2f05d82144c","components/core/Button.jsx":"08b821d3df2a","components/core/Card.jsx":"4dd17a6fa96d","components/core/Eyebrow.jsx":"406d21be86b8","components/core/Icon.jsx":"ac9d52962ccc","components/core/IconButton.jsx":"f4ae034cf51e","components/core/IconTile.jsx":"ee3bedbabbee","components/core/Pill.jsx":"be63d16d740a","components/core/SectionHeading.jsx":"614becfc287f","components/data/Avatar.jsx":"75512e95b3be","components/data/DataTable.jsx":"7c47796a2684","components/data/ProgressBar.jsx":"1f472d19add0","components/data/ScoreRing.jsx":"0decb9029d67","components/data/StatTile.jsx":"f67adabb9233","components/forms/Input.jsx":"a147e8d4386f","components/forms/Select.jsx":"9043b609ca23","components/forms/Tabs.jsx":"5e42834c2adb","components/forms/Toggle.jsx":"d087f4266b1e","components/patterns/AchievementBadge.jsx":"dc59dc190e06","components/patterns/ChatMessage.jsx":"8a287f90cae8","components/patterns/ChecklistItem.jsx":"d96515f18914","components/patterns/KanbanCard.jsx":"91243a4ffc11","components/patterns/NumberedCard.jsx":"154efad65b81","components/patterns/SidebarNav.jsx":"8a8ba1d5334e","components/patterns/SolutionCard.jsx":"0aba6dc9ed0f","ui_kits/crm/crm.jsx":"a81ceb531e10","ui_kits/crm/data.js":"6cfe6b8dde09"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.AvrahamDesignSystem_609133 = window.AvrahamDesignSystem_609133 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Card.jsx
try { (() => {
function Card({
  children,
  tone = "plain",
  flowTop = false,
  hoverLift = false,
  pad = "var(--card-pad)",
  style
}) {
  const [hover, setHover] = React.useState(false);
  const tones = {
    plain: {
      background: "var(--surface-card)",
      border: "1px solid var(--border-subtle)"
    },
    emerald: {
      background: "var(--gradient-card-emerald)",
      border: "1px solid var(--border-accent)"
    },
    lavender: {
      background: "var(--gradient-card-lavender)",
      border: "1px solid var(--border-accent-alt)"
    },
    sunken: {
      background: "var(--surface-sunken)",
      border: "1px solid var(--border-subtle)"
    },
    ops: {
      background: "var(--ops-850)",
      border: "1px solid var(--ops-line)"
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      position: "relative",
      borderRadius: "var(--radius-xl)",
      padding: pad,
      overflow: "hidden",
      boxShadow: hoverLift && hover ? "var(--shadow-md)" : "var(--shadow-sm)",
      transform: hoverLift && hover ? "translateY(-2px)" : "none",
      transition: "box-shadow var(--dur-base) var(--ease-standard),transform var(--dur-base) var(--ease-standard)",
      ...tones[tone],
      ...style
    }
  }, flowTop ? /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: "0 0 auto 0",
      height: 2,
      background: "var(--gradient-flow)"
    }
  }) : null, children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Eyebrow.jsx
try { (() => {
function Eyebrow({
  children,
  tone = "accent",
  rule = false,
  style
}) {
  const colors = {
    accent: "var(--text-accent)",
    muted: "var(--text-muted)",
    alt: "var(--text-accent-alt)"
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      color: colors[tone] || colors.accent,
      fontSize: "var(--text-eyebrow-size)",
      fontWeight: "var(--text-eyebrow-weight)",
      letterSpacing: "var(--text-eyebrow-ls)",
      textTransform: "uppercase",
      ...style
    }
  }, rule ? /*#__PURE__*/React.createElement("span", {
    style: {
      width: 28,
      height: 1,
      background: "currentColor",
      opacity: .6
    }
  }) : null, children);
}
Object.assign(__ds_scope, { Eyebrow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Eyebrow.jsx", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
/* Thin wrapper over the Lucide CDN sprite the live site uses.
   Renders <i data-lucide="name"> and asks lucide to swap it for the SVG. */
function Icon({
  name,
  size = 20,
  strokeWidth = 1.75,
  color = "currentColor",
  style
}) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (window.lucide && ref.current) window.lucide.createIcons({
      nameAttr: "data-lucide",
      icons: window.lucide.icons,
      attrs: {},
      root: ref.current.parentNode || undefined
    });
  });
  return /*#__PURE__*/React.createElement("i", {
    ref: ref,
    "data-lucide": name,
    style: {
      display: "inline-flex",
      width: size,
      height: size,
      color,
      strokeWidth,
      flex: "0 0 auto",
      ...style
    }
  });
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
const TONES = {
  live: {
    bg: "var(--surface-emerald)",
    fg: "var(--emerald-700)",
    dot: "var(--status-live)",
    bd: "var(--border-accent)"
  },
  info: {
    bg: "var(--surface-lavender)",
    fg: "var(--lavender-700)",
    dot: "var(--status-info)",
    bd: "var(--border-accent-alt)"
  },
  warn: {
    bg: "rgba(232,161,58,.14)",
    fg: "var(--amber)",
    dot: "var(--status-warn)",
    bd: "rgba(232,161,58,.34)"
  },
  danger: {
    bg: "var(--surface-coral)",
    fg: "var(--coral)",
    dot: "var(--status-danger)",
    bd: "rgba(240,85,91,.34)"
  },
  neutral: {
    bg: "var(--surface-sunken)",
    fg: "var(--text-body)",
    dot: "var(--status-neutral)",
    bd: "var(--border-subtle)"
  },
  solid: {
    bg: "var(--emerald-500)",
    fg: "#fff",
    dot: "#fff",
    bd: "transparent"
  }
};
function Badge({
  children,
  tone = "neutral",
  dot = false,
  pulse = false,
  icon,
  uppercase = true,
  style
}) {
  const t = TONES[tone] || TONES.neutral;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 7,
      padding: "5px 12px",
      background: t.bg,
      color: t.fg,
      border: `1px solid ${t.bd}`,
      borderRadius: "var(--radius-pill)",
      fontSize: 11,
      fontWeight: "var(--weight-bold)",
      letterSpacing: uppercase ? "var(--text-eyebrow-ls)" : "0.01em",
      textTransform: uppercase ? "uppercase" : "none",
      whiteSpace: "nowrap",
      ...style
    }
  }, dot ? /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: "50%",
      background: t.dot,
      animation: pulse ? "var(--pulse-live)" : undefined
    }
  }) : null, icon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 13
  }) : null, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
const SIZES = {
  sm: {
    h: "var(--control-h-sm)",
    px: 16,
    fs: 13
  },
  md: {
    h: "var(--control-h)",
    px: 22,
    fs: 14
  },
  lg: {
    h: 54,
    px: 30,
    fs: 16
  }
};
function Button({
  children,
  variant = "primary",
  size = "md",
  icon,
  iconRight = "arrow-right",
  fullWidth = false,
  disabled = false,
  onClick,
  type = "button",
  style
}) {
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const s = SIZES[size] || SIZES.md;
  const skins = {
    primary: {
      background: press ? "var(--cyan-700)" : hover ? "var(--cyan-600)" : "var(--cyan-500)",
      color: "var(--action-primary-fg)",
      border: "1px solid transparent",
      boxShadow: hover && !press ? "0 8px 16px rgba(11,188,162,0.24)" : "0 4px 12px rgba(11,188,162,0.12)"
    },
    secondary: {
      background: hover ? "var(--n-100)" : "var(--n-000)",
      color: "var(--t1)",
      border: "1px solid var(--gbo)",
      boxShadow: "none"
    },
    outline: {
      background: hover ? "var(--cyan-050)" : "transparent",
      color: "var(--cyan-700)",
      border: "1px solid var(--cyan-500)",
      boxShadow: "none"
    },
    ghost: {
      background: hover ? "var(--n-050)" : "transparent",
      color: "var(--t2)",
      border: "1px solid transparent",
      boxShadow: "none"
    },
    danger: {
      background: hover ? "#CE3B40" : "var(--coral)",
      color: "#fff",
      border: "1px solid transparent",
      boxShadow: "none"
    }
  };
  return /*#__PURE__*/React.createElement("button", {
    type: type,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setPress(false);
    },
    onMouseDown: () => setPress(true),
    onMouseUp: () => setPress(false),
    style: {
      display: fullWidth ? "flex" : "inline-flex",
      width: fullWidth ? "100%" : undefined,
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      height: s.h,
      padding: `0 ${s.px}px`,
      fontSize: s.fs,
      fontFamily: "var(--font-body)",
      fontWeight: "var(--weight-bold)",
      letterSpacing: "-0.005em",
      borderRadius: "var(--radius-pill)",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.45 : 1,
      transform: press && !disabled ? "translateY(1px)" : "none",
      transition: "var(--transition-control)",
      ...skins[variant],
      ...style
    }
  }, icon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: s.fs + 3
  }) : null, /*#__PURE__*/React.createElement("span", null, children), iconRight && variant !== "ghost" ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconRight,
    size: s.fs + 2
  }) : null);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function IconButton({
  icon,
  label,
  size = 40,
  variant = "ghost",
  active = false,
  onClick,
  style
}) {
  const [hover, setHover] = React.useState(false);
  const skins = {
    ghost: {
      background: hover || active ? "var(--action-secondary-bg)" : "transparent",
      color: active ? "var(--text-accent)" : "var(--action-ghost-fg)",
      border: "1px solid transparent"
    },
    outline: {
      background: hover ? "var(--action-secondary-bg)" : "var(--surface-card)",
      color: "var(--text-body)",
      border: "1px solid var(--border-subtle)"
    },
    solid: {
      background: hover ? "var(--action-primary-bg-hover)" : "var(--action-primary-bg)",
      color: "#fff",
      border: "1px solid transparent"
    }
  };
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClick,
    "aria-label": label,
    title: label,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: size,
      height: size,
      borderRadius: "var(--radius-pill)",
      cursor: "pointer",
      transition: "var(--transition-control)",
      ...skins[variant],
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: Math.round(size * 0.45)
  }));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/core/IconTile.jsx
try { (() => {
function IconTile({
  icon,
  tone = "emerald",
  size = 56,
  style
}) {
  const tones = {
    emerald: {
      bg: "var(--surface-emerald)",
      bd: "var(--border-accent)",
      fg: "var(--emerald-500)"
    },
    lavender: {
      bg: "var(--surface-lavender)",
      bd: "var(--border-accent-alt)",
      fg: "var(--lavender-500)"
    },
    neutral: {
      bg: "var(--surface-sunken)",
      bd: "var(--border-subtle)",
      fg: "var(--text-body)"
    }
  };
  const t = tones[tone] || tones.emerald;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: size,
      height: size,
      background: t.bg,
      border: `1px solid ${t.bd}`,
      borderRadius: "var(--radius-md)",
      color: t.fg,
      flex: "0 0 auto",
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: Math.round(size * 0.4)
  }));
}
Object.assign(__ds_scope, { IconTile });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconTile.jsx", error: String((e && e.message) || e) }); }

// components/core/Pill.jsx
try { (() => {
/* The site's soft claim chip: emerald dot + sentence-case statement. */
function Pill({
  children,
  tone = "emerald",
  style
}) {
  const tones = {
    emerald: {
      bg: "var(--surface-emerald)",
      fg: "var(--emerald-700)",
      dot: "var(--emerald-500)"
    },
    neutral: {
      bg: "var(--surface-sunken)",
      fg: "var(--text-body)",
      dot: "var(--neutral-400)"
    },
    lavender: {
      bg: "var(--surface-lavender)",
      fg: "var(--lavender-700)",
      dot: "var(--lavender-500)"
    }
  };
  const t = tones[tone] || tones.emerald;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      padding: "12px 20px",
      background: t.bg,
      color: t.fg,
      borderRadius: "var(--radius-pill)",
      fontSize: 15,
      fontWeight: "var(--weight-semibold)",
      lineHeight: 1.3,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: "50%",
      background: t.dot,
      flex: "0 0 auto"
    }
  }), children);
}
Object.assign(__ds_scope, { Pill });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Pill.jsx", error: String((e && e.message) || e) }); }

// components/core/SectionHeading.jsx
try { (() => {
function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  accent,
  maxWidth = 820,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 18,
      alignItems: align === "center" ? "center" : "flex-start",
      textAlign: align,
      maxWidth,
      marginInline: align === "center" ? "auto" : undefined,
      ...style
    }
  }, eyebrow ? /*#__PURE__*/React.createElement(__ds_scope.Eyebrow, {
    rule: align === "center"
  }, eyebrow) : null, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: "var(--text-h2-size)",
      lineHeight: "var(--text-h2-lh)",
      letterSpacing: "var(--text-h2-ls)",
      fontWeight: "var(--text-h2-weight)"
    }
  }, title, accent ? /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-accent)"
    }
  }, " ", accent) : null), lead ? /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "var(--text-lead-size)",
      lineHeight: "var(--text-lead-lh)",
      color: "var(--text-muted)"
    }
  }, lead) : null);
}
Object.assign(__ds_scope, { SectionHeading });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/SectionHeading.jsx", error: String((e && e.message) || e) }); }

// components/data/Avatar.jsx
try { (() => {
function Avatar({
  name = "",
  src,
  size = 36,
  tone = "emerald",
  status,
  style
}) {
  const initials = name.split(" ").filter(Boolean).slice(0, 2).map(w => w[0]).join("").toUpperCase();
  const tones = {
    emerald: {
      bg: "var(--emerald-100)",
      fg: "var(--emerald-700)"
    },
    lavender: {
      bg: "var(--lavender-100)",
      fg: "var(--lavender-700)"
    },
    neutral: {
      bg: "var(--surface-sunken)",
      fg: "var(--text-body)"
    }
  };
  const t = tones[tone] || tones.emerald;
  const statusColor = {
    online: "var(--status-live)",
    busy: "var(--status-warn)",
    offline: "var(--neutral-400)"
  }[status];
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      display: "inline-flex",
      flex: "0 0 auto",
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: size,
      height: size,
      borderRadius: "50%",
      background: src ? `center/cover url(${src})` : t.bg,
      color: t.fg,
      fontSize: size * 0.36,
      fontWeight: "var(--weight-bold)",
      letterSpacing: "0.01em"
    }
  }, src ? null : initials), statusColor ? /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      right: -1,
      bottom: -1,
      width: size * 0.28,
      height: size * 0.28,
      borderRadius: "50%",
      background: statusColor,
      border: "2px solid var(--surface-card)"
    }
  }) : null);
}
function AvatarGroup({
  people = [],
  size = 32,
  max = 4,
  style
}) {
  const shown = people.slice(0, max);
  const rest = people.length - shown.length;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      ...style
    }
  }, shown.map((p, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      marginLeft: i ? -10 : 0,
      border: "2px solid var(--surface-card)",
      borderRadius: "50%",
      display: "inline-flex"
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: p.name,
    src: p.src,
    size: size,
    tone: i % 2 ? "lavender" : "emerald"
  }))), rest > 0 ? /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: -10,
      width: size,
      height: size,
      borderRadius: "50%",
      background: "var(--surface-sunken)",
      border: "2px solid var(--surface-card)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: size * 0.34,
      fontWeight: 700,
      color: "var(--text-muted)"
    }
  }, "+", rest) : null);
}
Object.assign(__ds_scope, { Avatar, AvatarGroup });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/data/DataTable.jsx
try { (() => {
function DataTable({
  columns = [],
  rows = [],
  onRowClick,
  dense = false,
  style
}) {
  const [hover, setHover] = React.useState(-1);
  const pad = dense ? "10px 14px" : "15px 18px";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      overflowX: "auto",
      ...style
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: "100%",
      borderCollapse: "collapse",
      fontSize: 14
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, columns.map(c => /*#__PURE__*/React.createElement("th", {
    key: c.key,
    style: {
      textAlign: c.align || "left",
      padding: pad,
      whiteSpace: "nowrap",
      fontSize: 11,
      fontWeight: "var(--weight-bold)",
      letterSpacing: "var(--text-eyebrow-ls)",
      textTransform: "uppercase",
      color: "var(--text-muted)",
      borderBottom: "1px solid var(--border-subtle)",
      width: c.width
    }
  }, c.label)))), /*#__PURE__*/React.createElement("tbody", null, rows.map((r, i) => /*#__PURE__*/React.createElement("tr", {
    key: r.id || i,
    onMouseEnter: () => setHover(i),
    onMouseLeave: () => setHover(-1),
    onClick: () => onRowClick && onRowClick(r),
    style: {
      background: hover === i ? "var(--surface-sunken)" : "transparent",
      cursor: onRowClick ? "pointer" : "default",
      transition: "background var(--dur-fast) var(--ease-standard)"
    }
  }, columns.map(c => /*#__PURE__*/React.createElement("td", {
    key: c.key,
    style: {
      padding: pad,
      textAlign: c.align || "left",
      color: "var(--text-body)",
      borderBottom: "1px solid var(--border-subtle)",
      verticalAlign: "middle",
      fontFamily: c.mono ? "var(--font-data)" : "inherit",
      fontVariantNumeric: c.mono ? "tabular-nums" : undefined
    }
  }, c.render ? c.render(r) : r[c.key])))))));
}
Object.assign(__ds_scope, { DataTable });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/DataTable.jsx", error: String((e && e.message) || e) }); }

// components/data/ProgressBar.jsx
try { (() => {
function ProgressBar({
  value = 0,
  max = 100,
  tone = "emerald",
  height = 8,
  showValue = false,
  label,
  caption,
  style
}) {
  const pct = Math.max(0, Math.min(100, value / max * 100));
  const fills = {
    emerald: "var(--emerald-500)",
    lavender: "var(--lavender-500)",
    flow: "var(--gradient-flow)",
    warn: "var(--status-warn)"
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8,
      minWidth: 0,
      ...style
    }
  }, label || showValue ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      justifyContent: "space-between",
      gap: 12
    }
  }, label ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: "var(--weight-semibold)",
      color: "var(--text-body)"
    }
  }, label) : null, showValue ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-data)",
      fontSize: 12,
      color: "var(--text-muted)"
    }
  }, value, "/", max) : null) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      height,
      background: "var(--surface-sunken)",
      borderRadius: "var(--radius-pill)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: pct + "%",
      height: "100%",
      background: fills[tone] || fills.emerald,
      borderRadius: "var(--radius-pill)",
      transition: "width var(--dur-slow) var(--ease-out-soft)"
    }
  })), caption ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: "var(--text-muted)"
    }
  }, caption) : null);
}
Object.assign(__ds_scope, { ProgressBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/ProgressBar.jsx", error: String((e && e.message) || e) }); }

// components/data/ScoreRing.jsx
try { (() => {
function ScoreRing({
  value = 0,
  size = 76,
  thickness = 7,
  label,
  tone,
  style
}) {
  const pct = Math.max(0, Math.min(100, value));
  const color = tone || (pct >= 75 ? "var(--emerald-500)" : pct >= 45 ? "var(--status-warn)" : "var(--status-danger)");
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: size,
      height: size,
      flex: "0 0 auto",
      ...style
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    style: {
      transform: "rotate(-90deg)"
    }
  }, /*#__PURE__*/React.createElement("circle", {
    cx: size / 2,
    cy: size / 2,
    r: r,
    fill: "none",
    stroke: "var(--border-subtle)",
    strokeWidth: thickness
  }), /*#__PURE__*/React.createElement("circle", {
    cx: size / 2,
    cy: size / 2,
    r: r,
    fill: "none",
    stroke: color,
    strokeWidth: thickness,
    strokeLinecap: "round",
    strokeDasharray: c,
    strokeDashoffset: c - c * pct / 100,
    style: {
      transition: "stroke-dashoffset var(--dur-slow) var(--ease-out-soft)"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-data)",
      fontSize: size * 0.3,
      fontWeight: 600,
      color: "var(--text-strong)",
      letterSpacing: "-0.02em"
    }
  }, pct), label ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 9,
      textTransform: "uppercase",
      letterSpacing: "0.12em",
      color: "var(--text-muted)",
      fontWeight: 700
    }
  }, label) : null));
}
Object.assign(__ds_scope, { ScoreRing });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/ScoreRing.jsx", error: String((e && e.message) || e) }); }

// components/data/StatTile.jsx
try { (() => {
function StatTile({
  label,
  value,
  unit,
  sub,
  delta,
  deltaTone = "up",
  icon,
  tone = "plain",
  style
}) {
  const tones = {
    plain: {
      bg: "var(--surface-card)",
      bd: "var(--border-subtle)"
    },
    emerald: {
      bg: "var(--gradient-card-emerald)",
      bd: "var(--border-accent)"
    },
    lavender: {
      bg: "var(--gradient-card-lavender)",
      bd: "var(--border-accent-alt)"
    },
    ops: {
      bg: "var(--ops-850)",
      bd: "var(--ops-line)"
    }
  };
  const t = tones[tone] || tones.plain;
  const dcolor = deltaTone === "up" ? "var(--emerald-600)" : deltaTone === "down" ? "var(--status-danger)" : "var(--text-muted)";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: t.bg,
      border: `1px solid ${t.bd}`,
      borderRadius: "var(--radius-lg)",
      padding: 20,
      display: "flex",
      flexDirection: "column",
      gap: 12,
      minWidth: 0,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: "var(--weight-bold)",
      letterSpacing: "var(--text-eyebrow-ls)",
      textTransform: "uppercase",
      color: "var(--text-muted)"
    }
  }, label), icon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 16,
    color: "var(--text-muted)"
  }) : null), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "av-mono",
    style: {
      fontFamily: "var(--font-data)",
      fontSize: "var(--text-metric-size)",
      lineHeight: "var(--text-metric-lh)",
      letterSpacing: "var(--text-metric-ls)",
      fontWeight: "var(--text-metric-weight)",
      color: "var(--text-strong)",
      fontVariantNumeric: "tabular-nums"
    }
  }, value), unit ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15,
      fontWeight: "var(--weight-semibold)",
      color: "var(--text-muted)"
    }
  }, unit) : null, delta ? /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "auto",
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      fontSize: 13,
      fontWeight: "var(--weight-bold)",
      color: dcolor
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: deltaTone === "down" ? "trending-down" : "trending-up",
    size: 14
  }), delta) : null), sub ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: "var(--text-muted)"
    }
  }, sub) : null);
}
Object.assign(__ds_scope, { StatTile });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/StatTile.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function Input({
  label,
  placeholder,
  value,
  onChange,
  icon,
  type = "text",
  hint,
  error,
  disabled,
  fullWidth = true,
  style
}) {
  const [focus, setFocus] = React.useState(false);
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 7,
      width: fullWidth ? "100%" : undefined,
      ...style
    }
  }, label ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-label-size)",
      fontWeight: "var(--text-label-weight)",
      color: "var(--text-body)"
    }
  }, label) : null, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      height: "var(--control-h)",
      padding: "0 14px",
      background: disabled ? "var(--surface-sunken)" : "var(--surface-card)",
      border: `1px solid ${error ? "var(--status-danger)" : focus ? "var(--emerald-500)" : "var(--border-subtle)"}`,
      borderRadius: "var(--radius-md)",
      boxShadow: focus ? "var(--glow-focus)" : "none",
      transition: "var(--transition-control)"
    }
  }, icon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 17,
    color: "var(--text-muted)"
  }) : null, /*#__PURE__*/React.createElement("input", {
    type: type,
    value: value,
    placeholder: placeholder,
    disabled: disabled,
    onChange: onChange,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      flex: 1,
      minWidth: 0,
      border: "none",
      outline: "none",
      background: "transparent",
      font: "inherit",
      fontSize: 14,
      color: "var(--text-strong)"
    }
  })), error || hint ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: error ? "var(--status-danger)" : "var(--text-muted)"
    }
  }, error || hint) : null);
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function Select({
  label,
  options = [],
  value,
  onChange,
  fullWidth = true,
  style
}) {
  const [focus, setFocus] = React.useState(false);
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 7,
      width: fullWidth ? "100%" : undefined,
      ...style
    }
  }, label ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-label-size)",
      fontWeight: "var(--text-label-weight)",
      color: "var(--text-body)"
    }
  }, label) : null, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      display: "flex",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("select", {
    value: value,
    onChange: onChange,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      width: "100%",
      height: "var(--control-h)",
      padding: "0 38px 0 14px",
      appearance: "none",
      background: "var(--surface-card)",
      color: "var(--text-strong)",
      font: "inherit",
      fontSize: 14,
      border: `1px solid ${focus ? "var(--emerald-500)" : "var(--border-subtle)"}`,
      borderRadius: "var(--radius-md)",
      boxShadow: focus ? "var(--glow-focus)" : "none",
      outline: "none",
      cursor: "pointer",
      transition: "var(--transition-control)"
    }
  }, options.map(o => /*#__PURE__*/React.createElement("option", {
    key: o.value ?? o,
    value: o.value ?? o
  }, o.label ?? o))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      right: 13,
      display: "inline-flex",
      pointerEvents: "none"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-down",
    size: 17,
    color: "var(--text-muted)"
  }))));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Tabs.jsx
try { (() => {
function Tabs({
  tabs = [],
  value,
  onChange,
  variant = "pill",
  style
}) {
  const active = value ?? (tabs[0] && (tabs[0].value ?? tabs[0]));
  if (variant === "underline") {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 26,
        borderBottom: "1px solid var(--border-subtle)",
        ...style
      }
    }, tabs.map(t => {
      const v = t.value ?? t;
      const on = v === active;
      return /*#__PURE__*/React.createElement("button", {
        key: v,
        type: "button",
        onClick: () => onChange && onChange(v),
        style: {
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "0 0 12px",
          border: "none",
          background: "none",
          cursor: "pointer",
          fontSize: 14,
          fontWeight: "var(--weight-bold)",
          color: on ? "var(--text-strong)" : "var(--text-muted)",
          boxShadow: on ? "inset 0 -2px 0 var(--emerald-500)" : "none",
          transition: "var(--transition-control)"
        }
      }, t.icon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
        name: t.icon,
        size: 16
      }) : null, t.label ?? t);
    }));
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-flex",
      gap: 4,
      padding: 4,
      background: "var(--surface-sunken)",
      border: "1px solid var(--border-subtle)",
      borderRadius: "var(--radius-pill)",
      ...style
    }
  }, tabs.map(t => {
    const v = t.value ?? t;
    const on = v === active;
    return /*#__PURE__*/React.createElement("button", {
      key: v,
      type: "button",
      onClick: () => onChange && onChange(v),
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        height: 34,
        padding: "0 16px",
        border: "none",
        borderRadius: "var(--radius-pill)",
        cursor: "pointer",
        fontSize: 13,
        fontWeight: "var(--weight-bold)",
        background: on ? "var(--surface-card)" : "transparent",
        color: on ? "var(--text-strong)" : "var(--text-muted)",
        boxShadow: on ? "var(--shadow-xs)" : "none",
        transition: "var(--transition-control)"
      }
    }, t.icon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: t.icon,
      size: 15
    }) : null, t.label ?? t, t.count != null ? /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-data)",
        fontSize: 11,
        color: "var(--text-muted)"
      }
    }, t.count) : null);
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Tabs.jsx", error: String((e && e.message) || e) }); }

// components/forms/Toggle.jsx
try { (() => {
function Toggle({
  checked = false,
  onChange,
  label,
  description,
  disabled,
  style
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "flex",
      alignItems: description ? "flex-start" : "center",
      gap: 12,
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? .5 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    onClick: () => !disabled && onChange && onChange(!checked),
    style: {
      width: 42,
      height: 24,
      borderRadius: "var(--radius-pill)",
      flex: "0 0 auto",
      background: checked ? "var(--emerald-500)" : "var(--neutral-300)",
      position: "relative",
      transition: "background var(--dur-base) var(--ease-standard)",
      marginTop: description ? 2 : 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: 3,
      left: checked ? 21 : 3,
      width: 18,
      height: 18,
      borderRadius: "50%",
      background: "#fff",
      boxShadow: "var(--shadow-xs)",
      transition: "left var(--dur-base) var(--ease-out-soft)"
    }
  })), label || description ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 2
    }
  }, label ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: "var(--weight-semibold)",
      color: "var(--text-strong)"
    }
  }, label) : null, description ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: "var(--text-muted)"
    }
  }, description) : null) : null);
}
Object.assign(__ds_scope, { Toggle });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Toggle.jsx", error: String((e && e.message) || e) }); }

// components/patterns/AchievementBadge.jsx
try { (() => {
function AchievementBadge({
  icon = "award",
  title,
  detail,
  state = "earned",
  progress,
  style
}) {
  const earned = state === "earned";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 14,
      padding: 14,
      background: earned ? "var(--gradient-card-emerald)" : "var(--surface-card)",
      border: `1px solid ${earned ? "var(--border-accent)" : "var(--border-subtle)"}`,
      borderRadius: "var(--radius-lg)",
      opacity: earned ? 1 : .72,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: 44,
      height: 44,
      borderRadius: "var(--radius-md)",
      flex: "0 0 auto",
      background: earned ? "var(--emerald-500)" : "var(--surface-sunken)",
      color: earned ? "#fff" : "var(--text-muted)",
      boxShadow: earned ? "var(--shadow-emerald-sm)" : "none"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: earned ? icon : "lock",
    size: 20
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 3,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: "var(--weight-bold)",
      color: "var(--text-strong)"
    }
  }, title), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: "var(--text-muted)"
    }
  }, detail), !earned && progress != null ? /*#__PURE__*/React.createElement("span", {
    style: {
      marginTop: 4,
      height: 5,
      borderRadius: 999,
      background: "var(--surface-sunken)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      width: progress + "%",
      height: "100%",
      background: "var(--gradient-flow)"
    }
  })) : null));
}
Object.assign(__ds_scope, { AchievementBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/patterns/AchievementBadge.jsx", error: String((e && e.message) || e) }); }

// components/patterns/ChatMessage.jsx
try { (() => {
function ChatMessage({
  children,
  from = "contact",
  author,
  time,
  status = "read",
  agent = false,
  style
}) {
  const mine = from === "agent";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: mine ? "flex-end" : "flex-start",
      gap: 5,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "78%",
      padding: "12px 15px",
      fontSize: 14,
      lineHeight: 1.5,
      background: mine ? "var(--surface-emerald)" : "var(--surface-card)",
      border: `1px solid ${mine ? "var(--border-accent)" : "var(--border-subtle)"}`,
      color: "var(--text-strong)",
      borderRadius: mine ? "18px 18px 6px 18px" : "18px 18px 18px 6px"
    }
  }, agent ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      marginBottom: 6,
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color: "var(--text-accent)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "bot",
    size: 12
  }), "IA") : null, /*#__PURE__*/React.createElement("div", null, children)), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      fontSize: 11,
      color: "var(--text-muted)"
    }
  }, author ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600
    }
  }, author) : null, time ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-data)"
    }
  }, time) : null, mine && status ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: status === "read" ? "check-check" : "check",
    size: 13,
    color: status === "read" ? "var(--emerald-500)" : "var(--text-muted)"
  }) : null));
}
Object.assign(__ds_scope, { ChatMessage });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/patterns/ChatMessage.jsx", error: String((e && e.message) || e) }); }

// components/patterns/ChecklistItem.jsx
try { (() => {
function ChecklistItem({
  children,
  state = "yes",
  divider = false,
  style
}) {
  const cfg = {
    yes: {
      icon: "check",
      bg: "var(--surface-emerald)",
      fg: "var(--emerald-600)",
      bd: "var(--border-accent)"
    },
    no: {
      icon: "x",
      bg: "var(--surface-sunken)",
      fg: "var(--text-muted)",
      bd: "var(--border-subtle)"
    }
  }[state] || {};
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-start",
      gap: 14,
      padding: "14px 0",
      borderBottom: divider ? "1px solid var(--border-subtle)" : "none",
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: 24,
      height: 24,
      borderRadius: "50%",
      background: cfg.bg,
      border: `1px solid ${cfg.bd}`,
      color: cfg.fg,
      flex: "0 0 auto",
      marginTop: 1
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: cfg.icon,
    size: 13,
    strokeWidth: 2.4
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15,
      lineHeight: 1.5,
      color: "var(--text-body)"
    }
  }, children));
}
Object.assign(__ds_scope, { ChecklistItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/patterns/ChecklistItem.jsx", error: String((e && e.message) || e) }); }

// components/patterns/KanbanCard.jsx
try { (() => {
function KanbanCard({
  title,
  company,
  value,
  score,
  owner,
  tags = [],
  channel = "WhatsApp",
  age,
  onClick,
  style
}) {
  const [hover, setHover] = React.useState(false);
  const scoreTone = score >= 75 ? "live" : score >= 45 ? "warn" : "danger";
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12,
      padding: 16,
      background: "var(--surface-card)",
      border: `1px solid ${hover ? "var(--border-accent)" : "var(--border-subtle)"}`,
      borderRadius: "var(--radius-lg)",
      boxShadow: hover ? "var(--shadow-md)" : "var(--shadow-xs)",
      cursor: onClick ? "pointer" : "default",
      transition: "var(--transition-control)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: "var(--weight-bold)",
      color: "var(--text-strong)"
    }
  }, title), company ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "var(--text-muted)"
    }
  }, company) : null), score != null ? /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: scoreTone,
    uppercase: false
  }, score) : null), value ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-data)",
      fontSize: 17,
      fontWeight: 600,
      color: "var(--text-strong)",
      letterSpacing: "-0.01em"
    }
  }, value) : null, tags.length ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 6
    }
  }, tags.map(t => /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    key: t,
    tone: "neutral",
    uppercase: false,
    style: {
      fontSize: 10,
      padding: "3px 9px"
    }
  }, t))) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
      paddingTop: 10,
      borderTop: "1px solid var(--border-subtle)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      fontSize: 11,
      color: "var(--text-muted)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "message-circle",
    size: 13,
    color: "var(--whatsapp)"
  }), channel, age ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-data)"
    }
  }, "\xB7 ", age) : null), owner ? /*#__PURE__*/React.createElement(__ds_scope.Avatar, {
    name: owner,
    size: 24
  }) : null));
}
Object.assign(__ds_scope, { KanbanCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/patterns/KanbanCard.jsx", error: String((e && e.message) || e) }); }

// components/patterns/NumberedCard.jsx
try { (() => {
function NumberedCard({
  number,
  icon,
  title,
  body,
  bullets = [],
  tone = "emerald",
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 16,
      padding: "var(--card-pad)",
      background: "var(--surface-card)",
      border: "1px solid var(--border-subtle)",
      borderRadius: "var(--radius-xl)",
      boxShadow: "var(--shadow-sm)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.IconTile, {
    icon: icon,
    tone: tone,
    size: 48
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 34,
      fontWeight: "var(--weight-extrabold)",
      letterSpacing: "-0.03em",
      color: "var(--border-strong)",
      lineHeight: 1
    }
  }, number)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: "var(--text-h4-size)",
      fontWeight: "var(--text-h4-weight)"
    }
  }, title), body ? /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 15,
      lineHeight: 1.58,
      color: "var(--text-muted)"
    }
  }, body) : null), bullets.length ? /*#__PURE__*/React.createElement("ul", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8,
      margin: 0,
      padding: 0,
      listStyle: "none"
    }
  }, bullets.map((b, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    style: {
      display: "flex",
      alignItems: "flex-start",
      gap: 9,
      fontSize: 14,
      color: "var(--text-body)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      marginTop: 6,
      width: 6,
      height: 6,
      borderRadius: "50%",
      flex: "0 0 auto",
      background: tone === "lavender" ? "var(--lavender-500)" : "var(--emerald-500)"
    }
  }), b))) : null);
}
Object.assign(__ds_scope, { NumberedCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/patterns/NumberedCard.jsx", error: String((e && e.message) || e) }); }

// components/patterns/SidebarNav.jsx
try { (() => {
function SidebarNav({
  items = [],
  value,
  onChange,
  collapsed = false,
  header,
  footer,
  style
}) {
  return /*#__PURE__*/React.createElement("nav", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 4,
      width: collapsed ? "var(--sidebar-w-collapsed)" : "var(--sidebar-w)",
      padding: collapsed ? "16px 12px" : "16px",
      background: "var(--surface-card)",
      borderRight: "1px solid var(--border-subtle)",
      height: "100%",
      boxSizing: "border-box",
      transition: "width var(--dur-base) var(--ease-standard)",
      overflow: "hidden",
      ...style
    }
  }, header, items.map(it => {
    if (it.section) return collapsed ? /*#__PURE__*/React.createElement("span", {
      key: it.section,
      style: {
        height: 12
      }
    }) : /*#__PURE__*/React.createElement("span", {
      key: it.section,
      style: {
        padding: "16px 10px 6px",
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "var(--text-eyebrow-ls)",
        textTransform: "uppercase",
        color: "var(--text-muted)"
      }
    }, it.section);
    const on = it.value === value;
    return /*#__PURE__*/React.createElement("button", {
      key: it.value,
      type: "button",
      onClick: () => onChange && onChange(it.value),
      title: it.label,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 11,
        height: 42,
        padding: collapsed ? 0 : "0 12px",
        justifyContent: collapsed ? "center" : "flex-start",
        border: "none",
        borderRadius: "var(--radius-md)",
        cursor: "pointer",
        width: "100%",
        background: on ? "var(--surface-emerald)" : "transparent",
        color: on ? "var(--text-accent)" : "var(--text-body)",
        fontSize: 14,
        fontWeight: on ? "var(--weight-bold)" : "var(--weight-medium)",
        transition: "var(--transition-control)",
        textAlign: "left"
      }
    }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: it.icon,
      size: 18
    }), collapsed ? null : /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
      }
    }, it.label), !collapsed && it.count != null ? /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-data)",
        fontSize: 11,
        fontWeight: 600,
        padding: "2px 7px",
        borderRadius: 999,
        background: on ? "var(--emerald-500)" : "var(--surface-sunken)",
        color: on ? "#fff" : "var(--text-muted)"
      }
    }, it.count) : null);
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "auto"
    }
  }, footer));
}
Object.assign(__ds_scope, { SidebarNav });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/patterns/SidebarNav.jsx", error: String((e && e.message) || e) }); }

// components/patterns/SolutionCard.jsx
try { (() => {
function SolutionCard({
  icon,
  title,
  body,
  meta,
  cta = "Explore details",
  tone = "emerald",
  onClick,
  style
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 18,
      padding: "var(--card-pad)",
      background: "var(--surface-card)",
      border: "1px solid var(--border-subtle)",
      borderRadius: "var(--radius-xl)",
      cursor: onClick ? "pointer" : "default",
      boxShadow: hover ? "var(--shadow-md)" : "var(--shadow-sm)",
      transform: hover ? "translateY(-2px)" : "none",
      transition: "box-shadow var(--dur-base) var(--ease-standard),transform var(--dur-base) var(--ease-standard)",
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.IconTile, {
    icon: icon,
    tone: tone
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: "var(--text-h4-size)",
      lineHeight: "var(--text-h4-lh)",
      fontWeight: "var(--text-h4-weight)"
    }
  }, title), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 15,
      lineHeight: 1.58,
      color: "var(--text-muted)"
    }
  }, body)), meta ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "var(--text-muted)"
    }
  }, meta) : null, cta ? /*#__PURE__*/React.createElement("span", {
    style: {
      marginTop: "auto",
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      color: "var(--text-accent)",
      fontSize: 14,
      fontWeight: "var(--weight-bold)"
    }
  }, cta, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      transform: hover ? "translateX(3px)" : "none",
      transition: "transform var(--dur-fast) var(--ease-standard)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "arrow-right",
    size: 15
  }))) : null);
}
Object.assign(__ds_scope, { SolutionCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/patterns/SolutionCard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/crm/crm.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const NS = window.AvrahamDesignSystem_609133;
const {
  Badge,
  Button,
  Card,
  Eyebrow,
  Icon,
  IconButton,
  IconTile,
  Pill,
  SectionHeading,
  Avatar,
  AvatarGroup,
  DataTable,
  ProgressBar,
  ScoreRing,
  StatTile,
  Input,
  Select,
  Tabs,
  Toggle,
  AchievementBadge,
  ChatMessage,
  ChecklistItem,
  KanbanCard,
  NumberedCard,
  SidebarNav
} = NS;
const DB = window.DB;
const {
  useState
} = React;
const relucide = () => {
  if (window.lucide) window.lucide.createIcons({
    nameAttr: "data-lucide"
  });
};
const NAV = [{
  section: "Operação"
}, {
  value: "dashboard",
  label: "Dashboard",
  icon: "layout-dashboard"
}, {
  value: "funil",
  label: "Funil de vendas",
  icon: "kanban",
  count: 62
}, {
  value: "conversas",
  label: "Conversas",
  icon: "messages-square",
  count: 3
}, {
  value: "instancias",
  label: "Instâncias WhatsApp",
  icon: "smartphone"
}, {
  section: "Engajamento"
}, {
  value: "gamificacao",
  label: "Gamificação",
  icon: "trophy"
}, {
  value: "config",
  label: "Equipe e plano",
  icon: "settings"
}];
function Panel({
  title,
  action,
  children,
  style,
  pad = 22
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "glass",
    style: {
      borderRadius: "var(--rc)",
      padding: pad,
      display: "flex",
      flexDirection: "column",
      gap: 16,
      ...style
    }
  }, title ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 15,
      fontWeight: 700,
      letterSpacing: "-.01em",
      margin: 0
    }
  }, title), action) : null, children);
}

/* ---------------- Flow strip (5-step operation) ---------------- */
function FlowStrip() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(5,1fr)",
      gap: 12
    }
  }, DB.flow.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: s.n,
    className: "glass glass-hover",
    style: {
      position: "relative",
      borderRadius: "var(--rc)",
      padding: "18px 16px",
      display: "flex",
      flexDirection: "column",
      gap: 12,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: "0 0 auto 0",
      height: 3
    },
    className: s.grad
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: s.grad,
    style: {
      width: 40,
      height: 40,
      borderRadius: 12,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#04120e"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: s.icon,
    size: 19,
    color: "#04120e"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 22,
      fontWeight: 700,
      color: "var(--t4)",
      letterSpacing: "-.02em"
    }
  }, s.n)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 700
    }
  }, s.label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "var(--t3)",
      marginTop: 3,
      lineHeight: 1.4
    }
  }, s.detail)), /*#__PURE__*/React.createElement("div", {
    className: "num",
    style: {
      fontSize: 18,
      fontWeight: 700,
      letterSpacing: "-.01em",
      color: "var(--cyan)"
    }
  }, s.metric))));
}

/* ---------------- Dashboard ---------------- */
function Dashboard({
  go
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 22
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, null, "Centro de comando"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 30,
      fontWeight: 700,
      letterSpacing: "-.02em",
      margin: "10px 0 6px"
    }
  }, "Bom dia, Marina."), /*#__PURE__*/React.createElement("p", {
    className: "body",
    style: {
      maxWidth: 560
    }
  }, "A opera\xE7\xE3o est\xE1 saud\xE1vel. A IA respondeu 1.204 conversas nas \xFAltimas 24h e agendou 31 reuni\xF5es sem interven\xE7\xE3o humana.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4,1fr)",
      gap: 16
    }
  }, DB.kpis.map(k => /*#__PURE__*/React.createElement(StatTile, _extends({
    key: k.label
  }, k)))), /*#__PURE__*/React.createElement(Panel, {
    title: "Jornada da opera\xE7\xE3o",
    action: /*#__PURE__*/React.createElement(Badge, {
      tone: "live",
      dot: true,
      pulse: true
    }, "Em tempo real")
  }, /*#__PURE__*/React.createElement(FlowStrip, null)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1.6fr 1fr",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Panel, {
    title: "Neg\xF3cios em destaque",
    action: /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "sm",
      iconRight: "arrow-right",
      onClick: () => go("funil")
    }, "Ver funil")
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column"
    }
  }, DB.leads.filter(l => ["reuniao", "proposta", "ganho"].includes(l.stage)).map((l, i, a) => /*#__PURE__*/React.createElement("div", {
    key: l.id,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 14,
      padding: "12px 0",
      borderBottom: i < a.length - 1 ? "1px solid var(--gbo)" : "none"
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: l.title,
    size: 38,
    tone: i % 2 ? "lavender" : "emerald"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 700
    }
  }, l.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "var(--t3)"
    }
  }, l.company)), /*#__PURE__*/React.createElement("div", {
    className: "num",
    style: {
      fontSize: 15,
      fontWeight: 700
    }
  }, l.value), /*#__PURE__*/React.createElement(ScoreRing, {
    value: l.score,
    size: 40,
    thickness: 4
  }))))), /*#__PURE__*/React.createElement(Panel, {
    title: "Suas tarefas",
    action: /*#__PURE__*/React.createElement(Badge, {
      tone: "warn"
    }, DB.tasks.filter(t => !t.done).length, " abertas")
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 4
    }
  }, DB.tasks.map((t, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "10px 0",
      borderBottom: i < DB.tasks.length - 1 ? "1px solid var(--gbo)" : "none"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 20,
      height: 20,
      borderRadius: 6,
      flex: "0 0 auto",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      background: t.done ? "var(--surface-cyan)" : "transparent",
      border: `1px solid ${t.done ? "var(--border-cyan)" : "var(--border-strong)"}`
    }
  }, t.done ? /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 12,
    color: "var(--cyan)",
    strokeWidth: 2.6
  }) : null), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontSize: 13,
      color: t.done ? "var(--t4)" : "var(--t2)",
      textDecoration: t.done ? "line-through" : "none"
    }
  }, t.text), /*#__PURE__*/React.createElement("span", {
    className: "num",
    style: {
      fontSize: 11,
      color: t.tone === "warn" ? "var(--status-warn)" : "var(--t3)"
    }
  }, t.due)))))));
}

/* ---------------- Funil (Kanban) ---------------- */
function Funil() {
  const [funnel, setFunnel] = useState("comercial");
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 20,
      height: "100%"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 16,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, null, "Pipeline"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 26,
      fontWeight: 700,
      letterSpacing: "-.02em",
      margin: "8px 0 0"
    }
  }, "Funil de vendas")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Tabs, {
    tabs: [{
      value: "comercial",
      label: "Comercial"
    }, {
      value: "reativacao",
      label: "Reativação"
    }, {
      value: "upsell",
      label: "Upsell"
    }],
    value: funnel,
    onChange: setFunnel
  }), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    icon: "plus",
    iconRight: null
  }, "Novo neg\xF3cio"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(5,minmax(220px,1fr))",
      gap: 14,
      overflowX: "auto",
      paddingBottom: 8,
      alignItems: "start"
    }
  }, DB.stages.map(st => {
    const items = DB.leads.filter(l => l.stage === st.key);
    const total = items.reduce((s, l) => s + parseFloat(l.value.replace(/[^\d]/g, "")) / 1000, 0);
    return /*#__PURE__*/React.createElement("div", {
      key: st.key,
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 12,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "0 2px"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 8,
        height: 8,
        borderRadius: 3,
        background: st.tint
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 700
      }
    }, st.label), /*#__PURE__*/React.createElement("span", {
      className: "num",
      style: {
        marginLeft: "auto",
        fontSize: 11,
        color: "var(--t3)"
      }
    }, items.length, " \xB7 R$ ", total.toFixed(0), "k")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 10
      }
    }, items.map(l => /*#__PURE__*/React.createElement(KanbanCard, _extends({
      key: l.id
    }, l, {
      onClick: () => {}
    }))), !items.length ? /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: "var(--t4)",
        padding: "18px 0",
        textAlign: "center",
        border: "1px dashed var(--gbo)",
        borderRadius: 12
      }
    }, "Sem neg\xF3cios") : null));
  })));
}

/* ---------------- Conversas ---------------- */
function Conversas() {
  const [active, setActive] = useState(1);
  const [draft, setDraft] = useState("");
  const [thread, setThread] = useState(DB.thread);
  const conv = DB.conversations.find(c => c.id === active);
  const send = () => {
    if (!draft.trim()) return;
    setThread(t => [...t, {
      from: "agent",
      author: "Você",
      time: "agora",
      status: "sent",
      text: draft
    }]);
    setDraft("");
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "300px 1fr 280px",
      gap: 0,
      height: "100%",
      border: "1px solid var(--gbo)",
      borderRadius: "var(--rc)",
      overflow: "hidden",
      background: "var(--gb)",
      backdropFilter: "var(--glass-blur)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      borderRight: "1px solid var(--gbo)",
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 16,
      borderBottom: "1px solid var(--gbo)"
    }
  }, /*#__PURE__*/React.createElement(Input, {
    icon: "search",
    placeholder: "Buscar conversa"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      overflowY: "auto",
      flex: 1
    }
  }, DB.conversations.map(c => /*#__PURE__*/React.createElement("button", {
    key: c.id,
    onClick: () => setActive(c.id),
    style: {
      display: "flex",
      gap: 12,
      width: "100%",
      textAlign: "left",
      padding: "14px 16px",
      border: "none",
      borderBottom: "1px solid var(--gbo)",
      cursor: "pointer",
      background: c.id === active ? "var(--surface-cyan)" : "transparent"
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: c.name,
    size: 40,
    status: c.status,
    tone: c.id % 2 ? "lavender" : "emerald"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      color: c.id === active ? "var(--cyan)" : "var(--t1)"
    }
  }, c.name), /*#__PURE__*/React.createElement("span", {
    className: "num",
    style: {
      fontSize: 10,
      color: "var(--t3)",
      flex: "0 0 auto"
    }
  }, c.time)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "var(--t3)",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      marginTop: 2
    }
  }, c.last), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      marginTop: 6,
      alignItems: "center"
    }
  }, c.ai ? /*#__PURE__*/React.createElement(Badge, {
    tone: "live",
    uppercase: false,
    style: {
      fontSize: 9,
      padding: "2px 7px"
    }
  }, "IA ativa") : /*#__PURE__*/React.createElement(Badge, {
    tone: "neutral",
    uppercase: false,
    style: {
      fontSize: 9,
      padding: "2px 7px"
    }
  }, "Humano"), c.unread ? /*#__PURE__*/React.createElement("span", {
    className: "num",
    style: {
      marginLeft: "auto",
      background: "var(--cyan)",
      color: "var(--bg2)",
      borderRadius: 999,
      fontSize: 10,
      fontWeight: 700,
      padding: "1px 7px"
    }
  }, c.unread) : null)))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "14px 20px",
      borderBottom: "1px solid var(--gbo)"
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: conv.name,
    size: 38,
    status: conv.status
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 700
    }
  }, conv.name, " \xB7 ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--t3)",
      fontWeight: 500
    }
  }, conv.company)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      alignItems: "center",
      marginTop: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      fontSize: 11,
      color: "var(--t3)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "message-circle",
    size: 12,
    color: "#25D366"
  }), conv.channel))), /*#__PURE__*/React.createElement(Badge, {
    tone: "live",
    dot: true,
    pulse: true
  }, "IA respondendo"), /*#__PURE__*/React.createElement(IconButton, {
    icon: "phone",
    label: "Ligar",
    variant: "outline",
    size: 36
  }), /*#__PURE__*/React.createElement(IconButton, {
    icon: "more-vertical",
    label: "Mais",
    size: 36
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      padding: 20,
      display: "flex",
      flexDirection: "column",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "num",
    style: {
      fontSize: 11,
      color: "var(--t4)",
      background: "var(--gb)",
      padding: "4px 12px",
      borderRadius: 999
    }
  }, "Hoje")), thread.map((m, i) => /*#__PURE__*/React.createElement(ChatMessage, {
    key: i,
    from: m.from,
    agent: m.agent,
    author: m.author,
    time: m.time,
    status: m.status
  }, m.text))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      padding: 16,
      borderTop: "1px solid var(--gbo)",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    icon: "paperclip",
    label: "Anexar",
    size: 40
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "Assumir a conversa e responder...",
    value: draft,
    onChange: e => setDraft(e.target.value)
  })), /*#__PURE__*/React.createElement(Button, {
    icon: "send",
    iconRight: null,
    onClick: send
  }, "Enviar"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 18,
      padding: 20,
      borderLeft: "1px solid var(--gbo)",
      overflowY: "auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 10,
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: conv.name,
    size: 64,
    tone: "emerald"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 700
    }
  }, conv.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "var(--t3)"
    }
  }, conv.company)), /*#__PURE__*/React.createElement(ScoreRing, {
    value: conv.score,
    size: 72,
    label: "Score"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm",
    icon: "calendar-plus",
    iconRight: null
  }, "Agendar"), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "sm",
    icon: "user-plus",
    iconRight: null
  }, "Qualificar")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "label",
    style: {
      color: "var(--t3)",
      fontSize: 11
    }
  }, "Detalhes"), [["Canal", conv.channel], ["Origem", "Anúncio - Meta"], ["Etapa", "Qualificação IA"], ["Responsável", conv.ai ? "IA Avraham" : "Marina D."]].map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      display: "flex",
      justifyContent: "space-between",
      fontSize: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--t3)"
    }
  }, k), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--t1)",
      fontWeight: 600
    }
  }, v))))));
}

/* ---------------- Instâncias WhatsApp ---------------- */
function Instancias() {
  const healthTone = h => h >= 85 ? "live" : h >= 55 ? "warn" : "danger";
  const cols = [{
    key: "label",
    label: "Instância",
    render: r => /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 34,
        height: 34,
        borderRadius: 10,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(37,211,102,.12)",
        border: "1px solid rgba(37,211,102,.3)"
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "message-circle",
      size: 16,
      color: "#25D366"
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 700,
        fontSize: 13
      }
    }, r.label), /*#__PURE__*/React.createElement("div", {
      className: "num",
      style: {
        fontSize: 11,
        color: "var(--t3)"
      }
    }, r.number)))
  }, {
    key: "type",
    label: "Tipo",
    render: r => /*#__PURE__*/React.createElement(Badge, {
      tone: r.type === "API oficial" ? "info" : "neutral",
      uppercase: false
    }, r.type)
  }, {
    key: "status",
    label: "Status",
    render: r => /*#__PURE__*/React.createElement(Badge, {
      tone: r.status,
      dot: true,
      pulse: r.status === "live",
      uppercase: false
    }, r.status === "live" ? "Conectada" : r.status === "warn" ? "Instável" : "Queda")
  }, {
    key: "messages",
    label: "Msgs 24h",
    align: "right",
    mono: true
  }, {
    key: "tps",
    label: "Throughput",
    align: "right",
    mono: true
  }, {
    key: "health",
    label: "Saúde",
    align: "right",
    render: r => /*#__PURE__*/React.createElement("span", {
      style: {
        display: "inline-flex",
        justifyContent: "flex-end",
        width: "100%"
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: healthTone(r.health),
      uppercase: false
    }, r.health, "%"))
  }];
  const live = DB.instances.filter(i => i.status === "live").length;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, null, "Infraestrutura"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 26,
      fontWeight: 700,
      letterSpacing: "-.02em",
      margin: "8px 0 0"
    }
  }, "Inst\xE2ncias WhatsApp")), /*#__PURE__*/React.createElement(Button, {
    icon: "plus",
    iconRight: null
  }, "Conectar n\xFAmero")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4,1fr)",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(StatTile, {
    label: "N\xFAmeros ativos",
    value: `${live}/5`,
    icon: "smartphone",
    tone: "emerald",
    sub: "2 em conting\xEAncia"
  }), /*#__PURE__*/React.createElement(StatTile, {
    label: "API oficial",
    value: "3",
    icon: "badge-check",
    sub: "80 msg/s cada"
  }), /*#__PURE__*/React.createElement(StatTile, {
    label: "Msgs enviadas 24h",
    value: "30,4k",
    icon: "send",
    delta: "+22%",
    deltaTone: "up"
  }), /*#__PURE__*/React.createElement(StatTile, {
    label: "Sa\xFAde m\xE9dia",
    value: "72",
    unit: "%",
    icon: "activity",
    delta: "-8%",
    deltaTone: "down"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1.7fr 1fr",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Panel, {
    title: "Todas as inst\xE2ncias",
    pad: 0,
    style: {
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement(DataTable, {
    columns: cols,
    rows: DB.instances,
    onRowClick: () => {}
  })), /*#__PURE__*/React.createElement(Panel, {
    title: "Conectar novo n\xFAmero"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 14,
      alignItems: "center",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 150,
      height: 150,
      borderRadius: 16,
      background: "#fff",
      display: "grid",
      gridTemplateColumns: "repeat(9,1fr)",
      gap: 2,
      padding: 12
    }
  }, Array.from({
    length: 81
  }).map((_, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      background: (i * 7 + i % 5 * 3) % 3 ? "#0D0E11" : "transparent",
      borderRadius: 1
    }
  }))), /*#__PURE__*/React.createElement("p", {
    className: "body",
    style: {
      fontSize: 13
    }
  }, "Abra o WhatsApp no celular, toque em Aparelhos conectados e escaneie o c\xF3digo."), /*#__PURE__*/React.createElement(Toggle, {
    checked: true,
    label: "API oficial (recomendado)",
    description: "Alta disponibilidade, 80 msg/s, conting\xEAncia autom\xE1tica"
  }), /*#__PURE__*/React.createElement(Button, {
    fullWidth: true,
    icon: "link",
    iconRight: null
  }, "Gerar novo QR")))));
}

/* ---------------- Gamificação ---------------- */
function Gamificacao() {
  const u = DB.user;
  const ranked = [...DB.team].sort((a, b) => b.points - a.points);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, null, "Desempenho"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 26,
      fontWeight: 700,
      letterSpacing: "-.02em",
      margin: "8px 0 0"
    }
  }, "Metas, desafios e conquistas")), /*#__PURE__*/React.createElement("div", {
    className: "glass",
    style: {
      borderRadius: "var(--rc)",
      padding: 24,
      display: "grid",
      gridTemplateColumns: "auto 1fr auto",
      gap: 24,
      alignItems: "center",
      position: "relative",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: 0,
      background: "var(--grad-command)",
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: u.name,
    size: 64,
    tone: "emerald"
  }), /*#__PURE__*/React.createElement("span", {
    className: "num g-flow",
    style: {
      position: "absolute",
      right: -6,
      bottom: -6,
      width: 30,
      height: 30,
      borderRadius: "50%",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 12,
      fontWeight: 700,
      color: "#04120e",
      border: "2px solid var(--bg)"
    }
  }, u.level)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 17,
      fontWeight: 700
    }
  }, u.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "var(--t3)"
    }
  }, u.role))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      maxWidth: 460
    }
  }, /*#__PURE__*/React.createElement(ProgressBar, {
    value: u.xp,
    max: u.xpNext,
    tone: "flow",
    label: `Nível ${u.level} · Especialista de Operação`,
    caption: `${u.xp.toLocaleString("pt-BR")} / ${u.xpNext.toLocaleString("pt-BR")} XP para o nível ${u.level + 1}`
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      gap: 22
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "num",
    style: {
      fontSize: 26,
      fontWeight: 700,
      color: "var(--cyan)"
    }
  }, u.streak), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--t3)"
    }
  }, "dias de ofensiva")), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "num",
    style: {
      fontSize: 26,
      fontWeight: 700
    }
  }, "#1"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--t3)"
    }
  }, "no ranking")))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Panel, {
    title: "Metas do m\xEAs"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 18
    }
  }, DB.goals.map(g => /*#__PURE__*/React.createElement(ProgressBar, {
    key: g.label,
    value: g.value,
    max: g.max,
    tone: g.tone,
    label: g.label,
    caption: `${g.value.toLocaleString("pt-BR")} de ${g.max.toLocaleString("pt-BR")} ${g.unit}`
  })))), /*#__PURE__*/React.createElement(Panel, {
    title: "Desafios ativos",
    action: /*#__PURE__*/React.createElement(Badge, {
      tone: "info"
    }, "semana")
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, DB.challenges.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.title,
    style: {
      display: "flex",
      gap: 14,
      alignItems: "center",
      padding: 14,
      borderRadius: 14,
      background: "var(--gb)",
      border: "1px solid var(--gbo)"
    }
  }, /*#__PURE__*/React.createElement(IconTile, {
    icon: c.icon,
    size: 44
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 700
    }
  }, c.title), /*#__PURE__*/React.createElement("span", {
    className: "num",
    style: {
      fontSize: 12,
      color: "var(--cyan)",
      fontWeight: 700
    }
  }, c.reward)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "var(--t3)",
      margin: "2px 0 8px"
    }
  }, c.detail), /*#__PURE__*/React.createElement(ProgressBar, {
    value: c.progress,
    tone: "emerald",
    height: 6
  }))))))), /*#__PURE__*/React.createElement(Panel, {
    title: "Conquistas"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3,1fr)",
      gap: 12
    }
  }, DB.achievements.map(a => /*#__PURE__*/React.createElement(AchievementBadge, _extends({
    key: a.title
  }, a))))), /*#__PURE__*/React.createElement(Panel, {
    title: "Ranking da equipe",
    action: /*#__PURE__*/React.createElement(Tabs, {
      tabs: ["Mês", "Semana", "Trimestre"],
      value: "M\xEAs",
      onChange: () => {}
    })
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column"
    }
  }, ranked.map((m, i) => /*#__PURE__*/React.createElement("div", {
    key: m.name,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 14,
      padding: "12px 0",
      borderBottom: i < ranked.length - 1 ? "1px solid var(--gbo)" : "none"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "num",
    style: {
      width: 24,
      fontSize: 15,
      fontWeight: 700,
      color: i === 0 ? "var(--cyan)" : "var(--t3)"
    }
  }, i + 1), /*#__PURE__*/React.createElement(Avatar, {
    name: m.name,
    size: 38,
    tone: m.ai ? "lavender" : i % 2 ? "lavender" : "emerald"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 700,
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, m.name, m.ai ? /*#__PURE__*/React.createElement(Badge, {
    tone: "live",
    uppercase: false,
    style: {
      fontSize: 9,
      padding: "1px 7px"
    }
  }, "IA") : null, m.you ? /*#__PURE__*/React.createElement(Badge, {
    tone: "info",
    uppercase: false,
    style: {
      fontSize: 9,
      padding: "1px 7px"
    }
  }, "voc\xEA") : null), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "var(--t3)"
    }
  }, m.role, " \xB7 n\xEDvel ", m.level)), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "right"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "num",
    style: {
      fontSize: 12,
      color: "var(--t3)"
    }
  }, m.deals, " neg\xF3cios"), /*#__PURE__*/React.createElement("div", {
    className: "num",
    style: {
      fontSize: 15,
      fontWeight: 700,
      color: "var(--cyan)"
    }
  }, m.points.toLocaleString("pt-BR"), " pts")))))));
}

/* ---------------- Equipe e plano ---------------- */
function Config() {
  const [tab, setTab] = useState("equipe");
  const roleTone = {
    Admin: "info",
    Closer: "live",
    SDR: "neutral"
  };
  const cols = [{
    key: "name",
    label: "Membro",
    render: r => /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: r.name,
      size: 34
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 700,
        fontSize: 13
      }
    }, r.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: "var(--t3)"
      }
    }, r.email)))
  }, {
    key: "role",
    label: "Papel",
    render: r => /*#__PURE__*/React.createElement(Badge, {
      tone: roleTone[r.role] || "neutral",
      uppercase: false
    }, r.role)
  }, {
    key: "status",
    label: "Status",
    render: r => /*#__PURE__*/React.createElement("span", {
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontSize: 12,
        color: r.status === "Ativo" ? "var(--t1)" : "var(--status-warn)"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: r.status === "Ativo" ? "var(--green)" : "var(--status-warn)"
      }
    }), r.status)
  }, {
    key: "act",
    label: "",
    align: "right",
    render: () => /*#__PURE__*/React.createElement(IconButton, {
      icon: "more-horizontal",
      label: "A\xE7\xF5es",
      size: 32
    })
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, null, "Administra\xE7\xE3o"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 26,
      fontWeight: 700,
      letterSpacing: "-.02em",
      margin: "8px 0 0"
    }
  }, "Equipe e plano")), /*#__PURE__*/React.createElement(Tabs, {
    tabs: [{
      value: "equipe",
      label: "Equipe",
      icon: "users"
    }, {
      value: "plano",
      label: "Plano e pagamento",
      icon: "credit-card"
    }, {
      value: "perfil",
      label: "Perfil",
      icon: "user"
    }],
    value: tab,
    onChange: setTab,
    variant: "underline"
  }), tab === "equipe" ? /*#__PURE__*/React.createElement(Panel, {
    title: "Membros e permiss\xF5es",
    action: /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      icon: "user-plus",
      iconRight: null
    }, "Convidar"),
    pad: 0,
    style: {
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement(DataTable, {
    columns: cols,
    rows: DB.members
  })) : null, tab === "plano" ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3,1fr)",
      gap: 16
    }
  }, [{
    n: "Pro",
    p: "R$ 1.490",
    f: ["1 número API", "5 usuários", "10 mil msgs/mês"],
    on: false
  }, {
    n: "Growth",
    p: "R$ 3.900",
    f: ["3 números API", "15 usuários", "50 mil msgs/mês", "Campanhas"],
    on: false
  }, {
    n: "Scale",
    p: "R$ 9.800",
    f: ["Números ilimitados", "Usuários ilimitados", "Volume sob medida", "IA dedicada + SLA"],
    on: true
  }].map(pl => /*#__PURE__*/React.createElement("div", {
    key: pl.n,
    className: "glass",
    style: {
      borderRadius: "var(--rc)",
      padding: 24,
      display: "flex",
      flexDirection: "column",
      gap: 16,
      border: pl.on ? "1px solid var(--border-cyan)" : "1px solid var(--gbo)",
      background: pl.on ? "var(--surface-cyan)" : "var(--gb)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15,
      fontWeight: 700
    }
  }, pl.n), pl.on ? /*#__PURE__*/React.createElement(Badge, {
    tone: "live",
    dot: true
  }, "Plano atual") : null), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "num",
    style: {
      fontSize: 30,
      fontWeight: 700
    }
  }, pl.p), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--t3)",
      fontSize: 13
    }
  }, " /m\xEAs")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, pl.f.map(f => /*#__PURE__*/React.createElement("span", {
    key: f,
    style: {
      display: "flex",
      gap: 8,
      fontSize: 13,
      color: "var(--t2)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 15,
    color: "var(--cyan)"
  }), f))), /*#__PURE__*/React.createElement(Button, {
    variant: pl.on ? "secondary" : "outline",
    iconRight: null,
    fullWidth: true
  }, pl.on ? "Gerenciar pagamento" : "Fazer upgrade")))) : null, tab === "perfil" ? /*#__PURE__*/React.createElement(Panel, {
    title: "Editar perfil",
    style: {
      maxWidth: 560
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 16,
      marginBottom: 4
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: DB.user.name,
    size: 64
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm",
    icon: "upload",
    iconRight: null
  }, "Trocar foto")), /*#__PURE__*/React.createElement(Input, {
    label: "Nome",
    value: DB.user.name,
    onChange: () => {}
  }), /*#__PURE__*/React.createElement(Input, {
    label: "E-mail",
    value: "marina@avraham.co",
    icon: "mail",
    onChange: () => {}
  }), /*#__PURE__*/React.createElement(Select, {
    label: "Fuso hor\xE1rio",
    options: ["America/Sao_Paulo (GMT-3)", "America/Fortaleza (GMT-3)"],
    onChange: () => {}
  }), /*#__PURE__*/React.createElement(Toggle, {
    checked: true,
    label: "Notifica\xE7\xF5es da IA no WhatsApp",
    description: "Receba um resumo quando a IA agendar ou fechar"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement(Button, {
    iconRight: null
  }, "Salvar altera\xE7\xF5es"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    iconRight: null
  }, "Cancelar"))) : null);
}
const SCREENS = {
  dashboard: Dashboard,
  funil: Funil,
  conversas: Conversas,
  instancias: Instancias,
  gamificacao: Gamificacao,
  config: Config
};

/* ---------------- App shell ---------------- */
function App() {
  const [screen, setScreen] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [org, setOrg] = useState(DB.orgs[0].id);
  const [theme, setTheme] = useState("light");
  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  React.useEffect(() => {
    relucide();
    const t = setTimeout(relucide, 120);
    return () => clearTimeout(t);
  }, [screen, collapsed, org]);
  const Screen = SCREENS[screen];
  const orgObj = DB.orgs.find(o => o.id === org);
  const brand = /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: collapsed ? "6px 0 14px" : "6px 8px 14px",
      justifyContent: collapsed ? "center" : "flex-start"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "g-flow",
    style: {
      width: 34,
      height: 34,
      borderRadius: 10,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flex: "0 0 auto",
      boxShadow: "var(--glow-cyan-soft)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "command",
    size: 19,
    color: "#04120e"
  })), !collapsed ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 20,
      fontWeight: 700,
      letterSpacing: "-.02em"
    }
  }, "Avraham") : null);
  const footer = collapsed ? /*#__PURE__*/React.createElement(IconButton, {
    icon: "life-buoy",
    label: "Suporte",
    variant: "outline"
  }) : /*#__PURE__*/React.createElement("div", {
    className: "glass",
    style: {
      borderRadius: 14,
      padding: 14,
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      fontSize: 12,
      fontWeight: 700
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "life-buoy",
    size: 15,
    color: "var(--cyan)"
  }), "Suporte interno"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--t3)",
      lineHeight: 1.5
    }
  }, "Resposta m\xE9dia em 4 min. Especialista Avraham dedicado."), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "outline",
    iconRight: null,
    icon: "message-square"
  }, "Abrir chamado"));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      height: "100vh",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement(SidebarNav, {
    items: NAV,
    value: screen,
    onChange: setScreen,
    collapsed: collapsed,
    header: brand,
    footer: footer,
    style: {
      background: "var(--gb)",
      backdropFilter: "var(--glass-blur)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 16,
      padding: "14px 28px",
      borderBottom: "1px solid var(--gbo)",
      background: "var(--gb)",
      backdropFilter: "var(--glass-blur)",
      flex: "0 0 auto"
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    icon: collapsed ? "panel-left-open" : "panel-left-close",
    label: "Menu",
    onClick: () => setCollapsed(c => !c)
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("select", {
    value: org,
    onChange: e => setOrg(e.target.value),
    style: {
      appearance: "none",
      background: "var(--gb)",
      border: "1px solid var(--gbo)",
      borderRadius: 999,
      padding: "8px 34px 8px 14px",
      color: "var(--t1)",
      font: "inherit",
      fontSize: 13,
      fontWeight: 700,
      cursor: "pointer"
    }
  }, DB.orgs.map(o => /*#__PURE__*/React.createElement("option", {
    key: o.id,
    value: o.id
  }, o.name))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      right: 12,
      top: "50%",
      transform: "translateY(-50%)",
      pointerEvents: "none"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevrons-up-down",
    size: 15,
    color: "var(--t3)"
  }))), /*#__PURE__*/React.createElement(Badge, {
    tone: "info",
    uppercase: false
  }, "Plano ", orgObj.plan), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      maxWidth: 380
    }
  }, /*#__PURE__*/React.createElement(Input, {
    icon: "search",
    placeholder: "Buscar contatos, neg\xF3cios, conversas..."
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: "auto",
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    icon: theme === "dark" ? "sun" : "moon",
    label: "Tema",
    variant: "outline",
    onClick: () => setTheme(t => t === "dark" ? "light" : "dark")
  }), /*#__PURE__*/React.createElement(IconButton, {
    icon: "bell",
    label: "Notifica\xE7\xF5es",
    variant: "outline"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      paddingLeft: 8,
      borderLeft: "1px solid var(--gbo)"
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: DB.user.name,
    size: 36,
    status: "online"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      lineHeight: 1.2
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700
    }
  }, DB.user.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--t3)"
    }
  }, "N\xEDvel ", DB.user.level, " \xB7 #1"))))), /*#__PURE__*/React.createElement("main", {
    style: {
      flex: 1,
      overflowY: "auto",
      padding: 28,
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 1,
      height: screen === "conversas" ? "100%" : "auto"
    }
  }, /*#__PURE__*/React.createElement(Screen, {
    go: setScreen
  })))));
}
ReactDOM.createRoot(document.getElementById("root")).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/crm/crm.jsx", error: String((e && e.message) || e) }); }

// ui_kits/crm/data.js
try { (() => {
/* Fictional but coherent data for the Avraham CRM command center. pt-BR. */
window.DB = {
  orgs: [{
    id: "clinix",
    name: "Clínix Saúde",
    plan: "Scale",
    leadsMonth: 5120
  }, {
    id: "solar",
    name: "SolarBras Energia",
    plan: "Growth",
    leadsMonth: 2840
  }, {
    id: "belle",
    name: "Belle Academia",
    plan: "Pro",
    leadsMonth: 1360
  }],
  user: {
    name: "Marina Duarte",
    role: "Head de Operações",
    level: 14,
    xp: 8420,
    xpNext: 10000,
    streak: 23
  },
  kpis: [{
    label: "Leads no mês",
    value: "5.120",
    delta: "+18%",
    deltaTone: "up",
    icon: "users",
    sub: "meta 4.800",
    tone: "emerald"
  }, {
    label: "Resposta da IA",
    value: "94",
    unit: "%",
    delta: "+6%",
    deltaTone: "up",
    icon: "bot",
    sub: "SLA < 30s"
  }, {
    label: "Receita no pipeline",
    value: "R$ 1,84M",
    delta: "+12%",
    deltaTone: "up",
    icon: "trending-up",
    sub: "62 negócios abertos"
  }, {
    label: "Reuniões agendadas",
    value: "148",
    delta: "-4%",
    deltaTone: "down",
    icon: "calendar-check",
    sub: "esta semana"
  }],
  flow: [{
    n: "01",
    icon: "inbox",
    label: "Entrada",
    detail: "Lead chega pelo WhatsApp",
    metric: "5.120",
    grad: "g-cyan"
  }, {
    n: "02",
    icon: "bot",
    label: "Atendimento IA",
    detail: "Resposta imediata 24/7",
    metric: "< 30s",
    grad: "g-teal"
  }, {
    n: "03",
    icon: "filter",
    label: "Qualificação",
    detail: "Score e objeções tratadas",
    metric: "71%",
    grad: "g-petrol"
  }, {
    n: "04",
    icon: "calendar-check",
    label: "Agendamento",
    detail: "Reunião marcada pela IA",
    metric: "148",
    grad: "g-purp"
  }, {
    n: "05",
    icon: "handshake",
    label: "Vendedor",
    detail: "Chega preparado",
    metric: "R$ 1,84M",
    grad: "g-green"
  }],
  stages: [{
    key: "novo",
    label: "Novos",
    tint: "var(--cyan)"
  }, {
    key: "qualif",
    label: "Qualificação IA",
    tint: "var(--teal)"
  }, {
    key: "reuniao",
    label: "Reunião",
    tint: "var(--purp-light)"
  }, {
    key: "proposta",
    label: "Proposta",
    tint: "var(--status-warn)"
  }, {
    key: "ganho",
    label: "Ganho",
    tint: "var(--green)"
  }],
  leads: [{
    id: 1,
    stage: "novo",
    title: "Ana Ribeiro",
    company: "Ortoclin",
    value: "R$ 24.000",
    score: 82,
    owner: "IA Avraham",
    tags: ["Plano Scale", "Inbound"],
    channel: "WhatsApp",
    age: "2 min"
  }, {
    id: 2,
    stage: "novo",
    title: "Marcos Vale",
    company: "AutoPeças Vale",
    value: "R$ 9.500",
    score: 47,
    owner: "IA Avraham",
    tags: ["Frio"],
    channel: "WhatsApp",
    age: "8 min"
  }, {
    id: 3,
    stage: "novo",
    title: "Júlia Nunes",
    company: "Studio JN",
    value: "R$ 6.200",
    score: 38,
    owner: "IA Avraham",
    tags: ["Reativação"],
    channel: "WhatsApp",
    age: "22 min"
  }, {
    id: 4,
    stage: "qualif",
    title: "Pedro Lemos",
    company: "Lemos Log",
    value: "R$ 42.000",
    score: 76,
    owner: "Rafael S.",
    tags: ["Enterprise"],
    channel: "WhatsApp",
    age: "1 h"
  }, {
    id: 5,
    stage: "qualif",
    title: "Camila Reis",
    company: "Reis & Cia",
    value: "R$ 18.300",
    score: 68,
    owner: "IA Avraham",
    tags: ["Upsell"],
    channel: "WhatsApp",
    age: "3 h"
  }, {
    id: 6,
    stage: "reuniao",
    title: "Diego Alves",
    company: "TechMoveis",
    value: "R$ 55.000",
    score: 88,
    owner: "Marina D.",
    tags: ["Hot", "Demo agendada"],
    channel: "WhatsApp",
    age: "ontem"
  }, {
    id: 7,
    stage: "reuniao",
    title: "Fernanda Sá",
    company: "Belle Academia",
    value: "R$ 31.000",
    score: 79,
    owner: "Rafael S.",
    tags: ["Renovação"],
    channel: "WhatsApp",
    age: "ontem"
  }, {
    id: 8,
    stage: "proposta",
    title: "Bruno Costa",
    company: "SolarBras",
    value: "R$ 128.000",
    score: 91,
    owner: "Marina D.",
    tags: ["Enterprise", "Multi-unidade"],
    channel: "WhatsApp",
    age: "2 d"
  }, {
    id: 9,
    stage: "ganho",
    title: "Letícia Amaral",
    company: "Clínix Saúde",
    value: "R$ 96.000",
    score: 95,
    owner: "Marina D.",
    tags: ["Fechado", "Anual"],
    channel: "WhatsApp",
    age: "3 d"
  }],
  conversations: [{
    id: 1,
    name: "Ana Ribeiro",
    company: "Ortoclin",
    last: "Perfeito, pode marcar para quinta então.",
    time: "agora",
    unread: 2,
    ai: true,
    score: 82,
    status: "online",
    channel: "API oficial"
  }, {
    id: 2,
    name: "Marcos Vale",
    company: "AutoPeças Vale",
    last: "Quanto custa o plano mais básico?",
    time: "8 min",
    unread: 1,
    ai: true,
    score: 47,
    status: "online",
    channel: "API oficial"
  }, {
    id: 3,
    name: "Diego Alves",
    company: "TechMoveis",
    last: "Você: envio a proposta hoje ainda.",
    time: "1 h",
    unread: 0,
    ai: false,
    score: 88,
    status: "busy",
    channel: "API oficial"
  }, {
    id: 4,
    name: "Camila Reis",
    company: "Reis & Cia",
    last: "IA: material enviado, aguardando retorno.",
    time: "3 h",
    unread: 0,
    ai: true,
    score: 68,
    status: "offline",
    channel: "Não oficial"
  }, {
    id: 5,
    name: "Bruno Costa",
    company: "SolarBras",
    last: "Fechado. Assino amanhã de manhã.",
    time: "ontem",
    unread: 0,
    ai: false,
    score: 91,
    status: "offline",
    channel: "API oficial"
  }],
  thread: [{
    from: "contact",
    author: "Ana",
    time: "09:41",
    text: "Oi! Vi o anúncio de vocês sobre atendimento com IA. Como funciona?"
  }, {
    from: "agent",
    agent: true,
    time: "09:41",
    status: "read",
    text: "Olá, Ana! A gente estrutura o WhatsApp da sua clínica para atender, qualificar e agendar automaticamente. Posso te fazer 2 perguntas rápidas para entender o cenário?"
  }, {
    from: "contact",
    author: "Ana",
    time: "09:42",
    text: "Pode sim."
  }, {
    from: "agent",
    agent: true,
    time: "09:42",
    status: "read",
    text: "Quantos leads a Ortoclin recebe por mês, em média, e quantas pessoas atendem hoje?"
  }, {
    from: "contact",
    author: "Ana",
    time: "09:44",
    text: "Uns 5 mil por mês. Só tenho 3 atendentes e não damos conta."
  }, {
    from: "agent",
    agent: true,
    time: "09:44",
    status: "read",
    text: "Faz total sentido. Com esse volume, a IA responde na hora, qualifica e já agenda as consultas nos horários livres. Quer ver uma demo com um consultor na quinta?"
  }, {
    from: "contact",
    author: "Ana",
    time: "09:46",
    text: "Perfeito, pode marcar para quinta então."
  }],
  instances: [{
    id: 1,
    number: "+55 11 99123-4400",
    label: "Clínix - Comercial",
    type: "API oficial",
    status: "live",
    health: 98,
    messages: "12.4k",
    tps: "80 msg/s"
  }, {
    id: 2,
    number: "+55 11 99123-4401",
    label: "Clínix - Suporte",
    type: "API oficial",
    status: "live",
    health: 95,
    messages: "8.1k",
    tps: "80 msg/s"
  }, {
    id: 3,
    number: "+55 11 98877-2210",
    label: "SolarBras - Vendas",
    type: "API oficial",
    status: "warn",
    health: 72,
    messages: "5.6k",
    tps: "40 msg/s"
  }, {
    id: 4,
    number: "+55 11 97654-1180",
    label: "Belle - Campanhas",
    type: "Não oficial",
    status: "warn",
    health: 64,
    messages: "3.2k",
    tps: "burst"
  }, {
    id: 5,
    number: "+55 11 96543-0090",
    label: "Reativação - Pool",
    type: "Não oficial",
    status: "danger",
    health: 31,
    messages: "1.1k",
    tps: "limitado"
  }],
  team: [{
    name: "Marina Duarte",
    role: "Head de Operações",
    points: 9840,
    deals: 18,
    level: 14,
    you: true
  }, {
    name: "Rafael Souza",
    role: "Closer",
    points: 8710,
    deals: 22,
    level: 12
  }, {
    name: "Beatriz Lima",
    role: "SDR",
    points: 7320,
    deals: 9,
    level: 11
  }, {
    name: "Caio Mendes",
    role: "SDR",
    points: 6180,
    deals: 7,
    level: 9
  }, {
    name: "IA Avraham",
    role: "Agente autônomo",
    points: 5940,
    deals: 41,
    level: 8,
    ai: true
  }],
  goals: [{
    label: "Receita fechada (mês)",
    value: 1240,
    max: 2000,
    unit: "R$ mil",
    tone: "flow"
  }, {
    label: "Reuniões qualificadas",
    value: 148,
    max: 180,
    unit: "reuniões",
    tone: "emerald"
  }, {
    label: "Taxa de resposta < 30s",
    value: 94,
    max: 100,
    unit: "%",
    tone: "emerald"
  }, {
    label: "Base reativada",
    value: 62000,
    max: 100000,
    unit: "contatos",
    tone: "lavender"
  }],
  challenges: [{
    icon: "bolt",
    title: "Sprint de reativação",
    detail: "Reative 10 mil contatos até sexta",
    progress: 68,
    reward: "+400 XP"
  }, {
    icon: "target",
    title: "Zero lead sem resposta",
    detail: "Mantenha SLA < 30s por 7 dias",
    progress: 85,
    reward: "+250 XP"
  }, {
    icon: "flame",
    title: "Ofensiva de propostas",
    detail: "Envie 20 propostas nesta semana",
    progress: 45,
    reward: "+300 XP"
  }],
  achievements: [{
    icon: "rocket",
    title: "Primeira operação no ar",
    detail: "Instância conectada",
    state: "earned"
  }, {
    icon: "medal",
    title: "Fechou R$ 1M",
    detail: "Receita acumulada",
    state: "earned"
  }, {
    icon: "bot",
    title: "IA autônoma",
    detail: "500 qualificações pela IA",
    state: "earned"
  }, {
    icon: "flame",
    title: "Ofensiva de 30 dias",
    detail: "23/30 dias ativos",
    state: "locked",
    progress: 76
  }, {
    icon: "crown",
    title: "Topo do ranking",
    detail: "Seja #1 do mês",
    state: "locked",
    progress: 92
  }, {
    icon: "gem",
    title: "Base de 100k",
    detail: "Reative 100 mil contatos",
    state: "locked",
    progress: 62
  }],
  tasks: [{
    text: "Enviar proposta - SolarBras (R$ 128k)",
    done: false,
    due: "Hoje 15:00",
    tone: "warn"
  }, {
    text: "Ligar para Diego Alves - TechMoveis",
    done: false,
    due: "Hoje 16:30"
  }, {
    text: "Revisar script da IA - clínicas",
    done: true,
    due: "Ontem"
  }, {
    text: "Aprovar campanha de reativação Belle",
    done: false,
    due: "Amanhã"
  }],
  members: [{
    name: "Marina Duarte",
    email: "marina@avraham.co",
    role: "Admin",
    status: "Ativo"
  }, {
    name: "Rafael Souza",
    email: "rafael@avraham.co",
    role: "Closer",
    status: "Ativo"
  }, {
    name: "Beatriz Lima",
    email: "bia@avraham.co",
    role: "SDR",
    status: "Ativo"
  }, {
    name: "Caio Mendes",
    email: "caio@avraham.co",
    role: "SDR",
    status: "Convite pendente"
  }]
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/crm/data.js", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Eyebrow = __ds_scope.Eyebrow;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.IconTile = __ds_scope.IconTile;

__ds_ns.Pill = __ds_scope.Pill;

__ds_ns.SectionHeading = __ds_scope.SectionHeading;

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.AvatarGroup = __ds_scope.AvatarGroup;

__ds_ns.DataTable = __ds_scope.DataTable;

__ds_ns.ProgressBar = __ds_scope.ProgressBar;

__ds_ns.ScoreRing = __ds_scope.ScoreRing;

__ds_ns.StatTile = __ds_scope.StatTile;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Tabs = __ds_scope.Tabs;

__ds_ns.Toggle = __ds_scope.Toggle;

__ds_ns.AchievementBadge = __ds_scope.AchievementBadge;

__ds_ns.ChatMessage = __ds_scope.ChatMessage;

__ds_ns.ChecklistItem = __ds_scope.ChecklistItem;

__ds_ns.KanbanCard = __ds_scope.KanbanCard;

__ds_ns.NumberedCard = __ds_scope.NumberedCard;

__ds_ns.SidebarNav = __ds_scope.SidebarNav;

__ds_ns.SolutionCard = __ds_scope.SolutionCard;

})();
