import type { ComponentProps } from "react";

export default function Textarea({ className = "", ...props }: ComponentProps<"textarea">) {
  return <textarea className={`w-full resize-y rounded-xl border border-dash-border bg-dash-card px-4 py-3 text-base sm:text-sm leading-7 text-dash-text placeholder:text-dash-muted transition-colors hover:border-dash-muted focus:border-dash-primary focus:outline-none focus:ring-2 focus:ring-dash-primary/15 disabled:opacity-50 ${className}`} {...props} />;
}
