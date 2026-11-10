import type { ComponentProps, ReactNode } from "react";

type InputProps = ComponentProps<"input"> & { startIcon?: ReactNode };

export default function Input({ className = "", startIcon, type = "text", ...props }: InputProps) {
  if (type === "checkbox") {
    return <input type={type} className={`size-4 rounded border-dash-border accent-dash-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dash-primary disabled:cursor-not-allowed disabled:opacity-50 ${className}`} {...props} />;
  }
  const input = <input type={type} className={`min-h-10 w-full min-w-0 rounded-[10px] border border-dash-border bg-dash-card px-3 py-2.5 text-xs text-dash-text placeholder:text-dash-muted transition-colors hover:border-dash-muted focus:border-dash-primary focus:outline-none focus:ring-2 focus:ring-dash-primary/15 disabled:cursor-not-allowed disabled:opacity-50 ${startIcon ? "pl-9" : ""} ${className}`} {...props} />;
  return startIcon ? <span className="relative inline-flex min-w-0 items-center"><span className="pointer-events-none absolute left-3 z-1 text-dash-muted" aria-hidden="true">{startIcon}</span>{input}</span> : input;
}
