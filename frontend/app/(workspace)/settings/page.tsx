import type { Metadata } from "next";
import WorkspacePlaceholder from "@/components/layout/workspace-placeholder";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your ClientPilot workspace settings.",
  alternates: { canonical: "/settings" },
  robots: { index: false, follow: false },
};

export default function Page() {
  return <WorkspacePlaceholder title="Settings" />;
}
