import Head from "next/head";

type Props = { data: Record<string, unknown>[] };

// Renders each object as <script type="application/ld+json"> in <head>; "<" is escaped so the JSON cannot close the tag.
export default function JsonLd({ data }: Props) {
  return (
    <Head>
      {data.map((obj, i) => (
        <script
          key={`jsonld-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(obj).replace(/</g, "\\u003c") }}
        />
      ))}
    </Head>
  );
}
