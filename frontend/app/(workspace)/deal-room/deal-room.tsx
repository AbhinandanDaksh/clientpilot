"use client";

import Feedback from "@/components/ui/feedback";

import { useRef, useState, type FormEvent } from "react";
import { LuArrowLeft, LuArrowUpRight, LuListChecks, LuCheck, LuCopy, LuPlus, LuSearch, LuFileText, LuSparkles, LuX } from "react-icons/lu";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Textarea from "@/components/ui/textarea";
import { usePersistentState } from "@/common/use-persistent-state";
import { demoClients, type Client } from "./data";

type SavedDraft = { id: number; clientId: number; text: string; time: string };
const panel = "rounded-[18px] border border-dash-border bg-dash-card p-5";
const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null;
const validClients = (value: unknown): value is Client[] => Array.isArray(value) && value.length > 0 && value.every(c => isRecord(c) && typeof c.id === "number" && ["name", "initials", "channel", "status", "activity", "intent", "suggestion", "caution", "action"].every(key => typeof c[key] === "string") && typeof c.unread === "boolean" && Array.isArray(c.messages) && c.messages.every(m => isRecord(m) && typeof m.text === "string" && typeof m.time === "string" && (m.outgoing === undefined || typeof m.outgoing === "boolean")));
const validReplies = (value: unknown): value is Record<number, string> => isRecord(value) && Object.values(value).every(v => typeof v === "string");
const validDrafts = (value: unknown): value is SavedDraft[] => Array.isArray(value) && value.every(d => isRecord(d) && typeof d.id === "number" && typeof d.clientId === "number" && typeof d.text === "string" && typeof d.time === "string");
const validPlan = (value: unknown): value is number[] => Array.isArray(value) && value.every(id => typeof id === "number");

export default function DealRoom() {
  const [notice, setNotice] = useState("");
  const [storageError, setStorageError] = useState(false);
  const storageFailed = () => setStorageError(true);
  const [clients, setClients] = usePersistentState("clientpilot:deal-room:clients:v1", demoClients, validClients, storageFailed);
  const [selected, setSelected] = useState(1);
  const [query, setQuery] = useState("");
  const [replies, setReplies] = usePersistentState<Record<number, string>>("clientpilot:deal-room:replies:v1", {}, validReplies, storageFailed);
  const [saved, setSaved] = usePersistentState<SavedDraft[]>("clientpilot:deal-room:drafts:v1", [], validDrafts, storageFailed);
  const [planned, setPlanned] = usePersistentState<number[]>("clientpilot:deal-room:plan:v1", [], validPlan, storageFailed);
  const [mobileConversation, setMobileConversation] = useState(false);
  const addDialog = useRef<HTMLDialogElement>(null);
  const composer = useRef<HTMLTextAreaElement>(null);
  const current = clients.find(client => client.id === selected) ?? clients[0];
  const visible = clients.filter(client => client.name.toLowerCase().includes(query.toLowerCase()));
  const reply = replies[selected] || "";
  const drafts = saved.filter(draft => draft.clientId === selected);
  function chooseClient(id: number) {
    setSelected(id); setNotice(""); setMobileConversation(true);
    setClients(previous => previous.map(client => client.id === id ? { ...client, unread: false } : client));
  }
  async function copySuggestion() {
    try { await navigator.clipboard.writeText(current.suggestion); setNotice("Suggestion copied to clipboard. Review it before using."); }
    catch { setNotice("Clipboard unavailable. Use the suggestion in the composer and copy it manually."); }
  }
  function addClient(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    if (!name) return;
    if (clients.some(client => client.name.toLowerCase() === name.toLowerCase())) { setNotice("This client is already in the list."); return; }
    const client: Client = { id: Date.now(), name, initials: name.split(/\s+/).slice(0, 2).map(word => word[0]).join("").toUpperCase(), channel: String(form.get("channel")), status: "New", unread: false, activity: "No messages yet", intent: "Waiting for conversation context", suggestion: "Thanks for connecting. I'd love to learn about your goals and what you need from your website. Would you be open to a short conversation?", caution: "Ask about goals and scope before making recommendations.", action: "Start a discovery conversation", messages: [] };
    setClients(previous => [...previous, client]); setSelected(client.id); setMobileConversation(true); setQuery(""); event.currentTarget.reset(); addDialog.current?.close(); setNotice("Client saved in this browser. No external account was connected.");
  }
  function saveDraft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!reply.trim()) return;
    const time = new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit" }).format(new Date());
    setSaved(previous => [...previous, { id: Date.now(), clientId: selected, text: reply.trim(), time: `${time} IST` }]);
    setReplies(previous => ({ ...previous, [selected]: "" }));
    setNotice(`Draft for ${current.name} saved in this browser. No message was sent.`);
  }

  return <div className="space-y-6">
    <header className="flex flex-wrap items-end justify-between gap-4 pt-3">
      <div><p className="mb-3 text-[12px] font-medium tracking-[1.8px] text-dash-muted">CLIENT CONVERSATIONS</p><h1 className="text-[32px] font-semibold tracking-[-1px]">Deal Room</h1><p className="mt-3 text-sm leading-6 text-dash-muted">Keep every conversation thoughtful, focused, and moving forward.</p></div>
    </header>

    <div className="grid grid-cols-[minmax(190px,0.8fr)_minmax(0,1.45fr)_minmax(230px,1fr)] items-stretch gap-4 max-[1150px]:grid-cols-[220px_minmax(0,1fr)] max-[700px]:grid-cols-1">
      <aside className={`${panel} ${mobileConversation ? "max-[700px]:hidden" : ""}`} aria-labelledby="clients-title">
        <div className="mb-5 flex items-center justify-between"><h2 id="clients-title" className="!text-base !tracking-tight">Clients</h2><button aria-label="Add client" onClick={() => addDialog.current?.showModal()} className="grid size-7 place-items-center rounded-lg text-dash-muted hover:bg-dash-peach"><LuPlus size={17} aria-hidden="true" /></button></div>
        <div className="[&>span]:w-full"><Input type="search" aria-label="Search clients" placeholder="Search clients" value={query} onChange={event => setQuery(event.target.value)} startIcon={<LuSearch size={14} />} /></div>
        <ul className="mt-3 space-y-1 max-[700px]:max-h-[65dvh] max-[700px]:overflow-y-auto">{visible.map(client => <li key={client.id}><button aria-current={client.id === selected ? "true" : undefined} onClick={() => chooseClient(client.id)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors ${client.id === selected ? "bg-dash-peach/60" : "hover:bg-dash-sage/40"}`}>
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-dash-sage text-[12px] font-semibold text-dash-muted">{client.initials}</span><span className="min-w-0 flex-1"><span className="block text-sm font-medium leading-5">{client.name}</span><span className="mt-1 block truncate text-[12px] text-dash-muted">{client.messages.at(-1)?.text ?? "No messages yet"}</span><span className="mt-1 block text-[12px] text-dash-muted">{client.channel} · {client.activity}</span>{client.unread && <span className="mt-1 block text-[12px] font-medium text-dash-primary">Unread reply</span>}</span>
        </button></li>)}</ul>
        {!visible.length && <p className="py-8 text-center text-sm text-dash-muted">No clients match your search.</p>}
      </aside>

      <section className={`${panel} flex min-h-[580px] min-w-0 flex-col ${mobileConversation ? "" : "max-[700px]:hidden"}`} aria-labelledby="conversation-title">
        <button onClick={() => setMobileConversation(false)} className="mb-4 flex min-h-11 items-center gap-2 self-start rounded-lg px-2 text-sm text-dash-primary min-[701px]:hidden"><LuArrowLeft aria-hidden="true" />All clients</button>
        <div className="flex items-start justify-between gap-3 border-b border-dash-border pb-5"><div><p className="mb-1 text-[12px] tracking-[1.6px] text-dash-muted">ACTIVE CONVERSATION</p><h2 id="conversation-title" className="!text-base !tracking-tight">{current.name}</h2><p className="mt-2 text-[12px] text-dash-muted">{current.channel} · conversation</p></div><span className="rounded-md bg-dash-peach px-2 py-1.5 text-[12px] text-dash-primary">{current.status}</span></div>
        <ol aria-label={`Conversation with ${current.name}`} className="flex max-h-[380px] flex-1 flex-col gap-3 overflow-y-auto py-6">
          {current.messages.map((message, index) => <li key={index} className={`max-w-[88%] rounded-2xl px-4 py-3 ${message.outgoing ? "ml-auto bg-dash-peach" : "mr-auto bg-dash-bg"}`}><p className="whitespace-pre-wrap break-words text-sm leading-6">{message.text}</p><p className="mt-1 text-[12px] text-dash-muted">{message.time}</p></li>)}
          {!current.messages.length && <li className="py-10 text-center text-sm leading-6 text-dash-muted">No messages yet. Prepare an introduction below.</li>}
        </ol>
        <form onSubmit={saveDraft} className="mt-auto border-t border-dash-border pt-4">
          <details className="mb-4 rounded-xl border border-dash-border bg-dash-sage/40 p-3 min-[1151px]:hidden"><summary className="cursor-pointer py-2 text-sm font-medium text-dash-primary">AI suggested reply</summary><p className="mt-3 text-sm leading-6">{current.suggestion}</p><Button type="button" variant="secondary" className="mt-3" onClick={() => { setReplies(previous => ({ ...previous, [selected]: previous[selected]?.trim() ? `${previous[selected]}\n\n${current.suggestion}` : current.suggestion })); composer.current?.focus(); }}>Use suggestion</Button></details>
          <Textarea ref={composer} aria-label={`Reply draft for ${current.name}`} placeholder="Write a reply..." value={reply} onChange={event => setReplies(previous => ({ ...previous, [selected]: event.target.value }))} maxLength={3000} className="min-h-24" />
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3"><p className="text-[12px] text-dash-muted">Saved in this browser · not sent</p><Button type="submit" disabled={!reply.trim()} className="disabled:cursor-not-allowed disabled:opacity-50"><LuFileText size={16} aria-hidden="true" />Save draft</Button></div>
        </form>
      </section>

      <aside className={`${panel} bg-dash-sidebar/40 max-[1150px]:col-span-2 max-[700px]:col-span-1 ${mobileConversation ? "" : "max-[700px]:hidden"}`} aria-labelledby="assistant-title">
        <div className="flex items-center gap-3 border-b border-dash-border pb-5"><span className="grid size-10 place-items-center rounded-xl bg-dash-lavender text-dash-purple"><LuSparkles size={20} aria-hidden="true" /></span><div><h2 id="assistant-title" className="!text-sm !font-medium !tracking-normal">AI Deal Assistant</h2><p className="mt-1 text-[12px] text-dash-muted">Context-aware suggestions</p></div></div>
        <div className="border-b border-dash-border py-5"><h3 className="text-[12px] font-medium tracking-[1.2px] text-dash-muted">CLIENT INTENT</h3><p className="mt-3 text-sm font-medium leading-6">{current.intent}</p></div>
        <div className="border-b border-dash-border py-5 max-[1150px]:hidden"><h3 className="text-[12px] font-medium tracking-[1.2px] text-dash-muted">SUGGESTED REPLY</h3><p className="mt-3 text-sm leading-6">“{current.suggestion}”</p><div className="mt-3 flex flex-wrap gap-3"><button onClick={() => void copySuggestion()} className="inline-flex items-center gap-1.5 text-[12px] font-medium text-dash-primary"><LuCopy size={13} aria-hidden="true" />Copy suggestion</button><button onClick={() => { setReplies(previous => ({ ...previous, [selected]: previous[selected]?.trim() ? `${previous[selected]}\n\n${current.suggestion}` : current.suggestion })); composer.current?.focus(); setNotice("Suggestion added to your reply. Review it before saving a draft."); }} className="inline-flex items-center gap-1 text-[12px] font-medium text-dash-primary">Use suggestion<LuArrowUpRight size={12} aria-hidden="true" /></button></div></div>
        <details className="border-b border-dash-border py-5"><summary className="cursor-pointer text-[12px] font-medium tracking-[1.2px] text-dash-muted">REPLY GUIDANCE</summary><p className="mt-3 text-sm leading-6">{current.caution}</p></details>
        <button aria-pressed={planned.includes(selected)} onClick={() => { setPlanned(previous => previous.includes(selected) ? previous.filter(id => id !== selected) : [...previous, selected]); setNotice(planned.includes(selected) ? "Follow-up removed from your local plan." : "Action added to your local plan. No calendar event or reminder was created."); }} className="mt-5 flex w-full items-start gap-3 rounded-xl bg-dash-peach/70 p-4 text-left hover:bg-dash-peach"><LuListChecks size={16} className="shrink-0 text-dash-primary" aria-hidden="true" /><span><span className="block text-[12px] font-medium tracking-wider text-dash-muted">NEXT RECOMMENDED ACTION</span><span className="mt-2 block text-[12px] font-medium">{current.action}</span><span className="mt-2 flex items-center gap-1 text-[12px] text-dash-muted">{planned.includes(selected) && <LuCheck size={12} aria-hidden="true" />}{planned.includes(selected) ? "Added to local plan" : "Add to plan"}</span></span></button>
      </aside>
    </div>

    {drafts.length > 0 && <section className={panel} aria-labelledby="drafts-title"><h2 id="drafts-title" className="!text-base !tracking-tight">Saved drafts · {current.name}</h2><p className="mt-2 text-[12px] text-dash-muted">Saved in this browser across visits. These replies have not been sent.</p><ul className="mt-4 divide-y divide-dash-border">{drafts.map(draft => <li key={draft.id} className="flex items-start gap-4 py-4"><div className="min-w-0 flex-1"><p className="whitespace-pre-wrap break-words text-sm leading-6">{draft.text}</p><p className="mt-2 text-[12px] text-dash-muted">Draft · {draft.time}</p></div><button aria-label="Delete saved draft" onClick={() => { setSaved(previous => previous.filter(item => item.id !== draft.id)); setNotice("Saved draft deleted."); }} className="grid size-7 shrink-0 place-items-center rounded-lg text-dash-muted hover:bg-dash-peach"><LuX size={15} aria-hidden="true" /></button></li>)}</ul></section>}
    {storageError && <p role="alert" className="rounded-xl border border-dash-primary bg-dash-peach p-4 text-sm leading-6">Browser storage is unavailable. Your changes are kept for this visit only. Copy important drafts before leaving.</p>}
    <Feedback message={notice} onDismiss={() => setNotice("")} />
    <dialog ref={addDialog} aria-labelledby="add-client-title" className="m-auto w-[min(440px,90vw)] rounded-[18px] border border-dash-border bg-dash-card p-6 text-dash-text backdrop:bg-black/30"><form onSubmit={addClient} className="space-y-5"><div className="flex items-center justify-between"><h2 id="add-client-title" className="!text-lg">Add client</h2><button type="button" aria-label="Close add client" onClick={() => addDialog.current?.close()}><LuX size={18} aria-hidden="true" /></button></div><label className="block text-sm">Client name<Input name="name" required maxLength={100} className="mt-2" /></label><label className="block text-sm">Channel<Select name="channel" className="mt-2 w-full">{["Email", "Instagram DM", "LinkedIn"].map(channel => <option key={channel}>{channel}</option>)}</Select></label>{notice === "This client is already in the list." && <p role="alert" className="text-sm text-dash-primary">{notice}</p>}<Button type="submit" className="w-full">Add client</Button></form></dialog>
  </div>;
}
