import type { Metadata } from "next";
import Dashboard from "@/components/dashboard/dashboard";

export const metadata: Metadata = {
  title: "Agent Activity",
  description: "Review AI agent activity and demo runs in ClientPilot.",
  alternates: { canonical: "/agent-activity" },
};

export default function Page() {
  return <Dashboard active="Agent Activity" />;
}
