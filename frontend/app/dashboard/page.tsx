import type { Metadata } from "next";
import Dashboard from "@/components/dashboard/dashboard";
export const metadata: Metadata = {
  title: "Overview | freelance.ai",
  description: "Your freelance AI command center.",
};
export default function DashboardPage() {
  return <Dashboard />;
}
