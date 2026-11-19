import { PillButton } from "@/components/ui/Button";
import { useChat } from "@/features/chat/ChatProvider";
import { useI18n } from "@/libs/i18n/I18nContext";
import { SITE } from "@/lib/seo.mjs";

/** Nút mở chat kèm ngữ cảnh bài đang đọc. */
export function AskAboutPost({ slug, title }: { slug: string; title: string }) {
  const { t } = useI18n();
  const { openChat } = useChat();
  return (
    <PillButton
      variant="blue"
      icon="chat"
      onClick={() => openChat({ location: "post", context: { type: "post", slug, title, url: `${SITE}/blog/${slug}` } })}
    >
      {t("post.ask")}
    </PillButton>
  );
}
