"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import OfflineState from "@/components/ui/offline-state";

function subscribe(onChange: () => void) {
  window.addEventListener("online", onChange);
  window.addEventListener("offline", onChange);
  return () => {
    window.removeEventListener("online", onChange);
    window.removeEventListener("offline", onChange);
  };
}

export default function NetworkStatus({ children }: { children: ReactNode }) {
  const online = useSyncExternalStore(subscribe, () => navigator.onLine, () => true);

  return (
    <>
      <div hidden={!online} className={online ? "flex min-h-full flex-1 flex-col" : "hidden"}>{children}</div>
      {!online && <OfflineState />}
    </>
  );
}
