import Head from "next/head";
import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { PillButton, IconCircle } from "@/components/ui/Button";
import { SectionLabel, TagChip } from "@/components/ui/Chip";
import { GridFrame } from "@/components/ui/GridFrame";
import { Reveal } from "@/components/ui/Reveal";
import { CountUp } from "@/components/ui/CountUp";
import { Marquee } from "@/components/ui/Marquee";
import { RotatingBadge } from "@/components/ui/RotatingBadge";
import { BrandIcon, type BrandName } from "@/components/ui/Icons";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Menu } from "@/components/ui/Dropdown";
import { Sheet } from "@/components/ui/Sheet";

const BRANDS: BrandName[] = ["linkedin", "github", "facebook", "youtube", "tiktok"];

function Block({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section data-sg={id} className="py-8">
      <h2 className="mb-4 text-xl font-bold">{title}</h2>
      {children}
    </section>
  );
}

export default function Styleguide() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Head>
        <title>Styleguide</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <Container as="main" className="py-10">
        <h1 className="text-service">Styleguide</h1>
        <Block id="pill-buttons" title="PillButton">
          <div className="flex flex-wrap items-center gap-4 rounded-hero bg-hero p-6">
            <PillButton href="/" variant="dark">Xem thêm</PillButton>
            <PillButton href="/" variant="light" icon="download">Tải CV</PillButton>
            <PillButton href="/" variant="blue" icon="chat" size="lg">Trò chuyện</PillButton>
            <PillButton variant="glass" icon="none" onClick={() => undefined}>Glass</PillButton>
            <IconCircle label="Mở menu" onClick={() => undefined}>+</IconCircle>
          </div>
        </Block>
        <Block id="chips" title="Chip">
          <div className="flex flex-wrap items-center gap-3">
            <SectionLabel>Giới thiệu</SectionLabel>
            <span className="rounded-hero bg-ink-800 p-2"><SectionLabel tone="dark">About</SectionLabel></span>
            <TagChip>Python</TagChip>
            <TagChip>Machine Learning</TagChip>
          </div>
        </Block>
        <Block id="grid-frame" title="GridFrame">
          <GridFrame cols={4} rows={2} crosshair="accent" tone="onBlue" className="rounded-hero bg-hero-soft bg-blue-900 p-10">
            <p className="text-white">Khung lưới trên nền xanh</p>
          </GridFrame>
        </Block>
        <Block id="count-up" title="CountUp">
          <div className="flex gap-10 text-stat text-blue-500">
            <CountUp value="7+" />
            <CountUp value="83" />
            <CountUp value="~1.5k" />
          </div>
          <Reveal delay={100}><p className="mt-4">Khối reveal</p></Reveal>
        </Block>
        <Block id="marquee" title="Marquee">
          <Marquee label="Công nghệ" items={["Python", "PyTorch", "Spark", "Databricks", "AWS"].map((x) => <TagChip key={x}>{x}</TagChip>)} />
        </Block>
        <Block id="rotating-badge" title="RotatingBadge">
          <div className="inline-block rounded-hero bg-blue-900 p-4 text-white">
            <RotatingBadge text="Liên hệ • Contact • Liên hệ • Contact • " href="/" label="Liên hệ" />
          </div>
        </Block>
        <Block id="brand-icons" title="BrandIcon">
          <div className="flex gap-4">
            {BRANDS.map((b) => (
              <a key={b} href="https://example.com" aria-label={b}><BrandIcon name={b} /></a>
            ))}
          </div>
        </Block>
        <Block id="section-heading" title="SectionHeading">
          <SectionHeading label="Câu chuyện" lead={{ strong: "Tôi xây dựng hệ thống dữ liệu và AI.", muted: "Từ nghiên cứu đến sản phẩm." }} />
        </Block>
        <Block id="overlays" title="Menu và Sheet">
          <div className="flex gap-4">
            <Menu trigger={<button type="button" className="rounded-pill bg-white px-4 py-2 shadow-card">Menu</button>}>
              <Menu.Item>Tiếng Việt</Menu.Item>
              <Menu.Item>English</Menu.Item>
            </Menu>
            <button type="button" className="rounded-pill bg-white px-4 py-2 shadow-card" onClick={() => setOpen(true)}>Mở Sheet</button>
          </div>
          <Sheet side="right" open={open} onOpenChange={setOpen} title="Sheet">
            <p>Nội dung mẫu</p>
          </Sheet>
        </Block>
      </Container>
    </>
  );
}
