import type { ReactNode } from "react";

export default function StatCard({ label, value, detail, icon, tone = "bg-dash-peach text-dash-primary" }: { label: string; value: ReactNode; detail: string; icon: ReactNode; tone?: string }) {
  return <article className="rounded-[18px] border border-dash-border bg-dash-card p-5"><div className="flex items-center justify-between gap-3"><p className="text-sm text-dash-muted">{label}</p><span className={`grid size-9 shrink-0 place-items-center rounded-xl ${tone}`} aria-hidden="true">{icon}</span></div><p className="mt-4 text-[30px] font-semibold tracking-tight">{value}</p><p className="mt-2 text-[12px] leading-5 text-dash-muted">{detail}</p></article>;
}
