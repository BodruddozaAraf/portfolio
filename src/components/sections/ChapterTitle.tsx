import type { ReactNode } from "react";

// A chapter heading: Rye caps at the h2 step. No eyebrow, no number (D33); an optional standfirst
// sits below it in the lead size.

type ChapterTitleProps = {
  id: string;
  children: ReactNode;
  standfirst?: ReactNode;
  className?: string;
};

export function ChapterTitle({
  id,
  children,
  standfirst,
  className = "",
}: ChapterTitleProps) {
  return (
    <div className={`mb-12 max-w-(--measure) md:mb-16 ${className}`}>
      <h2 id={id} className="font-display text-h2 tracking-poster uppercase">
        {children}
      </h2>
      {standfirst ? (
        <p className="text-lead mt-4 italic opacity-85">{standfirst}</p>
      ) : null}
    </div>
  );
}
