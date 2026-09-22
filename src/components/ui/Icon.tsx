import type {
  Icon as PhosphorIcon,
  IconProps as PhosphorIconProps,
} from "@phosphor-icons/react";

// One icon family, one weight (D27). Pass an icon from "@phosphor-icons/react/ssr".
const ICON_WEIGHT = "regular" satisfies PhosphorIconProps["weight"];

type IconProps = Omit<PhosphorIconProps, "weight"> & {
  icon: PhosphorIcon;
  /** Accessible name. Omit for decorative icons next to a text label. */
  label?: string;
};

export function Icon({
  icon: Glyph,
  label,
  size = "1.25em",
  ...rest
}: IconProps) {
  return (
    <Glyph
      weight={ICON_WEIGHT}
      size={size}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? "img" : undefined}
      focusable="false"
      {...rest}
    />
  );
}
