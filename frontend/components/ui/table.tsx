import type { ComponentProps } from "react";

export function Table({ className = "", ...props }: ComponentProps<"table">) {
  return <div className="w-full overflow-x-auto rounded-xl border border-dash-border"><table className={`w-full border-collapse text-left text-sm text-dash-text ${className}`} {...props} /></div>;
}

export function TableHeader({ className = "", ...props }: ComponentProps<"thead">) {
  return <thead className={`bg-dash-sidebar/70 text-[12px] tracking-[1.3px] text-dash-muted ${className}`} {...props} />;
}

export function TableBody({ className = "", ...props }: ComponentProps<"tbody">) {
  return <tbody className={`[&_tr:last-child]:border-b-0 ${className}`} {...props} />;
}

export function TableRow({ className = "", ...props }: ComponentProps<"tr">) {
  return <tr className={`border-b border-dash-border transition-colors hover:bg-dash-sage/40 focus-within:bg-dash-sage/40 ${className}`} {...props} />;
}

export function TableHead({ className = "", scope = "col", ...props }: ComponentProps<"th">) {
  return <th scope={scope} className={`px-4 py-4 font-medium ${className}`} {...props} />;
}

export function TableCell({ className = "", ...props }: ComponentProps<"td">) {
  return <td className={`px-4 py-4 align-middle ${className}`} {...props} />;
}
