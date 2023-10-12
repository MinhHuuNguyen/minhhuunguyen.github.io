import { DefaultSeoProps } from "next-seo";

const SEO: DefaultSeoProps = {
  title: "Khoảng trời cho bé",
  description: "Khoảng trời cho bé",
  titleTemplate: "%s | Khoảng trời cho bé",
  openGraph: {
    type: "website",
    locale: "en",
    // url: 'https://nextjs-core-project.vercel.app',
    // siteName: 'Nextjs Core Project',
  },
  twitter: {
    handle: "@handle",
    site: "@site",
    cardType: "summary_large_image",
  },
};

export { SEO };
