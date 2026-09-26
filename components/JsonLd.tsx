import { buildJsonLd } from "@/lib/site";

export function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(buildJsonLd()).replace(/</g, "\\u003c"),
      }}
    />
  );
}
