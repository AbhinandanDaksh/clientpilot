import type { ReactNode } from "react";

export default function ScreenHeader({ eyebrow, title, description, actions }: { eyebrow: string; title: string; description: string; actions?: ReactNode }) {
  return <header className="flex flex-wrap items-end justify-between gap-4 pt-3">
    <div><p className="mb-3 text-[12px] font-medium tracking-[1.8px] text-dash-muted">{eyebrow}</p><h1 className="text-[32px] font-semibold tracking-[-1px]">{title}</h1><p className="mt-3 text-sm leading-6 text-dash-muted">{description}</p></div>
    <div className="flex flex-wrap items-center gap-2">{actions}</div>
  </header>;
}
