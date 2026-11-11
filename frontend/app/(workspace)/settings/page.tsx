import type { Metadata } from "next";
import Settings from "./settings";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your ClientPilot workspace settings.",
  alternates: { canonical: "/settings" },
  robots: { index: false, follow: false },
};

export default function Page() {
  return <Settings />;
}
