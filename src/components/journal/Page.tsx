import type { ComponentProps, ReactNode } from "react";
import type { HtmlTag } from "@/lib/html-tag";

// One journal page: aged paper with scorched edges and a shadow where it curves into the spine.
// `spine` says which edge is bound; "left-then-right" is the left page of a spread, bound on the
// left while pages stack (tablet and phone) and on the right once they sit side by side (lg).

type Spine = "left" | "right" | "left-then-right" | "none";

type PageProps = {
  as?: HtmlTag;
  spine?: Spine;
  children: ReactNode;
  className?: string;
} & Omit<ComponentProps<"div">, "children" | "className">;

const gutter = "pointer-events-none absolute inset-y-0 w-10 md:w-16";
const toSpineLeft =
  "left-0 bg-linear-to-r from-leather/30 via-leather/8 to-transparent";
const toSpineRight =
  "right-0 bg-linear-to-l from-leather/30 via-leather/8 to-transparent";

export function Page({
  as: Tag = "div",
  spine = "none",
  children,
  className = "",
  ...rest
}: PageProps) {
  return (
    <Tag
      className={`paper burn relative min-w-0 px-6 py-10 md:px-12 md:py-14 ${className}`}
      {...rest}
    >
      {spine === "left" ? (
        <span aria-hidden className={`${gutter} ${toSpineLeft}`} />
      ) : null}
      {spine === "right" ? (
        <span aria-hidden className={`${gutter} ${toSpineRight}`} />
      ) : null}
      {spine === "left-then-right" ? (
        <>
          <span aria-hidden className={`${gutter} ${toSpineLeft} lg:hidden`} />
          <span
            aria-hidden
            className={`${gutter} ${toSpineRight} hidden lg:block`}
          />
        </>
      ) : null}
      <div className="relative">{children}</div>
    </Tag>
  );
}
