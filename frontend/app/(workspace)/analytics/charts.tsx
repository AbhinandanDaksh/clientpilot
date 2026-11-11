"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function AnalyticsChart({ data }: { data: { day: string; leads: number; replies: number }[] }) {
  return <div className="mt-5 h-[270px] w-full min-w-0" role="group" aria-label="Simulated leads and replies for the selected period. Exact values are available in the data table below.">
    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
      <AreaChart data={data} margin={{ top: 10, right: 8, bottom: 0, left: -24 }} accessibilityLayer>
        <CartesianGrid vertical={false} stroke="var(--dash-border)" strokeDasharray="3 3" />
        <XAxis dataKey="day" tick={{ fill: "var(--dash-muted)", fontSize: 12 }} tickLine={false} axisLine={false} minTickGap={25} />
        <YAxis allowDecimals={false} tick={{ fill: "var(--dash-muted)", fontSize: 12 }} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={{ background: "var(--dash-sidebar)", border: "1px solid var(--dash-border)", borderRadius: 10, fontSize: 12, color: "var(--dash-text)" }} />
        <Area dataKey="leads" name="Leads" type="monotone" fill="var(--dash-primary)" fillOpacity={0.12} stroke="var(--dash-primary)" strokeWidth={2} isAnimationActive={false} />
        <Area dataKey="replies" name="Replies" type="monotone" fill="var(--dash-green)" fillOpacity={0.1} stroke="var(--dash-green)" strokeWidth={2} isAnimationActive={false} />
      </AreaChart>
    </ResponsiveContainer>
  </div>;
}
