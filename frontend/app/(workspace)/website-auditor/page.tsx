import type { Metadata } from "next";
import WebsiteAuditor from "./website-auditor";

export const metadata: Metadata = {
  title: "Website Auditor",
  description: "Review website audit opportunities in your ClientPilot workspace.",
  alternates: { canonical: "/website-auditor" },
};

export default function Page() {
  return <WebsiteAuditor />;
}
