import type { Metadata } from "next";
import Conversations from "./conversations";

export const metadata: Metadata = {
  title: "Conversations",
  description: "Keep track of client conversations in your ClientPilot workspace.",
  alternates: { canonical: "/conversations" },
};

export default function Page() {
  return <Conversations />;
}
