"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { LuArrowUpRight, LuCheck, LuClock, LuDownload, LuMail, LuMessageCircle, LuSearch, LuX } from "react-icons/lu";
import ScreenHeader from "@/components/layout/screen-header";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import StatCard from "@/components/ui/stat-card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { exportCSV } from "@/common/export-csv";

type Conversation = { id: number; name: string; initials: string; channel: string; preview: string; time: string; unread: boolean; status: string; archived: boolean };
const samples: Conversation[] = [
  { id: 1, name: "The Daily Grind", initials: "TG", channel: "Instagram DM", preview: "That sounds fair. Tell me a little more about how you work.", time: "12 min ago", unread: true, status: "Needs reply", archived: false },
  { id: 2, name: "Bloom Dental Studio", initials: "BD", channel: "Email", preview: "We'd like to make booking appointments easier. What would you need from us?", time: "Yesterday", unread: false, status: "Following up", archived: false },
  { id: 3, name: "Nook & Nest", initials: "NN", channel: "Instagram DM", preview: "We're considering a website, but we want to start small.", time: "Yesterday", unread: true, status: "Needs reply", archived: false },
  { id: 4, name: "Aura Skin & Spa", initials: "AS", channel: "Email", preview: "How long would a new website take?", time: "Yesterday", unread: false, status: "Active", archived: false },
  { id: 5, name: "The Fern House", initials: "FH", channel: "LinkedIn", preview: "Thank you for the overview. We'll get back to you next month.", time: "3 days ago", unread: false, status: "Waiting", archived: false },
];

export default function Conversations() {
  const [items, setItems] = useState(samples);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("All conversations");
  const [channel, setChannel] = useState("All channels");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [notice, setNotice] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const selected = items.find(item => item.id === selectedId);
  const visible = items.filter(item => (tab === "Archived" ? item.archived : !item.archived) && (tab !== "Unread" || item.unread) && (tab !== "Needs reply" || item.status === "Needs reply") && (channel === "All channels" || item.channel === channel) && `${item.name} ${item.preview}`.toLowerCase().includes(query.toLowerCase()));
  const active = items.filter(item => !item.archived);
  function view(item: Conversation) { setSelectedId(item.id); setItems(previous => previous.map(row => row.id === item.id ? { ...row, unread: false } : row)); dialog.current?.showModal(); }

  return <div className="space-y-6">
    <ScreenHeader eyebrow="EVERY CONNECTION COUNTS" title="Conversations" description="Keep track of replies, find your next step, and pick up where you left off." actions={<Button variant="secondary" onClick={() => { exportCSV("demo-conversations.csv", [["Client", "Channel", "Status", "Preview", "Archived"], ...visible.map(item => [item.name, item.channel, item.status, item.preview, String(item.archived)])]); setNotice("Visible demo conversations exported."); }}><LuDownload size={14} />Export</Button>} />
    <section aria-label="Conversation summary" className="grid grid-cols-4 gap-4 max-[1100px]:grid-cols-2 max-[560px]:grid-cols-1">
      <StatCard label="Active conversations" value={active.length} detail="Connections in your demo inbox" icon={<LuMessageCircle size={18} />} />
      <StatCard label="Unread replies" value={active.filter(item => item.unread).length} detail="A little attention goes a long way" icon={<LuMail size={18} />} tone="bg-dash-lavender text-dash-purple" />
      <StatCard label="Needs your reply" value={active.filter(item => item.status === "Needs reply").length} detail="Keep the conversation moving" icon={<LuClock size={18} />} tone="bg-dash-sand text-dash-orange" />
      <StatCard label="Follow-ups" value={active.filter(item => item.status === "Following up").length} detail="Thoughtful next steps to plan" icon={<LuCheck size={18} />} tone="bg-dash-sage text-dash-green" />
    </section>
    <section className="rounded-[18px] border border-dash-border bg-dash-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-4"><div><h2 className="!text-base">Your inbox</h2><p className="mt-2 text-[11px] text-dash-muted">A clear view of your client conversations.</p></div><div className="flex flex-wrap gap-2"><Input type="search" aria-label="Search conversations" startIcon={<LuSearch size={14} />} placeholder="Search clients or messages" value={query} onChange={event => setQuery(event.target.value)} /><Select aria-label="Filter channel" value={channel} onChange={event => setChannel(event.target.value)}>{["All channels", "Email", "Instagram DM", "LinkedIn"].map(item => <option key={item}>{item}</option>)}</Select></div></div>
      <div role="group" aria-label="Inbox view" className="my-5 flex flex-wrap gap-2">{["All conversations", "Unread", "Needs reply", "Archived"].map(item => <button key={item} aria-pressed={tab === item} onClick={() => setTab(item)} className={`rounded-lg px-3 py-2 text-[11px] ${tab === item ? "bg-dash-peach text-dash-primary" : "bg-dash-bg text-dash-muted"}`}>{item}</button>)}</div>
      <Table aria-label="Client conversations" className="min-w-[740px]"><TableHeader><TableRow>{["CLIENT", "LATEST MESSAGE", "CHANNEL", "STATUS", ""].map((title, index) => <TableHead key={index}>{title || <span className="sr-only">View conversation</span>}</TableHead>)}</TableRow></TableHeader><TableBody>{visible.map(item => <TableRow key={item.id}><TableCell><div className="flex items-center gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-dash-sage text-[10px] text-dash-green">{item.initials}</span><div><button onClick={() => view(item)} className="text-left font-semibold hover:text-dash-primary">{item.name}</button><p className="mt-1 text-[10px] text-dash-muted">{item.time}</p></div>{item.unread && <span className="size-1.5 rounded-full bg-dash-primary" aria-label="Unread" />}</div></TableCell><TableCell className="max-w-64"><p className="truncate text-dash-muted" title={item.preview}>{item.preview}</p></TableCell><TableCell>{item.channel}</TableCell><TableCell><span className={`rounded-md px-2 py-1.5 text-[10px] ${item.status === "Needs reply" ? "bg-dash-peach text-dash-primary" : "bg-dash-sage text-dash-green"}`}>{item.status}</span></TableCell><TableCell><button aria-label={`View ${item.name}`} onClick={() => view(item)} className="grid size-8 place-items-center rounded-lg hover:bg-dash-peach"><LuArrowUpRight size={16} /></button></TableCell></TableRow>)}</TableBody></Table>
      {!visible.length && <p className="py-12 text-center text-xs text-dash-muted">No conversations match this view. Try another filter.</p>}
      <p aria-live="polite" className="mt-3 text-[10px] text-dash-muted">{visible.length} conversations</p>
    </section>
    <p role="status" className="text-xs leading-6 text-dash-muted">{notice || "Sample inbox · Changes last during this visit. No external inbox is connected."}</p>
    <dialog ref={dialog} aria-labelledby="conversation-detail" className="m-auto w-[min(500px,90vw)] rounded-[18px] border border-dash-border bg-dash-card p-6 text-dash-text backdrop:bg-black/30"><div className="flex justify-between gap-4"><h2 id="conversation-detail" className="!text-lg">{selected?.name}</h2><button aria-label="Close conversation" onClick={() => dialog.current?.close()}><LuX size={18} /></button></div><p className="mt-2 text-xs text-dash-muted">{selected?.channel} · Sample conversation</p><p className="my-5 rounded-xl bg-dash-bg p-4 text-xs leading-7">{selected?.preview}</p><div className="flex flex-wrap gap-3"><Link href="/deal-room" className="inline-flex items-center gap-1 rounded-lg bg-dash-primary px-3 py-3 text-xs font-medium text-dash-white">Open Deal Room<LuArrowUpRight size={14} /></Link><Button variant="secondary" onClick={() => { setItems(previous => previous.map(item => item.id === selectedId ? { ...item, unread: !item.unread } : item)); setNotice("Unread status updated locally."); }}>Mark {selected?.unread ? "read" : "unread"}</Button><Button variant="secondary" onClick={() => { setItems(previous => previous.map(item => item.id === selectedId ? { ...item, archived: !item.archived } : item)); setNotice(selected?.archived ? "Conversation restored." : "Conversation archived locally."); dialog.current?.close(); }}>{selected?.archived ? "Restore" : "Archive"}</Button></div></dialog>
  </div>;
}
