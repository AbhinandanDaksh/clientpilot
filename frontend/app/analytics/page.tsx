import type { Metadata } from "next";
import Dashboard from "@/components/dashboard/dashboard";

export const metadata: Metadata = {
  title: "Analytics",
  description: "Review freelance business analytics in your ClientPilot workspace.",
  alternates: { canonical: "/analytics" },
};

export default function Page() {
  return <Dashboard active="Analytics" />;
}
