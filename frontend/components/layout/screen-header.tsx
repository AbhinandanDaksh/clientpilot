import type { ReactNode } from "react";
import { LuSparkles } from "react-icons/lu";

export default function ScreenHeader({ eyebrow, title, description, actions }: { eyebrow: string; title: string; description: string; actions?: ReactNode }) {
  return <header className="flex flex-wrap items-end justify-between gap-4 pt-3">
    <div><p className="mb-3 text-[10px] font-medium tracking-[1.8px] text-dash-muted">{eyebrow}</p><h1 className="text-[32px] font-semibold tracking-[-1px]">{title}</h1><p className="mt-3 text-xs leading-6 text-dash-muted">{description}</p></div>
    <div className="flex flex-wrap items-center gap-2"><span className="inline-flex items-center gap-1.5 rounded-[10px] border border-dash-peach px-3 py-2.5 text-[10px] text-dash-primary"><LuSparkles size={13} aria-hidden="true" />Demo data</span>{actions}</div>
  </header>;
}
