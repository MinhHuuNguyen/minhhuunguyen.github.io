import { DefaultSeoProps } from "next-seo";

const SEO: DefaultSeoProps = {
  title: "MinhHuuNguyen",
  description: "MinhHuuNguyen",
  titleTemplate: "%s | MinhHuuNguyen",
  openGraph: {
    type: "website",
    locale: "en",
    url: "https://minhhuunguyen.github.io",
    siteName: "MinhHuuNguyen",
  },
  twitter: {
    cardType: "summary_large_image",
  },
};

export { SEO };
