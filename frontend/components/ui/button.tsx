import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export default function Button({
  className = "",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      data-variant={variant}
      className={`inline-flex min-h-11 items-center justify-center gap-[9px] rounded-[10px] border px-3.5 py-[11px] text-sm font-semibold max-[560px]:p-2.5  ${variant === "secondary" ? "border-dash-peach bg-dash-card text-dash-text hover:bg-dash-sand" : "border-dash-primary bg-dash-primary text-dash-white shadow-[0_7px_15px_var(--dash-shadow)] hover:bg-dash-primary-hover"} ${className}`}
      {...props}
    />
  );
}
