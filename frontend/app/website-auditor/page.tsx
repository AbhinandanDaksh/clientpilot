import type { Metadata } from "next";
import Dashboard from "@/components/dashboard/dashboard";

export const metadata: Metadata = {
  title: "Website Auditor",
  description: "Review website audit opportunities in your ClientPilot workspace.",
  alternates: { canonical: "/website-auditor" },
};

export default function Page() {
  return <Dashboard active="Website Auditor" />;
}
