import type { Metadata } from "next";
import AgentActivity from "./agent-activity";

export const metadata: Metadata = {
  title: "Agent Activity",
  description: "Review AI agent activity and runs in ClientPilot.",
  alternates: { canonical: "/agent-activity" },
};

export default function Page() {
  return <AgentActivity />;
}
