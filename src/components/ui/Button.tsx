import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

// A printed ticket: square, with an inner hairline rule like a letterpress border.
// Colors come from the surface it sits on (paper, night, leather), see globals.css.

type Variant = "solid" | "outline";

const base =
  "group relative inline-flex items-center justify-center gap-2.5 whitespace-nowrap px-6 py-3.5 font-body text-small leading-none uppercase tracking-(--tracking-caps) " +
  "transition-[translate,background-color,border-color,color,box-shadow] duration-(--dur-hover) ease-journal " +
  "before:pointer-events-none before:absolute before:inset-1 before:border before:content-[''] " +
  "motion-safe:hover:-translate-y-0.5 active:translate-y-px " +
  "disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:translate-y-0";

const variants: Record<Variant, string> = {
  solid:
    "border border-transparent bg-(--surface-solid) text-(--surface-on-solid) before:border-(--surface-on-solid)/40 " +
    "hover:bg-(--surface-solid-hover) hover:shadow-lifted disabled:hover:bg-(--surface-solid) disabled:hover:shadow-none",
  outline:
    "border border-(--surface-fg) text-(--surface-fg) before:border-(--surface-fg)/25 " +
    "hover:border-(--surface-accent) hover:text-(--surface-accent) hover:before:border-(--surface-accent)/40",
};

type Common = {
  variant?: Variant;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
};

type ButtonAsButton = Common &
  Omit<ComponentProps<"button">, keyof Common> & { href?: undefined };
type ButtonAsLink = Common &
  Omit<ComponentProps<"a">, keyof Common> & {
    href: string;
    /** Route transition types for internal links (src/lib/page-turn.ts). */
    transitionTypes?: string[];
  };

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { variant = "solid", icon, children, className = "", ...rest } = props;
  const classes = `${base} ${variants[variant]} ${className}`;
  const content = (
    <>
      <span>{children}</span>
      {icon ? (
        <span className="ease-journal transition-transform duration-(--dur-hover) motion-safe:group-hover:translate-x-0.5">
          {icon}
        </span>
      ) : null}
    </>
  );

  if (typeof rest.href === "string") {
    const { href, transitionTypes, ...anchor } = rest as ButtonAsLink;
    const internal = href.startsWith("/") || href.startsWith("#");
    return internal ? (
      <Link
        href={href}
        transitionTypes={transitionTypes}
        className={classes}
        {...anchor}
      >
        {content}
      </Link>
    ) : (
      <a href={href} className={classes} {...anchor}>
        {content}
      </a>
    );
  }

  const { type = "button", ...button } = rest as ButtonAsButton;
  return (
    <button type={type} className={classes} {...button}>
      {content}
    </button>
  );
}
