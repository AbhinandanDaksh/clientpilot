import type { Metadata } from "next";
import WorkspacePlaceholder from "@/components/layout/workspace-placeholder";

export const metadata: Metadata = {
  title: "Upgrade plan",
  description: "Explore plan options for your ClientPilot workspace.",
  alternates: { canonical: "/upgrade-plan" },
};

export default function Page() {
  return <WorkspacePlaceholder title="Upgrade plan" />;
}
