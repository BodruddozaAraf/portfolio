import type { MDXComponents } from "mdx/types";
import type { ComponentProps } from "react";
import { Compare, Figures, Ledger } from "@/components/case-study/Ledger";
import { TextLink } from "@/components/ui/TextLink";

// Markdown elements in the journal's type (DESIGN.md). IM Fell English has no bold, so **strong**
// keeps its meaning but renders italic (The Italic Emphasis Rule).

const components: MDXComponents = {
  // case-study building blocks, usable in any .mdx without an import
  Ledger,
  Figures,
  Compare,
  h2: (props) => (
    <h2
      className="font-display text-h2 tracking-poster mt-16 mb-5 uppercase first:mt-0"
      {...props}
    />
  ),
  h3: (props) => <h3 className="text-h3 mt-10 mb-3" {...props} />,
  h4: (props) => <h4 className="text-h4 mt-8 mb-2" {...props} />,
  p: (props) => <p className="my-5 max-w-(--measure)" {...props} />,
  a: ({ href = "", ...props }: ComponentProps<"a">) => (
    <TextLink href={href} {...props} />
  ),
  strong: (props) => <strong className="font-normal italic" {...props} />,
  em: (props) => <em className="italic" {...props} />,
  ul: (props) => (
    <ul
      className="marker:text-ink-soft my-5 max-w-(--measure) list-disc space-y-2 pl-6"
      {...props}
    />
  ),
  ol: (props) => (
    <ol
      className="marker:font-type marker:text-ink-soft my-5 max-w-(--measure) list-decimal space-y-2 pl-6"
      {...props}
    />
  ),
  blockquote: (props) => (
    <blockquote
      className="border-ink/40 text-lead my-8 max-w-(--measure) border-l pl-5 italic"
      {...props}
    />
  ),
  hr: () => <hr className="border-ink/15 my-12" />,
  code: (props) => <code className="font-code text-[0.9em]" {...props} />,
  // focusable, so a keyboard can scroll a code block wider than the column (WCAG 2.1.1)
  pre: (props) => (
    <pre
      tabIndex={0}
      className="paper-dark text-small shadow-pasted my-6 max-w-full overflow-x-auto p-5 leading-relaxed"
      {...props}
    />
  ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
