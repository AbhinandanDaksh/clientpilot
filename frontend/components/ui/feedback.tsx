"use client";

import { LuX } from "react-icons/lu";

export default function Feedback({ message, onDismiss, action, raised = false }: { message: string; onDismiss: () => void; action?: { label: string; onClick: () => void }; raised?: boolean }) {
  return <div role="status" aria-live="polite" aria-atomic="true">
    {message && <div className={`fixed right-5 ${raised ? "bottom-28" : "bottom-5"} z-50 flex w-[min(440px,calc(100vw-40px))] items-start gap-3 rounded-xl border border-dash-border bg-dash-card p-4 text-sm leading-6 text-dash-text shadow-xl`}>
      <div className="min-w-0 flex-1"><p className="break-words">{message}</p>{action && <button type="button" onClick={action.onClick} className="mt-1 min-h-11 rounded-lg px-2 font-semibold text-dash-primary hover:bg-dash-peach">{action.label}</button>}</div>
      <button type="button" aria-label="Dismiss update" onClick={onDismiss} className="grid size-11 shrink-0 place-items-center rounded-lg hover:bg-dash-peach focus-visible:outline-2 focus-visible:outline-dash-primary"><LuX size={18} aria-hidden="true" /></button>
    </div>}
  </div>;
}
