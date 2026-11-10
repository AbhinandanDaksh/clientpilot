import type { Metadata } from "next";
import LeadHunter from "./lead-hunter";

export const metadata: Metadata = {
  title: "Lead Hunter",
  description: "Discover and review potential clients in your ClientPilot workspace.",
  alternates: { canonical: "/lead-hunter" },
};

export default function Page() {
  return <LeadHunter />;
}
