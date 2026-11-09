import type { Metadata } from "next";
import OfflineState from "@/components/ui/offline-state";

export const metadata: Metadata = { title: "No internet", robots: { index: false, follow: false } };

export default function OfflinePage() {
  return <OfflineState />;
}
