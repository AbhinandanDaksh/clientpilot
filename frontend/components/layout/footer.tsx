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
    <footer className="mt-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-dash-border py-4 text-[11px] leading-5 text-dash-muted max-[560px]:flex-col max-[560px]:items-start">
      <p>
        <span className="font-semibold text-dash-text">Client<span className="text-dash-primary">Pilot</span></span>
        <span className="mx-2" aria-hidden="true">&middot;</span>
        Your freelance work, in one place.
      </p>
      <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span>&copy; {year !== null ? String(year) + " " : ""}ClientPilot</span>
        <span aria-hidden="true" className="h-3 w-px bg-dash-border" />
        {/* <span className="rounded-full border border-dash-border bg-dash-card px-2.5 py-0.5 text-[10px]">Demo workspace</span> */}
      </p>
    </footer>
  );
}
