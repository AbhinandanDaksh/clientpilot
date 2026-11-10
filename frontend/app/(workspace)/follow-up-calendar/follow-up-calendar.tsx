"use client";

import { useRef, useState, type FormEvent } from "react";
import { LuCalendarDays, LuCheck, LuChevronLeft, LuChevronRight, LuClock, LuPlus, LuX } from "react-icons/lu";
import ScreenHeader from "@/components/layout/screen-header";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Textarea from "@/components/ui/textarea";
import StatCard from "@/components/ui/stat-card";

type FollowUp = { id: number; client: string; date: string; time: string; channel: string; note: string; done: boolean };
const dayKey = (date: Date) => date.toISOString().slice(0, 10);
const fromKey = (date: string) => new Date(date + "T12:00:00Z");
const prettyDate = (date: string) => new Intl.DateTimeFormat("en-IN", { timeZone: "UTC", day: "numeric", month: "long", year: "numeric" }).format(fromKey(date));
const panel = "rounded-[18px] border border-dash-border bg-dash-card p-5";

export default function FollowUpCalendar({ today }: { today: string }) {
  const [month, setMonth] = useState(() => fromKey(today));
  const [selected, setSelected] = useState(today);
  const [view, setView] = useState("All follow-ups");
  const [notice, setNotice] = useState("");
  const [tasks, setTasks] = useState<FollowUp[]>(() => {
    const next = fromKey(today); next.setUTCDate(next.getUTCDate() + 2);
    return [
      { id: 1, client: "The Daily Grind", date: today, time: "10:00", channel: "Instagram DM", note: "Suggest a 15-minute discovery call.", done: false },
      { id: 2, client: "Bloom Dental Studio", date: today, time: "14:30", channel: "Email", note: "Check whether the booking overview was useful.", done: false },
      { id: 3, client: "Nook & Nest", date: dayKey(next), time: "11:00", channel: "Instagram DM", note: "Share a focused first-phase outline.", done: false },
      { id: 4, client: "Aura Skin & Spa", date: today, time: "09:00", channel: "Email", note: "Confirm scope and content readiness.", done: true },
    ];
  });
  const dialog = useRef<HTMLDialogElement>(null);
  const first = new Date(Date.UTC(month.getUTCFullYear(), month.getUTCMonth(), 1, 12));
  const days = new Date(Date.UTC(month.getUTCFullYear(), month.getUTCMonth() + 1, 0)).getUTCDate();
  const offset = (first.getUTCDay() + 6) % 7;
  const visible = tasks.filter(task => task.date === selected && (view === "All follow-ups" || (view === "Completed" ? task.done : !task.done))).sort((a, b) => a.time.localeCompare(b.time));
  function navigate(step: number) { const next = new Date(Date.UTC(month.getUTCFullYear(), month.getUTCMonth() + step, 1, 12)); setMonth(next); setSelected(dayKey(next)); }
  function addTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const client = String(data.get("client") || "").trim();
    if (!client) return;
    const date = String(data.get("date"));
    setTasks(previous => [...previous, { id: Date.now(), client, date, time: String(data.get("time")), channel: String(data.get("channel")), note: String(data.get("note") || "").trim(), done: false }]);
    setSelected(date); setMonth(fromKey(date)); setView("All follow-ups"); dialog.current?.close(); event.currentTarget.reset(); setNotice("Follow-up saved locally. No external reminder has been scheduled.");
  }

  return <div className="space-y-6">
    <ScreenHeader eyebrow="A LITTLE FOLLOW-THROUGH" title="Follow-up Calendar" description="Make space for the conversations that deserve another thoughtful touch." actions={<Button onClick={() => dialog.current?.showModal()}><LuPlus size={15} />Add follow-up</Button>} />
    <section aria-label="Follow-up summary" className="grid grid-cols-3 gap-4 max-[700px]:grid-cols-1">
      <StatCard label="Due today" value={tasks.filter(task => task.date === today && !task.done).length} detail="Pending follow-ups for today · IST" icon={<LuCalendarDays size={18} />} />
      <StatCard label="Upcoming" value={tasks.filter(task => task.date > today && !task.done).length} detail="Next steps on your local calendar" icon={<LuClock size={18} />} tone="bg-dash-lavender text-dash-purple" />
      <StatCard label="Completed" value={tasks.filter(task => task.done).length} detail="Small actions, meaningful momentum" icon={<LuCheck size={18} />} tone="bg-dash-sage text-dash-green" />
    </section>
    <div className="grid grid-cols-[minmax(0,1.5fr)_minmax(270px,1fr)] items-start gap-4 max-[1000px]:grid-cols-1">
      <section className={panel} aria-label="Monthly follow-up calendar">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><h2 className="!text-lg">{new Intl.DateTimeFormat("en-IN", { timeZone: "UTC", month: "long", year: "numeric" }).format(month)}</h2><div className="flex items-center gap-2"><Button variant="secondary" onClick={() => { setMonth(fromKey(today)); setSelected(today); }}>Today</Button><button aria-label="Previous month" onClick={() => navigate(-1)} className="grid size-9 place-items-center rounded-lg border border-dash-border hover:bg-dash-sage"><LuChevronLeft size={16} /></button><button aria-label="Next month" onClick={() => navigate(1)} className="grid size-9 place-items-center rounded-lg border border-dash-border hover:bg-dash-sage"><LuChevronRight size={16} /></button></div></div>
        <div className="grid grid-cols-7 gap-1">{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => <span key={day} className="py-3 text-center text-[10px] font-medium text-dash-muted">{day}</span>)}{Array.from({ length: offset }, (_, index) => <span key={`blank-${index}`} />)}{Array.from({ length: days }, (_, index) => {
          const date = dayKey(new Date(Date.UTC(month.getUTCFullYear(), month.getUTCMonth(), index + 1, 12)));
          const scheduled = tasks.filter(task => task.date === date);
          const pending = scheduled.filter(task => !task.done).length;
          return <button key={date} aria-pressed={selected === date} aria-current={date === today ? "date" : undefined} aria-label={`${prettyDate(date)}, ${pending} pending, ${scheduled.length - pending} completed follow-ups`} onClick={() => setSelected(date)} className={`flex min-h-24 min-w-0 flex-col items-start rounded-xl border p-2 text-left max-[560px]:min-h-16 ${date === selected ? "border-dash-primary bg-dash-peach/50" : "border-dash-border/70 hover:bg-dash-sage/40"}`}><span className={`grid size-6 place-items-center rounded-full text-[11px] ${date === today ? "bg-dash-primary text-dash-white" : "text-dash-text"}`}>{index + 1}</span>{scheduled.length > 0 && <><span className="mt-auto flex gap-1 pt-2" aria-hidden="true">{scheduled.slice(0, 3).map(task => <i key={task.id} className={`size-1.5 rounded-full ${task.done ? "bg-dash-green" : "bg-dash-primary"}`} />)}</span><span className="mt-1 text-[8px] text-dash-muted max-[560px]:hidden">{scheduled.length} follow-up{scheduled.length > 1 ? "s" : ""}</span></>}</button>;
        })}</div>
        <div className="mt-5 flex gap-4 text-[10px] text-dash-muted"><span className="flex items-center gap-2"><i className="size-1.5 rounded-full bg-dash-primary" />Pending</span><span className="flex items-center gap-2"><i className="size-1.5 rounded-full bg-dash-green" />Completed</span><span className="ml-auto">All times IST</span></div>
      </section>
      <section className={panel} aria-labelledby="agenda-title"><h2 id="agenda-title" className="!text-base">Your day, thoughtfully planned</h2><p className="mt-2 text-xs text-dash-muted">{prettyDate(selected)}</p><Select aria-label="Filter agenda" value={view} onChange={event => setView(event.target.value)} className="mt-5 w-full">{["All follow-ups", "Pending", "Completed"].map(item => <option key={item}>{item}</option>)}</Select><ul className="mt-4 space-y-3">{visible.map(task => <li key={task.id} className="rounded-xl border border-dash-border p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-[10px] text-dash-primary">{task.time} IST · {task.channel}</p><h3 className="mt-2 text-sm font-semibold">{task.client}</h3></div><button aria-label={`Delete follow-up for ${task.client}`} onClick={() => { setTasks(previous => previous.filter(item => item.id !== task.id)); setNotice("Follow-up removed from your local calendar."); }} className="text-dash-muted hover:text-dash-primary"><LuX size={14} /></button></div><p className="mt-3 text-xs leading-6 text-dash-muted">{task.note || "No notes added."}</p><button aria-pressed={task.done} onClick={() => { setTasks(previous => previous.map(item => item.id === task.id ? { ...item, done: !item.done } : item)); setNotice(task.done ? "Follow-up reopened." : "Follow-up marked complete. No message was sent."); }} className={`mt-3 inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[10px] ${task.done ? "bg-dash-sage text-dash-green" : "bg-dash-peach text-dash-primary"}`}><LuCheck size={12} />{task.done ? "Completed · Reopen" : "Mark complete"}</button></li>)}</ul>{!visible.length && <div className="py-10 text-center"><LuCalendarDays size={26} className="mx-auto text-dash-muted" /><p className="mt-3 text-xs text-dash-muted">No follow-ups in this view.</p><button onClick={() => dialog.current?.showModal()} className="mt-3 text-xs text-dash-primary">Plan a thoughtful next step</button></div>}</section>
    </div>
    <p role="status" className="text-xs leading-6 text-dash-muted">{notice || "Demo calendar · Changes last during this visit. No emails, reminders or calendar invitations are sent."}</p>
    <dialog ref={dialog} aria-labelledby="follow-up-title" className="m-auto w-[min(460px,90vw)] rounded-[18px] border border-dash-border bg-dash-card p-6 text-dash-text backdrop:bg-black/30"><form onSubmit={addTask} className="space-y-4"><div className="flex items-center justify-between"><h2 id="follow-up-title" className="!text-lg">Add follow-up</h2><button type="button" aria-label="Close follow-up form" onClick={() => dialog.current?.close()}><LuX size={18} /></button></div><label className="block text-xs">Client<Input name="client" required maxLength={100} className="mt-2" /></label><div className="grid grid-cols-2 gap-3"><label className="text-xs">Date<Input type="date" name="date" required defaultValue={selected} className="mt-2" /></label><label className="text-xs">Time (IST)<Input type="time" name="time" required defaultValue="10:00" className="mt-2" /></label></div><label className="block text-xs">Channel<Select name="channel" className="mt-2 w-full">{["Email", "Instagram DM", "LinkedIn", "Call"].map(item => <option key={item}>{item}</option>)}</Select></label><label className="block text-xs">Notes<Textarea name="note" placeholder="A helpful reason to reconnect..." maxLength={500} className="mt-2 min-h-24" /></label><Button type="submit" className="w-full">Save follow-up</Button></form></dialog>
  </div>;
}
