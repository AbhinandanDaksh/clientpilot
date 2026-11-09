import type { Metadata } from "next";
import Dashboard from "@/components/dashboard/dashboard";

export const metadata: Metadata = {
  title: "Deal Room",
  description: "Manage client deals and project opportunities in ClientPilot.",
  alternates: { canonical: "/deal-room" },
};

export default function Page() {
  return <Dashboard active="Deal Room" />;
}
