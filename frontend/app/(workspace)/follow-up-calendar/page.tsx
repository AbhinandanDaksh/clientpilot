import type { Metadata } from "next";
import { connection } from "next/server";
import FollowUpCalendar from "./follow-up-calendar";

export const metadata: Metadata = {
  title: "Follow-up Calendar",
  description: "Organize client follow-ups and upcoming outreach in ClientPilot.",
  alternates: { canonical: "/follow-up-calendar" },
};

export default async function Page() {
  await connection();
  return <FollowUpCalendar today={new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date())} />;
}
