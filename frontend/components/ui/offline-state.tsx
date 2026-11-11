"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LuRefreshCw, LuWifiOff } from "react-icons/lu";

export default function OfflineState() {
  const router = useRouter();
  const [message, setMessage] = useState("");

  function retry() {
    if (!navigator.onLine) {
      setMessage("Still offline. Check your Wi-Fi or mobile data and try again.");
      return;
    }
    router.replace("/dashboard");
  }

  return (
    <main className="dashboard-shell flex min-h-screen flex-1 items-center justify-center bg-dash-bg px-6 py-12 text-center text-dash-text">
      <section aria-labelledby="offline-heading" className="w-full max-w-lg rounded-3xl border border-dash-border bg-dash-card px-6 py-12 sm:px-12">
        <span className="mx-auto mb-6 grid size-16 place-items-center rounded-2xl bg-dash-peach text-dash-primary">
          <LuWifiOff aria-hidden="true" size={30} />
        </span>
        <p className="mb-3 text-[12px] font-semibold tracking-[2px] text-dash-primary">CONNECTION LOST</p>
        <h1 id="offline-heading" className="text-3xl font-semibold tracking-tight">No internet connection</h1>
        <p className="mt-4 text-sm leading-7 text-dash-muted">Looks like you&apos;re offline. Check your Wi-Fi or mobile data. Your workspace will be here when you reconnect.</p>
        <button type="button" onClick={retry} className="mt-8 inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-dash-primary px-5 py-3 text-sm font-semibold text-dash-white transition-colors hover:bg-dash-primary-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-dash-primary">
          <LuRefreshCw aria-hidden="true" size={16} />Try again
        </button>
        <p role="status" className="mt-5 min-h-10 text-sm leading-5 text-dash-muted">{message || "We'll reconnect automatically when your connection returns."}</p>
      </section>
    </main>
  );
}
