import type { Metadata } from "next";
import Analytics from "./analytics";

export const metadata: Metadata = {
  title: "Analytics",
  description: "Review freelance business analytics in your ClientPilot workspace.",
  alternates: { canonical: "/analytics" },
};

export default function Page() {
  return <Analytics />;
}
