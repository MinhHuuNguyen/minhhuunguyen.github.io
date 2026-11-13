/** Ba bản PDF của CV: link cũ `/resume.pdf` và `/resume-full.pdf` (bản ATS) vẫn giữ nguyên tên. */
export const RESUME_PDFS = [
  { variant: "ats", file: "/resume.pdf", label: "resume.atsShort" },
  { variant: "ats_full", file: "/resume-full.pdf", label: "resume.atsFull" },
  { variant: "designed", file: "/resume-designed.pdf", label: "resume.designed" },
] as const;
