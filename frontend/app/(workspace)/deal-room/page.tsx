import type { Metadata } from "next";
import WorkspacePlaceholder from "@/components/layout/workspace-placeholder";

export const metadata: Metadata = {
  title: "Deal Room",
  description: "Manage client deals and project opportunities in ClientPilot.",
  alternates: { canonical: "/deal-room" },
};

export default function Page() {
  return <WorkspacePlaceholder title="Deal Room" />;
}
