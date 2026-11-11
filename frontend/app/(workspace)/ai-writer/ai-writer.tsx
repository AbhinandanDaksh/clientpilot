"use client";

import Feedback from "@/components/ui/feedback";

import { useRef, useState } from "react";
import { LuArrowUpRight, LuCheck, LuCopy, LuFilter, LuRefreshCw, LuSparkles, LuX } from "react-icons/lu";
import Button from "@/components/ui/button";
import Select from "@/components/ui/select";
import Textarea from "@/components/ui/textarea";
import { usePersistentState } from "@/common/use-persistent-state";

type Language = "English" | "Hindi" | "Hinglish";
type Channel = "Email" | "Instagram DM" | "LinkedIn";
type Status = "Needs review" | "Draft ready" | "Approved" | "Discarded";
type Draft = { name: string; score: number; language: Language; channel: Channel; tone: string; text: string; status: Status; revision: number };
const languages: Language[] = ["English", "Hindi", "Hinglish"];
const channels: Channel[] = ["Email", "Instagram DM", "LinkedIn"];
const tones = ["Warm & professional", "Friendly & casual", "Concise & direct"];

function generate(name: string, language: Language, channel: Channel, tone: string, revision = 0) {
  const ask = revision % 2 ? "Would you be open to a couple of ideas?" : "Would it be useful if I shared two quick ideas?";
  if (language === "Hindi") return `${tone === tones[1] ? "नमस्ते" : "नमस्कार"} ${name}, मैं स्थानीय व्यवसायों के लिए सरल और उपयोगी वेबसाइट अनुभव बनाने में मदद करता हूँ। आपकी ऑनलाइन उपस्थिति के लिए कुछ विचार साझा करना चाहूँगा। ${channel === "LinkedIn" ? "आपसे जुड़कर खुशी होगी। " : ""}${revision % 2 ? "क्या आप दो सुझाव सुनना चाहेंगे?" : "क्या मैं आपको दो छोटे सुझाव भेज सकता हूँ?"}`;
  if (language === "Hinglish") return `${tone === tones[1] ? "Hey" : "Hi"} ${name}, main local businesses ke liye simple aur useful websites banane mein help karta hoon. ${channel === "LinkedIn" ? "Aapse connect karna achha lagega. " : ""}${tone === tones[2] ? "Aapke online presence ke liye do ideas hain." : "Aapke online presence ke liye kuch thoughtful ideas share karna chahunga."} ${revision % 2 ? "Kya aap do suggestions sunna chahenge?" : "Kya main do quick ideas share kar sakta hoon?"}`;
  return `${tone === tones[1] ? "Hey" : "Hi"} ${name}, ${tone === tones[2] ? "I build clear, easy-to-use websites for local businesses." : "I help local businesses create clearer, more thoughtful online experiences."} ${channel === "LinkedIn" ? "I'd love to connect and learn about your business. " : channel === "Instagram DM" ? "I'd love to share a little inspiration for your online presence. " : "I would love to learn about your goals and share a few ideas for your online presence. "}${ask}`;
}
const initialDrafts: Draft[] = [
  { name: "Bloom Dental Studio", score: 92, language: "English", channel: "Email", status: "Needs review" },
  { name: "The Daily Grind", score: 89, language: "Hinglish", channel: "Instagram DM", status: "Draft ready" },
  { name: "Nook & Nest", score: 81, language: "Hinglish", channel: "Instagram DM", status: "Draft ready" },
].map(item => ({ ...item, tone: tones[0], revision: 0, text: generate(item.name, item.language as Language, item.channel as Channel, tones[0]) })) as Draft[];
const panel = "rounded-[18px] border border-dash-border bg-dash-card p-5 min-[1250px]:p-6";
const validDrafts = (value: unknown): value is Draft[] => Array.isArray(value) && initialDrafts.every(sample => value.some(d => d?.name === sample.name)) && value.every(d => d && typeof d.name === "string" && typeof d.text === "string" && typeof d.score === "number" && typeof d.revision === "number" && languages.includes(d.language) && channels.includes(d.channel) && tones.includes(d.tone) && ["Needs review", "Draft ready", "Approved", "Discarded"].includes(d.status));

export default function AIWriter() {
  const [storageError, setStorageError] = useState(false);
  const [drafts, setDrafts] = usePersistentState("clientpilot:writer:drafts:v1", initialDrafts, validDrafts, () => setStorageError(true));
  const [selected, setSelected] = useState(initialDrafts[0].name);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filter, setFilter] = useState("All drafts");
  const [notice, setNotice] = useState("");
  const editor = useRef<HTMLTextAreaElement>(null);
  const current = drafts.find(item => item.name === selected)!;
  const words = current.text.trim() ? current.text.trim().split(/\s+/u).length : 0;
  const queue = [...drafts].filter(item => filter === "All drafts" || item.status === filter).sort((a, b) => b.score - a.score);
  const update = (patch: Partial<Draft>) => setDrafts(previous => previous.map(item => item.name === selected ? { ...item, ...patch } : item));
  const changeSettings = (patch: Partial<Pick<Draft, "language" | "channel" | "tone">>) => {
    const next = { ...current, ...patch };
    update({ ...patch, text: generate(next.name, next.language, next.channel, next.tone), revision: 0, status: "Needs review" });
    setNotice("draft updated for these settings. Review the text before approving.");
  };
  const selectDraft = (name: string) => { setSelected(name); setNotice(""); editor.current?.focus(); };
  async function copy() {
    try { await navigator.clipboard.writeText(current.text); setNotice("Draft copied to clipboard."); }
    catch { editor.current?.focus(); editor.current?.select(); setNotice("Clipboard access is unavailable. The draft is selected; use your keyboard to copy it."); }
  }

  return <div className="space-y-6">
    <header className="flex flex-wrap items-end justify-between gap-4 pt-3">
      <div><p className="mb-3 text-[12px] font-medium tracking-[1.8px] text-dash-muted">THOUGHTFUL OUTREACH</p><h1 className="text-[32px] font-semibold tracking-[-1px]">AI Writer</h1><p className="mt-3 text-sm leading-6 text-dash-muted">Create factual, personal first drafts. Nothing is sent without your approval.</p></div>
    </header>

    <div className="grid grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-4 max-[950px]:grid-cols-1">
      <section className={panel} aria-labelledby="settings-title">
        <h2 id="settings-title" className="!text-base !tracking-tight">Draft settings</h2><p className="mt-2 text-[12px] text-dash-muted">Use verified context only.</p>
        <div className="mt-6 space-y-5">
          <label className="block text-[12px] text-dash-muted">Lead<Select className="mt-2 w-full" value={selected} onChange={event => { setSelected(event.target.value); setNotice(""); }}>{drafts.map(item => <option key={item.name}>{item.name}</option>)}</Select></label>
          <fieldset><legend className="mb-2 text-[12px] text-dash-muted">Language</legend><div className="grid grid-cols-3 gap-2">{languages.map(language => <button key={language} type="button" aria-pressed={current.language === language} onClick={() => changeSettings({ language })} className={`min-h-9 rounded-lg border px-2 py-2 text-[12px] transition-colors ${current.language === language ? "border-dash-primary/40 bg-dash-peach text-dash-primary" : "border-dash-border text-dash-muted hover:bg-dash-sage"}`}>{language}</button>)}</div></fieldset>
          <fieldset><legend className="mb-2 text-[12px] text-dash-muted">Channel</legend><div className="grid grid-cols-3 gap-2">{channels.map(channel => <button key={channel} type="button" aria-pressed={current.channel === channel} onClick={() => changeSettings({ channel })} className={`min-h-9 rounded-lg border px-2 py-2 text-[12px] transition-colors ${current.channel === channel ? "border-dash-primary/40 bg-dash-peach text-dash-primary" : "border-dash-border text-dash-muted hover:bg-dash-sage"}`}>{channel}</button>)}</div></fieldset>
          <label className="block text-[12px] text-dash-muted">Tone<Select className="mt-2 w-full" value={current.tone} onChange={event => changeSettings({ tone: event.target.value })}>{tones.map(tone => <option key={tone}>{tone}</option>)}</Select></label>
          <div className="flex items-start gap-2 rounded-xl bg-dash-sage p-4 text-dash-muted"><LuCheck size={15} aria-hidden="true" className="shrink-0 text-dash-green" /><div><p className="text-[12px] font-medium">General introduction · No audit claims</p><p className="mt-1.5 text-[12px] leading-5">audit findings are unverified, so they are excluded from generated drafts. Review any claims you add.</p></div></div>
        </div>
      </section>

      <section className={`${panel} flex min-w-0 flex-col`} aria-labelledby="draft-title">
        <div className="mb-6 flex items-start justify-between gap-3"><div><p className="mb-1 text-[12px] tracking-[1.5px] text-dash-muted">{current.channel.toUpperCase()} · {current.language.toUpperCase()}</p><h2 id="draft-title" className="!text-base !tracking-tight">Outreach draft</h2></div><span className={`rounded-md px-2 py-1.5 text-[12px] ${current.status === "Approved" ? "bg-dash-sage text-dash-green" : "bg-dash-bg text-dash-muted"}`}>{current.status === "Approved" ? "Approved" : current.status === "Discarded" ? "Discarded" : "Ready for review"}</span></div>
        <Textarea ref={editor} aria-label={`Outreach draft for ${current.name}`} aria-describedby="draft-word-count draft-guidance" value={current.text} onChange={event => update({ text: event.target.value, status: "Needs review" })} className="min-h-[230px] flex-1" />
        <p id="draft-word-count" className={`mt-2 text-right text-[12px] ${words > 80 ? "text-dash-primary" : "text-dash-muted"}`}>{words}/80 words{words > 80 ? " · Shorten before approval" : ""}</p>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <Button variant="secondary" disabled={!current.text.trim()} onClick={() => void copy()}><LuCopy size={14} aria-hidden="true" />Copy</Button>
          <Button variant="secondary" onClick={() => { const revision = current.revision + 1; update({ text: generate(current.name, current.language, current.channel, current.tone, revision), revision, status: "Needs review" }); setNotice("New sample variation created. Review it before approving."); }}><LuRefreshCw size={14} aria-hidden="true" />Regenerate</Button>
          <Button disabled={!words || words > 80 || current.status === "Approved" || current.status === "Discarded"} className="disabled:cursor-not-allowed disabled:opacity-50" onClick={() => { update({ status: "Approved" }); setNotice(`Draft for ${current.name} approved locally. No message has been sent.`); }}><LuCheck size={15} aria-hidden="true" />{current.status === "Approved" ? "Approved" : "Approve draft"}</Button>
          <button type="button" aria-label="Discard draft" disabled={current.status === "Discarded"} onClick={() => { update({ status: "Discarded" }); setNotice("Draft discarded. Regenerate or edit it to start another review."); }} className="grid size-9 place-items-center rounded-lg text-dash-muted hover:bg-dash-peach disabled:opacity-50"><LuX size={17} aria-hidden="true" /></button>
        </div>
        <p id="draft-guidance" className="mt-4 flex items-start gap-2 text-[12px] leading-5 text-dash-muted"><LuSparkles size={14} aria-hidden="true" className="mt-0.5 shrink-0" />Keep initial outreach under 80 words and end with a soft yes/no question.</p>
      </section>
    </div>

    <section className={panel} aria-labelledby="queue-title">
      <div className="flex items-center justify-between gap-3"><div><h2 id="queue-title" className="!text-base !tracking-tight">Approval queue</h2><p className="mt-2 text-[12px] text-dash-muted">{drafts.length} leads sorted by opportunity score.</p></div><Button variant="secondary" aria-expanded={filterOpen} onClick={() => setFilterOpen(!filterOpen)}><LuFilter size={14} aria-hidden="true" />Filter queue</Button></div>
      {filterOpen && <label className="mt-4 flex flex-wrap items-center gap-3 text-sm text-dash-muted">Status<Select value={filter} onChange={event => setFilter(event.target.value)} className="w-44">{["All drafts", "Needs review", "Draft ready", "Approved", "Discarded"].map(status => <option key={status}>{status}</option>)}</Select><span aria-live="polite">{queue.length} drafts</span></label>}
      <ol className="mt-5 divide-y divide-dash-border border-t border-dash-border">{queue.map(item => <li key={item.name}><button onClick={() => selectDraft(item.name)} className={`flex w-full items-center gap-4 rounded-lg px-1 py-6 text-left hover:bg-dash-bg max-[560px]:gap-2 ${item.name === selected ? "bg-dash-sage/20" : ""}`} aria-label={`Review ${item.name}, ${item.status}`}><span className="w-10 shrink-0 text-[12px] text-dash-muted">{String(drafts.findIndex(draft => draft.name === item.name) + 1).padStart(2, "0")}</span><span className="min-w-0 flex-1"><span className="block text-sm font-semibold">{item.name}</span><span className="mt-2 block text-[12px] text-dash-muted">{item.channel} · {item.language}</span></span><span className={`shrink-0 rounded-md px-2 py-1.5 text-[12px] ${item.status === "Needs review" ? "bg-dash-peach text-dash-primary" : item.status === "Approved" ? "bg-dash-sage text-dash-green" : "bg-dash-bg text-dash-muted"}`}>{item.status}</span><LuArrowUpRight size={15} className="shrink-0 text-dash-muted" aria-hidden="true" /></button></li>)}</ol>
      {!queue.length && <p className="py-10 text-center text-sm text-dash-muted">No drafts with this status. Choose another queue filter.</p>}
    </section>
    {storageError && <p role="alert" className="rounded-xl border border-dash-primary bg-dash-peach p-4 text-sm leading-6">Browser storage is unavailable. Your changes are kept for this visit only.</p>}
    <Feedback message={notice} onDismiss={() => setNotice("")} />
  </div>;
}
