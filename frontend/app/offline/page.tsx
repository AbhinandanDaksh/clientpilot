import type { Metadata } from "next";
import OfflineState from "@/components/ui/offline-state";

export const metadata: Metadata = { title: "No internet | freelance.ai" };

export default function OfflinePage() {
  return <OfflineState />;
}
