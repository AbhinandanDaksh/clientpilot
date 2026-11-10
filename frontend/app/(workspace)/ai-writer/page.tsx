import type { Metadata } from "next";
import AIWriter from "./ai-writer";

export const metadata: Metadata = {
  title: "AI Writer",
  description: "Review AI outreach drafts and prepare messages for potential clients.",
  alternates: { canonical: "/ai-writer" },
};

export default function Page() {
  return <AIWriter />;
}
