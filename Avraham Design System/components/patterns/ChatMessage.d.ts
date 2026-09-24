import * as React from "react";

/** WhatsApp-style bubble used in the shared inbox and the site's live-agent mockup. */
export interface ChatMessageProps {
  children: React.ReactNode;
  /** "contact" = inbound (white, left); "agent" = outbound (emerald tint, right). */
  from?: "contact" | "agent";
  author?: string;
  time?: string;
  /** Delivery ticks on outbound messages. */
  status?: "sent" | "read";
  /** Flags the message as written by the AI agent rather than a human. */
  agent?: boolean;
  style?: React.CSSProperties;
}
export declare function ChatMessage(props: ChatMessageProps): JSX.Element;
