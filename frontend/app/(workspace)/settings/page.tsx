import type { Metadata } from "next";
import Settings from "./settings";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your ClientPilot workspace settings.",
  alternates: { canonical: "/settings" },
  robots: { index: false, follow: false },
};

export default async function Page() {
  // Temporary development-only delay to preview the shared route loader.
  if (process.env.NODE_ENV === "development") {
    await new Promise<void>((resolve) => setTimeout(resolve, 2000));
  }
  return <Settings />;
}
