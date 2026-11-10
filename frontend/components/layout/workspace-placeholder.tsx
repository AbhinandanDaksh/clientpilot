import Link from "next/link";
import { LuArrowLeft } from "react-icons/lu";

export default function WorkspacePlaceholder({ title }: { title: string }) {
  return <section className="min-h-[400px] rounded-[18px] border border-dash-border bg-dash-card p-6">
    <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-dash-primary"><LuArrowLeft aria-hidden="true" size={14} /> Back to overview</Link>
    <p className="mt-8 text-[10px] font-semibold tracking-[1.5px] text-dash-muted">WORKSPACE</p>
    <h1 className="mt-2 text-[32px] font-semibold">{title}</h1>
    <p className="mt-4 text-dash-muted">This workspace section is ready for integration. Live {title.toLowerCase()} data is not connected yet.</p>
  </section>;
}
