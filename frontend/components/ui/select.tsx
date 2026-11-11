import type { ComponentProps } from "react";
import { LuChevronDown } from "react-icons/lu";

// Native select preserves keyboard navigation, form submission and mobile pickers.
export default function Select({ className = "", children, ...props }: ComponentProps<"select">) {
  return <span className={`relative inline-flex min-w-0 ${className}`}>
    <select className="min-h-11 w-full appearance-none rounded-[10px] border border-dash-border bg-dash-card py-2.5 pr-9 pl-3 text-base sm:text-sm text-dash-text transition-colors hover:border-dash-muted focus:border-dash-primary focus:outline-none focus:ring-2 focus:ring-dash-primary/15 disabled:cursor-not-allowed disabled:opacity-50 [&_option]:bg-dash-sidebar [&_option]:text-dash-text" {...props}>{children}</select>
    <LuChevronDown size={14} aria-hidden="true" className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-dash-muted" />
  </span>;
}
