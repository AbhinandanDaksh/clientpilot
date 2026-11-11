"use client";

import Feedback from "@/components/ui/feedback";

import { useRef, useState } from "react";
import { LuActivity, LuArrowUpRight, LuCheck, LuCircleAlert, LuDownload, LuPause, LuPlay, LuRefreshCw, LuSearch, LuX } from "react-icons/lu";
import ScreenHeader from "@/components/layout/screen-header";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import StatCard from "@/components/ui/stat-card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { agents } from "@/common/workspace-agents";
import { exportCSV } from "@/common/export-csv";

type Run = { id: number; agent: string; status: "Complete" | "Needs attention"; time: string; duration: string; result: string; detail: string };
const initialRuns: Run[] = [
  { id: 4, agent: "Lead Hunter", status: "Complete", time: "18 min ago · Preview", duration: "24s", result: "24 leads discovered", detail: "Simulated discovery across five business categories. No live sources were queried." },
  { id: 3, agent: "Website Auditor", status: "Complete", time: "42 min ago · Preview", duration: "18s", result: "4 categories reviewed", detail: "Illustrative audit scores created. All findings require manual confirmation." },
  { id: 2, agent: "AI Writer", status: "Complete", time: "1 hour ago · Preview", duration: "9s", result: "3 drafts prepared", detail: "Template drafts prepared for review. No messages were sent." },
  { id: 1, agent: "Follow-up Agent", status: "Needs attention", time: "2 hours ago · Preview", duration: "3s", result: "Calendar connection unavailable", detail: "Example failure: no calendar provider connected. Retry previews a successful local simulation; it does not establish a calendar connection." },
];

export default function AgentActivity() {
  const [runs, setRuns] = useState(initialRuns);
  const [paused, setPaused] = useState<string[]>([]);
  const [agentFilter, setAgentFilter] = useState("All agents");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Run | null>(null);
  const [notice, setNotice] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const visible = runs.filter(run => (agentFilter === "All agents" || run.agent === agentFilter) && (statusFilter === "All statuses" || run.status === statusFilter) && `${run.agent} ${run.result}`.toLowerCase().includes(query.toLowerCase()));
  function runDemo(name: string, retry = false) {
    if (paused.includes(name)) { setNotice(`${name} is paused locally. Resume it before running a preview.`); return; }
    const time = new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(new Date());
    setRuns(previous => [{ id: Date.now(), agent: name, status: "Complete", time: `${time} IST`, duration: "Local simulation", result: retry ? "Retry simulation completed" : "run completed", detail: "Local preview completed. No backend jobs, website requests, AI calls, messages or external calendar updates were performed." }, ...previous]);
    setNotice(`${name}: ${retry ? "retry" : "run"} simulation complete. See the new log entry; no live job was executed.`);
  }

  return <div className="space-y-6">
    <ScreenHeader eyebrow="BEHIND THE SCENES" title="Agent Activity" description="A clear view of what your agents are doing, and what needs your attention." actions={<Button variant="secondary" onClick={() => { exportCSV("agent-runs.csv", [["Agent", "Status", "Time", "Duration", "Result", "Mode"], ...visible.map(run => [run.agent, run.status, run.time, run.duration, run.result, "preview simulation"])]); setNotice("Visible run logs exported."); }}><LuDownload size={14} />Export logs</Button>} />
    <section aria-label="Agent run summary" className="grid grid-cols-4 gap-4 max-[1100px]:grid-cols-2 max-[560px]:grid-cols-1">
      <StatCard label="Available agents" value={agents.length - paused.length} detail="Enabled for manual runs" icon={<LuActivity size={18} />} />
      <StatCard label="Completed runs" value={runs.filter(run => run.status === "Complete").length} detail="Illustrative runs in this activity log" icon={<LuCheck size={18} />} tone="bg-dash-sage text-dash-green" />
      <StatCard label="Needs attention" value={runs.filter(run => run.status === "Needs attention").length} detail="failures stay in your history" icon={<LuCircleAlert size={18} />} tone="bg-dash-sand text-dash-orange" />
      <StatCard label="Paused agents" value={paused.length} detail="Local controls · No backend scheduling" icon={<LuPause size={18} />} tone="bg-dash-lavender text-dash-purple" />
    </section>
    <section aria-label="Agent controls" className="grid grid-cols-4 gap-4 max-[1100px]:grid-cols-2 max-[560px]:grid-cols-1">{agents.map(agent => <article key={agent.name} className="rounded-[18px] border border-dash-border bg-dash-card p-5"><div className="flex items-center justify-between gap-3"><span className={`grid size-10 place-items-center rounded-xl ${agent.tone}`}><agent.icon size={20} aria-hidden="true" /></span><span className={`rounded-md px-2 py-1 text-[12px] ${paused.includes(agent.name) ? "bg-dash-bg text-dash-muted" : "bg-dash-sage text-dash-green"}`}>{paused.includes(agent.name) ? "Paused" : "Ready"}</span></div><h2 className="mt-4 !text-sm !tracking-normal">{agent.name}</h2><p className="mt-2 min-h-10 text-sm leading-5 text-dash-muted">{agent.description}</p><div className="mt-4 flex items-center gap-2 border-t border-dash-border pt-4"><Button variant="secondary" disabled={paused.includes(agent.name)} className="flex-1 disabled:cursor-not-allowed disabled:opacity-50" onClick={() => runDemo(agent.name)}><LuPlay size={13} />Preview run</Button><button aria-label={`${paused.includes(agent.name) ? "Resume" : "Pause"} ${agent.name}`} aria-pressed={paused.includes(agent.name)} onClick={() => { setPaused(previous => previous.includes(agent.name) ? previous.filter(name => name !== agent.name) : [...previous, agent.name]); setNotice(`${agent.name} ${paused.includes(agent.name) ? "resumed" : "paused"} in this local preview.`); }} className="grid size-9 place-items-center rounded-lg border border-dash-border text-dash-muted hover:bg-dash-peach">{paused.includes(agent.name) ? <LuPlay size={14} /> : <LuPause size={14} />}</button></div></article>)}</section>
    <section className="rounded-[18px] border border-dash-border bg-dash-card p-5"><div className="mb-5 flex flex-wrap items-center justify-between gap-4"><div><h2 className="!text-base">Run history</h2><p className="mt-2 text-[12px] text-dash-muted">Every simulated action, in one place.</p></div><div className="flex flex-wrap gap-2"><Input type="search" aria-label="Search activity" startIcon={<LuSearch size={14} />} placeholder="Search activity" value={query} onChange={event => setQuery(event.target.value)} /><Select aria-label="Filter agent" value={agentFilter} onChange={event => setAgentFilter(event.target.value)}><option>All agents</option>{agents.map(agent => <option key={agent.name}>{agent.name}</option>)}</Select><Select aria-label="Filter run status" value={statusFilter} onChange={event => setStatusFilter(event.target.value)}>{["All statuses", "Complete", "Needs attention"].map(status => <option key={status}>{status}</option>)}</Select></div></div><Table aria-label="preview agent run history" className="min-w-[760px]"><TableHeader><TableRow>{["AGENT", "RESULT", "TIME", "DURATION", "STATUS", ""].map((title, index) => <TableHead key={index}>{title || <span className="sr-only">Actions</span>}</TableHead>)}</TableRow></TableHeader><TableBody>{visible.map(run => <TableRow key={run.id}><TableCell className="font-medium">{run.agent}</TableCell><TableCell>{run.result}</TableCell><TableCell className="text-dash-muted">{run.time}</TableCell><TableCell className="text-dash-muted">{run.duration}</TableCell><TableCell><span className={`whitespace-nowrap rounded-md px-2 py-1.5 text-[12px] ${run.status === "Complete" ? "bg-dash-sage text-dash-green" : "bg-dash-peach text-dash-primary"}`}>{run.status}</span></TableCell><TableCell><div className="flex gap-2"><button aria-label={`View ${run.agent} run details`} onClick={() => { setSelected(run); dialog.current?.showModal(); }} className="grid size-8 place-items-center rounded-lg hover:bg-dash-peach"><LuArrowUpRight size={15} /></button>{run.status === "Needs attention" && <button aria-label={`Retry ${run.agent} simulation`} onClick={() => runDemo(run.agent, true)} className="grid size-8 place-items-center rounded-lg text-dash-primary hover:bg-dash-peach"><LuRefreshCw size={14} /></button>}</div></TableCell></TableRow>)}</TableBody></Table>{!visible.length && <p className="py-12 text-center text-sm text-dash-muted">No runs match these filters.</p>}<p aria-live="polite" className="mt-3 text-[12px] text-dash-muted">{visible.length} run entries</p></section>
    <Feedback message={notice} onDismiss={() => setNotice("")} />
    <dialog ref={dialog} aria-labelledby="run-title" className="m-auto w-[min(480px,90vw)] rounded-[18px] border border-dash-border bg-dash-card p-6 text-dash-text backdrop:bg-black/30"><div className="flex items-center justify-between gap-4"><h2 id="run-title" className="!text-lg">{selected?.agent}</h2><button aria-label="Close run details" onClick={() => dialog.current?.close()}><LuX size={18} /></button></div><p className="mt-2 text-sm text-dash-muted">{selected?.time} · {selected?.status}</p><p className="mt-5 text-sm font-medium">{selected?.result}</p><p className="mt-3 text-sm leading-7 text-dash-muted">{selected?.detail}</p><Button className="mt-5" onClick={() => dialog.current?.close()}>Got it</Button></dialog>
  </div>;
}
