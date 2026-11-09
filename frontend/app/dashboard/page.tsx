import type { Metadata } from "next";
import Dashboard from "@/components/dashboard/dashboard";
export const metadata: Metadata = {
  title: "ClientPilot",
  description: "Manage your clients, leads, and AI agents with ClientPilot.",
};
export default function DashboardPage() {
  return <Dashboard />;
}
