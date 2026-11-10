import type { Metadata } from "next";
import WorkspacePlaceholder from "@/components/layout/workspace-placeholder";

export const metadata: Metadata = {
  title: "Analytics",
  description: "Review freelance business analytics in your ClientPilot workspace.",
  alternates: { canonical: "/analytics" },
};

export default function Page() {
  return <WorkspacePlaceholder title="Analytics" />;
}
