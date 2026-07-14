/**
 * Renders a JSON-LD structured-data block. Search engines read this to build
 * rich results (org knowledge panel, sitelinks search box, article cards).
 *
 * The payload is serialized server-side into a <script type="application/ld+json">.
 * We intentionally use dangerouslySetInnerHTML because JSON-LD must be raw JSON
 * text inside the script tag, not React-escaped children. Input is our own
 * static/site-controlled data, never user input.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
