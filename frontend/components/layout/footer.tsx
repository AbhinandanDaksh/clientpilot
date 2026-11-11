"use client";
import { useEffect, useState } from "react";
export default function Footer() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setYear(new Date().getFullYear());
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <footer className="mt-6 flex w-full min-w-0 flex-col items-center gap-3 border-t border-dash-border py-5 text-center text-[12px] leading-5 text-dash-muted sm:flex-row sm:flex-wrap sm:justify-between sm:text-left">
      <p className="flex min-w-0 flex-wrap items-center justify-center gap-x-2 gap-y-1 sm:justify-start">
        <span className="font-semibold text-dash-text">Client<span className="text-dash-primary">Pilot</span></span>
        <span className="hidden sm:inline" aria-hidden="true">&middot;</span>
        <span className="w-full sm:w-auto">Your freelance work, in one place.</span>
      </p>
      <p className="shrink-0">
        <span>&copy; {year !== null ? String(year) + " " : ""}ClientPilot</span>
        
      </p>
    </footer>
  );
}
