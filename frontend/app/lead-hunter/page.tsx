import type { Metadata } from "next";
import Dashboard from "@/components/dashboard/dashboard";

export const metadata: Metadata = {
  title: "Lead Hunter",
  description: "Discover and review potential clients in your ClientPilot workspace.",
  alternates: { canonical: "/lead-hunter" },
};

export default function Page() {
  return <Dashboard active="Lead Hunter" />;
}
