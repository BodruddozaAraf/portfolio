import { education, profile } from "@/content";
import { SITE_URL } from "@/lib/site";

// schema.org Person for search engines (docs/04-architecture.md, SEO). No phone, ever (D4).
export function PersonJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.title,
    description: profile.summary,
    url: SITE_URL,
    email: `mailto:${profile.email}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dhaka",
      addressCountry: "BD",
    },
    alumniOf: { "@type": "CollegeOrUniversity", name: education.institution },
    knowsLanguage: profile.spokenLanguages.map((l) => l.name),
    sameAs: [profile.links.github.href, profile.links.linkedin.href],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
