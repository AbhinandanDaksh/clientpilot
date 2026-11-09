import type { Metadata } from "next";
import Dashboard from "@/components/dashboard/dashboard";

export const metadata: Metadata = {
  title: "Upgrade plan",
  description: "Explore plan options for your ClientPilot workspace.",
  alternates: { canonical: "/upgrade-plan" },
};

export default function Page() {
  return <Dashboard active="Upgrade plan" />;
}
