import type { Metadata } from "next";
import OfflineState from "@/components/ui/offline-state";

export const metadata: Metadata = { title: "No internet | ClientPilot" };

export default function OfflinePage() {
  return <OfflineState />;
}
