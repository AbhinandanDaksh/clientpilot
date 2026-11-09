"use client";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const activity = [
  { day: "Mon", actions: 34 }, { day: "Tue", actions: 52 },
  { day: "Wed", actions: 42 }, { day: "Thu", actions: 68 },
  { day: "Fri", actions: 58 }, { day: "Sat", actions: 84 },
  { day: "Sun", actions: 96 },
];
const outreach = [
  { week: "Week 1", leads: 18, replies: 4 },
  { week: "Week 2", leads: 26, replies: 8 },
  { week: "Week 3", leads: 22, replies: 6 },
  { week: "Week 4", leads: 38, replies: 12 },
  { week: "Week 5", leads: 46, replies: 18 },
  { week: "Week 6", leads: 58, replies: 24 },
];
const tick = { fill: "var(--dash-muted)", fontSize: 10 };
const tooltip = { backgroundColor: "var(--dash-card)", border: "1px solid var(--dash-border)", borderRadius: 12, color: "var(--dash-text)", fontSize: 12 };

export function WeeklyActivityChart() {
  return (
    <div className="mt-5 h-[190px] w-full min-w-0" role="group" aria-label="Sample weekly activity: Monday 34, Tuesday 52, Wednesday 42, Thursday 68, Friday 58, Saturday 84, Sunday 96 actions.">
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <BarChart data={activity} margin={{ top: 8, right: 4, bottom: 0, left: -24 }} accessibilityLayer>
          <CartesianGrid vertical={false} stroke="var(--dash-border)" strokeDasharray="3 3" />
          <XAxis dataKey="day" tick={tick} tickLine={false} axisLine={false} interval={0} />
          <YAxis tick={tick} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={tooltip} cursor={{ fill: "var(--dash-peach)" }} />
          <Bar dataKey="actions" name="Actions" fill="var(--dash-primary)" radius={[5, 5, 0, 0]} maxBarSize={32} isAnimationActive={false} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function OutreachTrendChart() {
  return (
    <section data-aos="fade-up" className="mt-7 min-w-0 rounded-[18px] border border-dash-border bg-dash-card p-6 max-[560px]:p-[18px]">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div><h2>Outreach momentum</h2><p className="mt-1 text-xs text-dash-muted">Leads and replies over six weeks &middot; Sample data</p></div>
        <div className="flex gap-4 text-xs text-dash-muted">
          <span className="flex items-center gap-2"><i className="size-2 rounded-full bg-dash-primary" />Leads</span>
          <span className="flex items-center gap-2"><i className="size-2 rounded-full bg-dash-green" />Replies</span>
        </div>
      </div>
      <div className="h-[250px] w-full min-w-0 max-[560px]:h-[210px]" role="group" aria-label="Sample outreach trend: leads increase from 18 to 58 and replies from 4 to 24 over six weeks.">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <AreaChart data={outreach} margin={{ top: 10, right: 10, bottom: 0, left: -24 }} accessibilityLayer>
            <CartesianGrid vertical={false} stroke="var(--dash-border)" strokeDasharray="3 3" />
            <XAxis dataKey="week" tick={tick} tickLine={false} axisLine={false} minTickGap={16} />
            <YAxis tick={tick} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={tooltip} />
            <Area type="monotone" dataKey="leads" name="Leads" stroke="var(--dash-primary)" fill="var(--dash-primary)" fillOpacity={0.12} strokeWidth={2} isAnimationActive={false} />
            <Area type="monotone" dataKey="replies" name="Replies" stroke="var(--dash-green)" fill="var(--dash-green)" fillOpacity={0.08} strokeWidth={2} isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

const sources = [
  { name: "Website", value: 42, fill: "var(--dash-primary)" },
  { name: "Referrals", value: 28, fill: "var(--dash-green)" },
  { name: "Social", value: 18, fill: "var(--dash-purple)" },
  { name: "Outreach", value: 12, fill: "var(--dash-gold)" },
];
const pipeline = [
  { stage: "New leads", deals: 48 },
  { stage: "Contacted", deals: 32 },
  { stage: "In discussion", deals: 19 },
  { stage: "Proposal sent", deals: 11 },
  { stage: "Won", deals: 6 },
];

export function PipelineCharts() {
  return (
    <div className="mt-7 grid min-w-0 grid-cols-2 gap-4 max-[850px]:grid-cols-1">
      <section data-aos="fade-up" className="min-w-0 rounded-[18px] border border-dash-border bg-dash-card p-6 max-[560px]:p-[18px]">
        <h2>Where leads come from</h2>
        <p className="mt-1 text-xs text-dash-muted">Lead source breakdown &middot; Sample data</p>
        <div className="relative mx-auto h-[230px] w-full max-w-[320px]" role="group" aria-label="Sample lead sources: Website 42 percent, Referrals 28 percent, Social 18 percent, Outreach 12 percent.">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <PieChart accessibilityLayer>
              <Pie data={sources} dataKey="value" nameKey="name" innerRadius="62%" outerRadius="85%" paddingAngle={4} stroke="var(--dash-card)" strokeWidth={3} isAnimationActive={false} />
              <Tooltip contentStyle={tooltip} formatter={(value) => String(value) + "%"} />
            </PieChart>
          </ResponsiveContainer>
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <strong className="text-2xl font-semibold text-dash-text">100%</strong>
            <span className="text-xs text-dash-muted">All sources</span>
          </div>
        </div>
        <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
          {sources.map((source) => (
            <li key={source.name} className="flex items-center gap-2">
              <span aria-hidden="true" className="size-2 shrink-0 rounded-full" style={{ backgroundColor: source.fill }} />
              <span className="text-dash-muted">{source.name}</span>
              <strong className="ml-auto font-medium">{source.value}%</strong>
            </li>
          ))}
        </ul>
      </section>
      <section data-aos="fade-up" className="min-w-0 rounded-[18px] border border-dash-border bg-dash-card p-6 max-[560px]:p-[18px]">
        <h2>Your deal pipeline</h2>
        <p className="mt-1 text-xs text-dash-muted">Opportunities by stage &middot; Sample data</p>
        <div className="mt-6 h-[265px] w-full min-w-0" role="group" aria-label="Sample pipeline: 48 new leads, 32 contacted, 19 in discussion, 11 proposals sent, 6 won.">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <BarChart data={pipeline} layout="vertical" margin={{ top: 4, right: 16, bottom: 0, left: 0 }} accessibilityLayer>
              <CartesianGrid horizontal={false} stroke="var(--dash-border)" strokeDasharray="3 3" />
              <XAxis type="number" tick={tick} tickLine={false} axisLine={false} allowDecimals={false} />
              <YAxis type="category" dataKey="stage" width={88} tick={tick} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltip} cursor={{ fill: "var(--dash-peach)" }} />
              <Bar dataKey="deals" name="Opportunities" fill="var(--dash-green)" radius={[0, 5, 5, 0]} maxBarSize={24} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
