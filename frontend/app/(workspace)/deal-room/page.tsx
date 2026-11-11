import type { Metadata } from "next";
import DealRoom from "./deal-room";

export const metadata: Metadata = {
  title: "Deal Room",
  description: "Manage client deals and project opportunities in ClientPilot.",
  alternates: { canonical: "/deal-room" },
};

export default async function Page({ searchParams }: { searchParams: Promise<{ client?: string | string[] }> }) {
  const { client } = await searchParams;
  const initialClientId = typeof client === "string" && /^\d+$/.test(client) && Number.isSafeInteger(Number(client)) ? Number(client) : null;
  return <DealRoom key={initialClientId ?? "default"} initialClientId={initialClientId} />;
}
