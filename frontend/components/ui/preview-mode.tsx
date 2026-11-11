import { LuChevronDown } from "react-icons/lu";

export default function PreviewMode() {
  return <details className="group mb-5 rounded-xl border border-dash-border bg-dash-card px-4 py-2 text-xs text-dash-muted"><summary className="flex min-h-9 cursor-pointer items-center gap-3"><span className="shrink-0 rounded-full border border-dash-border bg-dash-bg px-2.5 py-1 font-medium text-dash-text">Preview mode</span><span className="min-w-0 flex-1">Sample data · no live actions</span><LuChevronDown aria-hidden="true" className="shrink-0 group-open:rotate-180" size={14} /></summary><p className="max-w-2xl py-2 leading-6">Runs and integrations are simulated. Drafts, plans, and preferences are saved only in this browser where supported. No live discovery, messages, or external reminders are enabled.</p></details>;
}
