// The canonical origin (D11, D12). Every absolute URL in metadata, the sitemap and JSON-LD
// is built from this.
export const SITE_URL = "https://bodruddozaaraf.me";

// Page-level openGraph objects replace the root one instead of merging with it, so every page
// that sets its own spreads this base to keep the image and site name.
export const openGraphBase = {
  siteName: "Bodruddoza Araf",
  locale: "en_US",
  images: [
    {
      url: "/opengraph-image.jpg",
      width: 1200,
      height: 630,
      alt: "Bodruddoza Araf, Full-Stack and AI/ML Engineer: a wanted-poster card beside a Winslow Homer engraving of a campfire camp",
    },
  ],
};

/** A page's own share card (public/og/<name>.jpg, rendered by scripts/brand/og.mjs, D78). */
export function shareCard(name: string, alt: string) {
  return [{ url: `/og/${name}.jpg`, width: 1200, height: 630, alt }];
}
