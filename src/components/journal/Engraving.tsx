import Image, { type StaticImageData } from "next/image";

// A public-domain engraving shown as the print itself (D45): a grayscale plate whose paper tone
// was lifted to white, multiplied onto the page so only the ink remains. Always credited.

type EngravingProps = {
  src: StaticImageData | string;
  alt: string;
  width: number;
  height: number;
  /** Caption: title, artist, date. The source link lives in docs/08-assets.md and the colophon. */
  caption?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
};

export function Engraving({
  src,
  alt,
  width,
  height,
  caption,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority = false,
  className = "",
}: EngravingProps) {
  return (
    <figure className={className}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        priority={priority}
        className="h-auto w-full mix-blend-multiply sepia-[0.35]"
      />
      {caption ? (
        <figcaption className="font-note text-lead text-ink-soft mt-3">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
