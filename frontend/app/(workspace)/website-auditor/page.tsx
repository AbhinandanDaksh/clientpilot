import type { Metadata } from "next";
import WorkspacePlaceholder from "@/components/layout/workspace-placeholder";

export const metadata: Metadata = {
  title: "Website Auditor",
  description: "Review website audit opportunities in your ClientPilot workspace.",
  alternates: { canonical: "/website-auditor" },
};

export default function Page() {
  return <WorkspacePlaceholder title="Website Auditor" />;
}
