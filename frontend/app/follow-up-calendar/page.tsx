import type { Metadata } from "next";
import Dashboard from "@/components/dashboard/dashboard";

export const metadata: Metadata = {
  title: "Follow-up Calendar",
  description: "Organize client follow-ups and upcoming outreach in ClientPilot.",
  alternates: { canonical: "/follow-up-calendar" },
};

export default function Page() {
  return <Dashboard active="Follow-up Calendar" />;
}
