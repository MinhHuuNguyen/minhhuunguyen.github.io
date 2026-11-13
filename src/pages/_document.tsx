import Document, { Html, Head, Main, NextScript } from 'next/document'
import { localeOf } from '@/lib/locale-routes.mjs'
import Script from 'next/script'

export default class MyDocument extends Document {
  render() {
  const lang = localeOf(this.props.__NEXT_DATA__.page)
  return (
    <Html lang={lang} className="no-js">
      <Head>
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.replace('no-js','js');`,
          }}
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.6.5/flowbite.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.css"
          integrity="sha512-wR4oNhLBHf7smjy0K4oqzdWumd+r5/+6QO/vDda76MW5iug4PT7v86FoEkySIJft3XA0Ae6axhIvHrqwm793Nw=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css"
          integrity="sha512-KfkfwYDsLkIlwQp6LFnl8zNdLGxu9YAA1QvwINks4PhcElQSvqcyVLLD9aMhXd13uQjoXtEKNosOWaZqXgel0g=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;700&family=Raleway:wght@300;400;500;700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css"
          crossOrigin="anonymous"
        />
        {/* Google AdSense: script chỉ nạp ở trang bài (AdsScript); ở đây giữ meta xác minh */}
        <meta name="google-adsense-account" content={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_PUBLISHER_ID}></meta>
      </Head>
      <body>
        <Main />
        <NextScript />
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.6.5/flowbite.min.js"></Script>
      </body>
    </Html>
  )
}
}
