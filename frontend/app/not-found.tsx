import Link from "next/link";
import Image from "next/image";
import { LuArrowLeft, LuCompass } from "react-icons/lu";

export default function NotFound() {
  return (
    <main className="dashboard-shell flex min-h-screen flex-1 flex-col items-center justify-center bg-dash-bg px-6 py-12 text-center text-dash-text">
      <Link href="/dashboard" aria-label="ClientPilot dashboard" className="mb-12 inline-flex items-center gap-3 rounded-lg text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-dash-primary">
        <Image
          src="/branding/clientpilot-icon.svg"
          alt=""
          width={36}
          height={36}
          className="size-9 shrink-0"
          priority
        />
        <span>Client<span className="text-dash-primary">Pilot</span></span>
      </Link>
      <section className="w-full max-w-lg rounded-3xl border border-dash-border bg-dash-card px-6 py-12 sm:px-12">
        <span className="mx-auto mb-6 grid size-14 place-items-center rounded-2xl bg-dash-peach text-dash-primary">
          <LuCompass aria-hidden="true" size={28} />
        </span>
        <p className="mb-4 text-7xl font-semibold tracking-tight text-dash-primary sm:text-8xl">404</p>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">A little off the map.</h1>
        <p className="mt-4 text-sm leading-7 text-dash-muted">
          We couldn&apos;t find this page. It may have moved, or the link might be incorrect. Let&apos;s get you back to your workspace.
        </p>
        <Link href="/dashboard" className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-dash-primary px-5 py-3 text-sm font-semibold text-dash-white transition-colors hover:bg-dash-primary-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-dash-primary">
          <LuArrowLeft aria-hidden="true" size={16} />
          Back to dashboard
        </Link>
      </section>
      <p className="mt-8 text-xs text-dash-muted">Your next opportunity is still out there.</p>
    </main>
  );
}
