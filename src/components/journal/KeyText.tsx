import { keyTerms } from "@/content";

// Renders content text with **key term** markers. IM Fell English has no bold, so key terms are
// italic (DESIGN.md, The Italic Emphasis Rule) and stay <strong> for meaning.

export function KeyText({ text }: { text: string }) {
  return (
    <>
      {keyTerms(text).map((part, i) =>
        part.key ? (
          <strong key={i} className="font-normal italic">
            {part.value}
          </strong>
        ) : (
          part.value
        ),
      )}
    </>
  );
}
