import type { Metadata } from "next";
import Dashboard from "@/components/dashboard/dashboard";

export const metadata: Metadata = {
  title: "AI Writer",
  description: "Review AI outreach drafts and prepare messages for potential clients.",
  alternates: { canonical: "/ai-writer" },
};

export default function Page() {
  return <Dashboard active="AI Writer" />;
}
