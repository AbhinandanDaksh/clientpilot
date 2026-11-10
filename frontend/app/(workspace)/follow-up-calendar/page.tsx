import type { Metadata } from "next";
import WorkspacePlaceholder from "@/components/layout/workspace-placeholder";

export const metadata: Metadata = {
  title: "Follow-up Calendar",
  description: "Organize client follow-ups and upcoming outreach in ClientPilot.",
  alternates: { canonical: "/follow-up-calendar" },
};

export default function Page() {
  return <WorkspacePlaceholder title="Follow-up Calendar" />;
}
