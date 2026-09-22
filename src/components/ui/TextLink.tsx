import Link from "next/link";
import type { ComponentProps } from "react";

// Inline link in running text. Ink underline that turns to the surface accent on hover.

type TextLinkProps = Omit<ComponentProps<"a">, "href"> & {
  href: string;
  external?: boolean;
};

const classes =
  "underline decoration-(--surface-fg)/45 underline-offset-[0.22em] transition-colors duration-(--dur-hover) ease-journal " +
  "hover:text-(--surface-accent) hover:decoration-(--surface-accent)";

export function TextLink({
  href,
  external,
  className = "",
  children,
  ...rest
}: TextLinkProps) {
  const isExternal = external ?? /^(https?:|mailto:)/.test(href);
  if (!isExternal) {
    return (
      <Link href={href} className={`${classes} ${className}`} {...rest}>
        {children}
      </Link>
    );
  }
  const newTab = href.startsWith("http");
  return (
    <a
      href={href}
      className={`${classes} ${className}`}
      {...(newTab ? { target: "_blank", rel: "noreferrer" } : {})}
      {...rest}
    >
      {children}
      {newTab ? <span className="sr-only"> (opens in a new tab)</span> : null}
    </a>
  );
}
