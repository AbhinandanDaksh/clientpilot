import type { Metadata } from "next";
import { siteTitle, siteDescription } from "@/common/site";
import Dashboard from "@/components/dashboard/dashboard";
export const metadata: Metadata = {
  title: { absolute: siteTitle },
  alternates: { canonical: "/dashboard" },
  description: siteDescription,
};
export default function DashboardPage() {
  return <Dashboard />;
}
