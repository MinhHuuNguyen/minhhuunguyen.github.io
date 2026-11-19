import Head from "next/head";
import { ResumeAts } from "@/features/resume/ResumeAts";
import { withLocale } from "@/lib/with-locale";

/** Bản in ATS: chỉ dùng để sinh PDF, không lập chỉ mục và không có bản /en. */
export default function ResumePrint() {
  return (
    <>
      <Head>
        <title>Nguyen Huu Minh - Resume</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <ResumeAts />
    </>
  );
}

export const getStaticProps = withLocale("en");
