import * as React from "react";

/** Initial-based avatar with optional presence dot. Photos are optional; initials are the default. */
export interface AvatarProps {
  name?: string;
  src?: string;
  size?: number;
  tone?: "emerald" | "lavender" | "neutral";
  status?: "online" | "busy" | "offline";
  style?: React.CSSProperties;
}
export declare function Avatar(props: AvatarProps): JSX.Element;

export interface AvatarGroupProps {
  people: Array<{ name: string; src?: string }>;
  size?: number;
  /** Overflow becomes a +N chip. */
  max?: number;
  style?: React.CSSProperties;
}
export declare function AvatarGroup(props: AvatarGroupProps): JSX.Element;
