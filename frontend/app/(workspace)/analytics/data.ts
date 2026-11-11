export const channels = ["Email", "Instagram DM", "LinkedIn"];
// Deterministic preview observations; these are not connected account statistics.
export const observations = Array.from({ length: 30 }, (_, day) => channels.map((channel, index) => {
  const leads = 5 + ((day * 3 + index * 5) % 12);
  const outreach = Math.floor(leads * 0.75);
  const replies = Math.floor(outreach * (index === 0 ? 0.4 : 0.3)) + (day % 4 === 0 ? 1 : 0);
  const meetings = replies >= 3 ? 1 : 0;
  const clients = meetings && (day + index) % 6 === 0 ? 1 : 0;
  return { day: day + 1, channel, leads, outreach, replies, meetings, clients, revenue: clients * (18000 + index * 6000) };
})).flat();
