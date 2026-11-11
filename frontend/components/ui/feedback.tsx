"use client";

import { LuX } from "react-icons/lu";

export default function Feedback({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return <div role="status" aria-live="polite" aria-atomic="true">
    {message && <div className="fixed right-5 bottom-5 z-50 flex w-[min(440px,calc(100vw-40px))] items-start gap-3 rounded-xl border border-dash-border bg-dash-card p-4 text-sm leading-6 text-dash-text shadow-xl">
      <p className="min-w-0 flex-1 break-words">{message}</p>
      <button type="button" aria-label="Dismiss update" onClick={onDismiss} className="grid size-11 shrink-0 place-items-center rounded-lg hover:bg-dash-peach focus-visible:outline-2 focus-visible:outline-dash-primary"><LuX size={18} aria-hidden="true" /></button>
    </div>}
  </div>;
}
