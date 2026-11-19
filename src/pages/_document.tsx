import Document, { Html, Head, Main, NextScript } from 'next/document'
import { localeOf } from '@/lib/locale-routes.mjs'
import { SESSION_HANDOFF_SCRIPT } from '@/lib/comments.mjs'

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
        {/* giscus: chuyển phiên đăng nhập (?giscus=…) vào localStorage và xóa khỏi URL trước khi GA/AdSense đọc URL */}
        <script dangerouslySetInnerHTML={{ __html: SESSION_HANDOFF_SCRIPT }} />
        {/* Google AdSense: script chỉ nạp ở trang bài (AdsScript); ở đây giữ meta xác minh */}
        <meta name="google-adsense-account" content={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_PUBLISHER_ID}></meta>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
}
