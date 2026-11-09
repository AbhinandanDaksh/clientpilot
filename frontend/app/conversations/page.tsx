import type { Metadata } from "next";
import Dashboard from "@/components/dashboard/dashboard";

export const metadata: Metadata = {
  title: "Conversations",
  description: "Keep track of client conversations in your ClientPilot workspace.",
  alternates: { canonical: "/conversations" },
};

export default function Page() {
  return <Dashboard active="Conversations" />;
}
