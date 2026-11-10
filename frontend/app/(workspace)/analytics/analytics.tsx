"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { LuCalendarDays, LuCompass, LuDownload, LuIndianRupee, LuMessageCircle } from "react-icons/lu";
import ScreenHeader from "@/components/layout/screen-header";
import Button from "@/components/ui/button";
import Select from "@/components/ui/select";
import Skeleton from "@/components/ui/skeleton";
import StatCard from "@/components/ui/stat-card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { exportCSV } from "@/common/export-csv";
import { channels, observations } from "./data";

const Chart = dynamic(() => import("./charts"), { ssr: false, loading: () => <div role="status" className="mt-5"><span className="sr-only">Loading analytics chart</span><Skeleton className="h-[270px] w-full" /></div> });
const panel = "rounded-[18px] border border-dash-border bg-dash-card p-5";
const currency = (value: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
function sum(rows: typeof observations) {
  return rows.reduce((total, row) => ({ leads: total.leads + row.leads, outreach: total.outreach + row.outreach, replies: total.replies + row.replies, meetings: total.meetings + row.meetings, clients: total.clients + row.clients, revenue: total.revenue + row.revenue }), { leads: 0, outreach: 0, replies: 0, meetings: 0, clients: 0, revenue: 0 });
}

export default function Analytics() {
  const [period, setPeriod] = useState("30");
  const [channel, setChannel] = useState("All channels");
  const [notice, setNotice] = useState("");
  const filtered = observations.filter(row => row.day > 30 - Number(period) && (channel === "All channels" || row.channel === channel));
  const total = sum(filtered);
  const replyRate = total.outreach ? (total.replies / total.outreach * 100).toFixed(1) : "0";
  const daily = Array.from({ length: Number(period) }, (_, index) => { const day = 31 - Number(period) + index; return { day: `Day ${day}`, ...sum(filtered.filter(row => row.day === day)) }; });
  const channelRows = channels.filter(item => channel === "All channels" || item === channel).map(item => ({ channel: item, ...sum(filtered.filter(row => row.channel === item)) }));
  const funnel = [{ label: "Leads discovered", value: total.leads, color: "bg-dash-primary" }, { label: "Outreach prepared", value: total.outreach, color: "bg-dash-orange" }, { label: "Replies received", value: total.replies, color: "bg-dash-purple" }, { label: "Meetings booked", value: total.meetings, color: "bg-dash-blue" }, { label: "Clients won", value: total.clients, color: "bg-dash-green" }];

  return <div className="space-y-6">
    <ScreenHeader eyebrow="YOUR PROGRESS, IN PERSPECTIVE" title="Analytics" description="See where your effort is going, what is resonating, and where to focus next." actions={<Button variant="secondary" onClick={() => { exportCSV("demo-analytics.csv", [["Day", "Leads", "Outreach prepared", "Replies", "Meetings", "Clients", "Revenue INR", "Channel filter", "Mode"], ...daily.map(row => [row.day, row.leads, row.outreach, row.replies, row.meetings, row.clients, row.revenue, channel, "Simulated"])]); setNotice("Filtered demo analytics exported."); }}><LuDownload size={14} />Export report</Button>} />
    <div className="flex flex-wrap items-center justify-between gap-3"><p className="text-xs text-dash-muted">A snapshot of your sample freelance pipeline.</p><div className="flex flex-wrap gap-2"><Select aria-label="Analytics period" value={period} onChange={event => setPeriod(event.target.value)}><option value="7">Last 7 sample days</option><option value="30">Last 30 sample days</option></Select><Select aria-label="Analytics channel" value={channel} onChange={event => setChannel(event.target.value)}><option>All channels</option>{channels.map(item => <option key={item}>{item}</option>)}</Select></div></div>
    <section aria-label="Analytics summary" className="grid grid-cols-4 gap-4 max-[1100px]:grid-cols-2 max-[560px]:grid-cols-1">
      <StatCard label="Leads discovered" value={total.leads} detail={`${total.outreach} outreach drafts prepared`} icon={<LuCompass size={18} />} />
      <StatCard label="Reply rate" value={`${replyRate}%`} detail={`${total.replies} replies / ${total.outreach} prepared outreach · Sample`} icon={<LuMessageCircle size={18} />} tone="bg-dash-lavender text-dash-purple" />
      <StatCard label="Meetings booked" value={total.meetings} detail={`${total.clients} sample clients won`} icon={<LuCalendarDays size={18} />} tone="bg-dash-sage text-dash-green" />
      <StatCard label="Project revenue" value={currency(total.revenue)} detail="Illustrative booked revenue · Not actual earnings" icon={<LuIndianRupee size={18} />} tone="bg-dash-sand text-dash-orange" />
    </section>
    <div className="grid grid-cols-[minmax(0,1.5fr)_minmax(260px,1fr)] gap-4 max-[1000px]:grid-cols-1">
      <section className={`${panel} min-w-0`}><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="!text-base">Outreach momentum</h2><p className="mt-2 text-[11px] text-dash-muted">Leads and replies across {period} illustrative days.</p></div><div className="flex gap-3 text-[10px] text-dash-muted"><span className="flex items-center gap-1.5"><i className="size-2 rounded-full bg-dash-primary" />Leads</span><span className="flex items-center gap-1.5"><i className="size-2 rounded-full bg-dash-green" />Replies</span></div></div><Chart data={daily} /></section>
      <section className={panel}><h2 className="!text-base">From discovery to clients</h2><p className="mt-2 text-[11px] text-dash-muted">A little clarity on every stage of the journey.</p><ol className="mt-6 space-y-5">{funnel.map(stage => <li key={stage.label}><div className="mb-2 flex justify-between gap-3 text-xs"><span className="text-dash-muted">{stage.label}</span><span className="font-medium">{stage.value}</span></div><div className="h-2 rounded-full bg-dash-bg"><div className={`h-full rounded-full ${stage.color}`} style={{ width: `${total.leads ? stage.value / total.leads * 100 : 0}%` }} /></div></li>)}</ol></section>
    </div>
    <section className={panel}><h2 className="!text-base">Channel performance</h2><p className="mt-2 mb-5 text-[11px] text-dash-muted">Compare your sample conversations across channels.</p><Table aria-label="Sample channel performance" className="min-w-[650px]"><TableHeader><TableRow>{["CHANNEL", "LEADS", "OUTREACH", "REPLIES", "REPLY RATE", "CLIENTS", "REVENUE"].map(title => <TableHead key={title}>{title}</TableHead>)}</TableRow></TableHeader><TableBody>{channelRows.map(row => <TableRow key={row.channel}><TableCell className="font-medium">{row.channel}</TableCell><TableCell>{row.leads}</TableCell><TableCell>{row.outreach}</TableCell><TableCell>{row.replies}</TableCell><TableCell>{row.outreach ? (row.replies / row.outreach * 100).toFixed(1) : "0"}%</TableCell><TableCell>{row.clients}</TableCell><TableCell>{currency(row.revenue)}</TableCell></TableRow>)}</TableBody></Table></section>
    <details className={panel}><summary className="cursor-pointer text-sm font-semibold">View daily chart data</summary><p className="my-4 text-[11px] text-dash-muted">Exact sample observations used by the chart and exported report.</p><Table aria-label="Daily analytics values" className="min-w-[650px]"><TableHeader><TableRow>{["DAY", "LEADS", "OUTREACH", "REPLIES", "MEETINGS", "CLIENTS", "REVENUE"].map(title => <TableHead key={title}>{title}</TableHead>)}</TableRow></TableHeader><TableBody>{daily.map(row => <TableRow key={row.day}><TableCell>{row.day}</TableCell><TableCell>{row.leads}</TableCell><TableCell>{row.outreach}</TableCell><TableCell>{row.replies}</TableCell><TableCell>{row.meetings}</TableCell><TableCell>{row.clients}</TableCell><TableCell>{currency(row.revenue)}</TableCell></TableRow>)}</TableBody></Table></details>
    <p role="status" className="text-xs leading-6 text-dash-muted">{notice || "All metrics are simulated and separate from other pages' local demo actions. Reply rate = replies ÷ prepared outreach in the sample dataset. No live accounts or revenue sources are connected."}</p>
  </div>;
}
