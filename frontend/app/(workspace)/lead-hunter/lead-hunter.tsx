"use client";

import Feedback from "@/components/ui/feedback";

import { useRef, useState, type FormEvent } from "react";
import { LuArrowUpRight, LuCheck, LuChevronDown, LuDownload, LuEllipsis, LuExternalLink, LuFilter, LuPlay, LuPlus, LuSearch, LuTarget, LuX } from "react-icons/lu";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

import { categories, initialLeads, type Lead } from "@/common/sample-leads";
import EmptyState from "@/components/ui/empty-state";

const panelClass = "min-w-0 rounded-2xl border border-dash-border bg-dash-card";

// Accept quoted fields, escaped quotes, CRLF, and commas within quoted names.
function parseCSV(text: string) {
  const rows: string[][] = []; let row: string[] = []; let field = ""; let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') { if (quoted && text[i + 1] === '"') { field += '"'; i++; } else quoted = !quoted; }
    else if (char === ',' && !quoted) { row.push(field.trim()); field = ""; }
    else if ((char === '\n' || char === '\r') && !quoted) { if (char === '\r' && text[i + 1] === '\n') i++; row.push(field.trim()); if (row.some(Boolean)) rows.push(row); row = []; field = ""; }
    else field += char;
  }
  if (quoted) throw Error("A quoted CSV field is incomplete.");
  row.push(field.trim()); if (row.some(Boolean)) rows.push(row);
  return rows;
}

export default function LeadHunter() {
  const [leads, setLeads] = useState(initialLeads);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("All leads");
  const [location, setLocation] = useState("Modinagar + Ghaziabad");
  const [target, setTarget] = useState("20 qualified leads");
  const [schedule, setSchedule] = useState("09:00 AM IST");
  const [selectedCategories, setSelectedCategories] = useState(categories);
  const [filterOpen, setFilterOpen] = useState(false);
  const [city, setCity] = useState("All locations");
  const [highScore, setHighScore] = useState(false);
  const [menu, setMenu] = useState<number | null>(null);
  const [selectedLeadIds, setSelectedLeadIds] = useState<number[]>([]);
  const [notice, setNotice] = useState("");
  const [ran, setRan] = useState(false);
  const [details, setDetails] = useState<Lead | null>(null);
  const addDialog = useRef<HTMLDialogElement>(null);
  const detailDialog = useRef<HTMLDialogElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const visible = leads.filter(lead => (tab === "All leads" || lead.status === tab) && (city === "All locations" || lead.location === city) && (!highScore || lead.score >= 85) && `${lead.name} ${lead.category} ${lead.location}`.toLowerCase().includes(query.toLowerCase()));
  const allVisibleSelected = visible.length > 0 && visible.every(lead => selectedLeadIds.includes(lead.id));
  const someVisibleSelected = visible.some(lead => selectedLeadIds.includes(lead.id));
  function toggleLead(id: number) { setSelectedLeadIds(previous => previous.includes(id) ? previous.filter(item => item !== id) : [...previous, id]); }
  function resetFilters() { setQuery(""); setTab("All leads"); setCity("All locations"); setHighScore(false); }
  function updateStatus(lead: Lead, status: string) {
    setLeads(previous => previous.map(item => item.id === lead.id ? { ...item, status } : item));
    setMenu(null); setNotice(`${lead.name} marked ${status}.`);
  }
  const showDetails = (lead: Lead) => { setDetails(lead); setMenu(null); detailDialog.current?.showModal(); };
  const addLead = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "").trim();
    if (!name) return;
    setLeads(previous => [...previous, { id: Date.now(), name, category: String(data.get("category")), location: String(data.get("location")), score: 0, source: "Manual entry", status: "New", duplicate: previous.some(lead => lead.name.toLowerCase() === name.toLowerCase()) }]);
    event.currentTarget.reset(); addDialog.current?.close(); setNotice(`${name} added. A score will be available after qualification.`);
  };
  const importCSV = async (file: File) => {
    try {
      const [headers, ...rows] = parseCSV(await file.text());
      const keys = headers?.map(key => key.replace(/^\uFEFF/, "").toLowerCase());
      if (!keys || !["name", "category", "location"].every(key => keys.includes(key))) throw Error("Use a CSV with name, category, location columns.");
      if (!rows.length) throw Error("The CSV has no lead rows.");
      const imported = rows.map((row, index): Lead => {
        const value = (key: string) => row[keys.indexOf(key)] || "";
        if (!value("name") || !value("location") || !value("category")) throw Error(`Row ${index + 2}: name, category and location are required.`);
        return { id: Date.now() + index, name: value("name"), category: value("category"), location: value("location"), score: 0, source: "CSV import", status: "New" };
      });
      setLeads(previous => { const seen = new Set(previous.map(lead => lead.name.toLowerCase())); return [...previous, ...imported.map(lead => { const duplicate = seen.has(lead.name.toLowerCase()); seen.add(lead.name.toLowerCase()); return { ...lead, duplicate }; })]; });
      setNotice(`${imported.length} leads imported. Match scores are pending qualification.`);
    } catch (error) { setNotice(error instanceof Error ? error.message : "Could not read CSV."); }
  };

  return <div className="@container min-h-[calc(100vh-170px)] min-w-0 text-dash-text">
    <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div><p className="mb-3 text-[12px] font-medium tracking-[2px] text-dash-muted">DISCOVERY WORKSPACE</p><h1 className="text-[30px] font-semibold leading-tight tracking-[-1px]">Lead Hunter</h1><p className="mt-3 text-sm text-dash-muted">Find promising local businesses and turn them into thoughtful opportunities.</p></div>
      <div className="flex items-center gap-2"><Button onClick={() => { if (!selectedCategories.length) { setNotice("Select at least one target category before running."); return; } setRan(true); setNotice(`preview complete for ${location}: ${selectedCategories.length} categories, target ${target}. leads shown; live discovery and automated scheduling are not connected.`); }}><LuPlay size={13} fill="currentColor" aria-hidden="true" />Run Lead Hunter</Button></div>
    </header>
    <div className="mb-5 grid min-w-0 grid-cols-1 items-start gap-4 @min-[960px]:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <details className={`${panelClass} @container/settings group p-4 @min-[480px]:p-5`}>
        <summary className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-dash-primary"><div className="min-w-0 flex-1"><h2 id="discovery-title" className="!text-sm !tracking-normal">Discovery settings</h2><p className="mt-2 break-words text-xs leading-5 text-dash-muted">{location} &middot; {target} / day</p></div><span className={`shrink-0 rounded-md px-2 py-1 text-xs ${selectedCategories.length ? "bg-dash-sage text-dash-green" : "bg-dash-sand text-dash-orange"}`}>{selectedCategories.length ? "Ready" : "Choose categories"}</span><LuChevronDown size={16} aria-hidden="true" className="shrink-0 text-dash-muted group-open:rotate-180" /></summary>
        <div className="mt-4 border-t border-dash-border pt-2">
        <p className="mt-2 text-[12px] text-dash-muted">Choose where and how to explore your next opportunities.</p>
        <div className="mt-5 grid min-w-0 grid-cols-1 gap-3 @min-[480px]/settings:grid-cols-2 @min-[720px]/settings:grid-cols-3">{[{ label: "Target locations", value: location, change: setLocation, options: ["Modinagar + Ghaziabad", "Modinagar", "Ghaziabad"] }, { label: "Daily target", value: target, change: setTarget, options: ["10 qualified leads", "20 qualified leads", "30 qualified leads"] }, { label: "Scheduled run", value: schedule, change: setSchedule, options: ["09:00 AM IST", "12:00 PM IST", "06:00 PM IST"] }].map(field => <label key={field.label} className="min-w-0 text-[12px]">{field.label}<Select value={field.value} onChange={event => { field.change(event.target.value); setNotice("Discovery preferences updated for this visit."); }} className="mt-2 w-full">{field.options.map(option => <option key={option}>{option}</option>)}</Select></label>)}</div>
        <div className="mt-4 border-t border-dash-border pt-4"><p className="mb-2 text-[12px]">Target categories</p><div className="flex flex-wrap gap-2">{categories.map(category => <button key={category} aria-pressed={selectedCategories.includes(category)} onClick={() => setSelectedCategories(previous => previous.includes(category) ? previous.filter(item => item !== category) : [...previous, category])} className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[12px] ${selectedCategories.includes(category) ? "workspace-selected" : "bg-dash-bg text-dash-muted"}`}>{category}{selectedCategories.includes(category) ? <LuX size={10} aria-hidden="true" /> : <LuPlus size={10} aria-hidden="true" />}</button>)}</div></div>
        </div>
      </details>
      <button onClick={() => { setQuery(""); setTab("All leads"); setCity("All locations"); setHighScore(false); setNotice("Showing all leads from the workspace."); }} className="flex min-h-28 min-w-0 items-center gap-3 rounded-2xl border border-dash-peach bg-dash-peach/40 p-4 text-left @min-[480px]:gap-4 @min-[480px]:p-6"><span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-dash-card text-dash-primary"><LuTarget size={23} aria-hidden="true" /></span><span className="min-w-0 break-words"><span className="text-[12px] font-medium tracking-[2px] text-dash-muted">WORKSPACE SNAPSHOT</span><strong className="mt-2 block text-base font-medium">{leads.length} leads in workspace</strong><span className="mt-2 block text-[12px] text-dash-muted">{ran ? "Previewed just now" : "Sample data"} · {leads.filter(lead => lead.status === "Qualified").length} qualified</span></span><LuArrowUpRight size={16} className="ml-auto shrink-0 text-dash-primary" aria-hidden="true" /></button>
    </div>
    <section className={`${panelClass} p-3 @min-[480px]:p-5`} aria-labelledby="leads-title">
      <div className="flex flex-wrap items-center justify-between gap-4"><div><h2 id="leads-title" className="!text-sm !tracking-normal">Discovered leads</h2><p className="mt-2 text-[12px] text-dash-muted">{leads.length} businesses in your workspace</p></div><div className="grid w-full min-w-0 grid-cols-1 gap-2 @min-[440px]:grid-cols-3 @min-[1000px]:w-auto @min-[1000px]:grid-cols-[minmax(180px,1fr)_auto_auto_auto]"><div className="min-w-0 @min-[440px]:col-span-3 @min-[1000px]:col-span-1 [&>span]:w-full"><Input type="search" aria-label="Search leads" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search leads" startIcon={<LuSearch size={14} />} className="w-full" /></div><Button variant="secondary" aria-expanded={filterOpen} onClick={() => setFilterOpen(!filterOpen)}><LuFilter size={13} aria-hidden="true" />Filter</Button><Button variant="secondary" onClick={() => fileInput.current?.click()}><LuDownload size={13} aria-hidden="true" />Import CSV</Button><input ref={fileInput} type="file" accept=".csv,text/csv" className="hidden" aria-label="Import leads CSV" onChange={event => { const file = event.target.files?.[0]; if (file) void importCSV(file); event.target.value = ""; }} /><Button onClick={() => addDialog.current?.showModal()}><LuPlus size={14} aria-hidden="true" />Add lead</Button></div></div>
      {filterOpen && <div className="mt-4 flex flex-wrap items-center gap-4 rounded-lg bg-dash-bg p-3"><label className="flex w-full min-w-0 flex-col gap-2 text-sm @min-[480px]:w-auto">Location <Select aria-label="Filter lead location" className="w-full @min-[480px]:w-44" value={city} onChange={event => setCity(event.target.value)}>{["All locations", ...new Set(leads.map(lead => lead.location))].map(item => <option key={item}>{item}</option>)}</Select></label><label className="flex items-center gap-2 text-sm"><Input type="checkbox" checked={highScore} onChange={event => setHighScore(event.target.checked)} />Lead score 85+</label><button className="text-sm text-dash-primary" onClick={() => { setCity("All locations"); setHighScore(false); }}>Clear filters</button><span className="text-[12px] text-dash-muted">CSV columns: name, category, location</span></div>}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-b border-dash-border pb-3"><div className="flex min-w-0 flex-wrap gap-2" role="group" aria-label="Lead status">{["All leads", "New", "Qualified", "Audited"].map(item => <button aria-pressed={tab === item} key={item} onClick={() => setTab(item)} className={`rounded-md px-2.5 py-1.5 text-[12px] ${tab === item ? "workspace-selected" : "bg-dash-bg text-dash-muted"}`}>{item}</button>)}</div><span className="flex items-center gap-1.5 text-[12px] text-dash-muted"><LuCheck size={12} className="text-dash-green" aria-hidden="true" />Duplicate detection on</span></div>
      <div className="mt-3 flex min-w-0 flex-wrap items-center gap-3 rounded-xl bg-dash-bg/50 p-3">
        <label className="flex min-h-11 items-center gap-2 text-xs text-dash-muted"><Input type="checkbox" aria-label="Select visible leads" checked={allVisibleSelected} ref={node => { if (node) node.indeterminate = someVisibleSelected && !allVisibleSelected; }} onChange={() => setSelectedLeadIds(previous => allVisibleSelected ? previous.filter(id => !visible.some(lead => lead.id === id)) : [...new Set([...previous, ...visible.map(lead => lead.id)])])} />Select visible leads</label>
        {selectedLeadIds.length > 0 && <><span className="text-xs font-medium">{selectedLeadIds.length} selected across views</span><Select aria-label="Update selected leads" className="w-full @min-[480px]:w-48" value="" onChange={event => { const status = event.target.value; if (!status) return; setLeads(previous => previous.map(lead => selectedLeadIds.includes(lead.id) ? { ...lead, status } : lead)); setNotice(`${selectedLeadIds.length} leads marked ${status}.`); setSelectedLeadIds([]); }}><option value="" disabled>Change selected status</option>{["New", "Qualified", "Audited", "Contacted"].map(status => <option key={status}>{status}</option>)}</Select><button className="min-h-11 rounded-lg px-2 text-xs text-dash-muted hover:bg-dash-sage" onClick={() => setSelectedLeadIds([])}>Clear selection</button></>}
      </div>
      <div className="mt-4 hidden min-w-0 @min-[900px]:block"><Table className="min-w-[700px]" aria-label="Discovered leads"><TableHeader><TableRow >{["BUSINESS", "LOCATION", "LEAD SCORE", "SOURCE", "STATUS", ""].map((heading, index) => <TableHead key={index} scope="col" >{heading || <span className="sr-only">Actions</span>}</TableHead>)}</TableRow></TableHeader><TableBody>{visible.map(lead => <TableRow key={lead.id} ><TableCell className="w-[32%]"><label className="mb-2 flex min-h-11 items-center gap-2 text-xs text-dash-muted"><Input type="checkbox" aria-label={`Select ${lead.name}`} checked={selectedLeadIds.includes(lead.id)} onChange={() => toggleLead(lead.id)} />Select</label><button className="text-left font-medium" onClick={() => showDetails(lead)}>{lead.name}</button>{lead.duplicate && <span className="ml-2 rounded bg-dash-sand px-1.5 py-1 text-[12px] text-dash-orange">Duplicate</span>}<p className="mt-1.5 text-[12px] text-dash-muted">{lead.category}</p></TableCell><TableCell className="text-dash-muted">{lead.location}</TableCell><TableCell ><span className="flex items-center gap-2"><span className="h-[3px] w-14 bg-dash-sage"><span className="block h-full bg-dash-green" style={{ width: `${lead.score}%` }} /></span>{lead.score || "Pending"}</span></TableCell><TableCell ><button onClick={() => { setNotice(`${lead.name}: ${lead.source} is a source label. No verified external URL is connected.`); }} className="inline-flex items-center gap-1 text-dash-primary">{lead.source}<LuExternalLink size={10} aria-hidden="true" /></button></TableCell><TableCell ><span className={`inline-block rounded-md px-2.5 py-1.5 text-[12px] ${lead.status === "Qualified" ? "bg-dash-sage text-dash-green" : "bg-dash-bg text-dash-muted"}`}>{lead.status}</span></TableCell><TableCell ><button aria-label={`Actions for ${lead.name}`} aria-expanded={menu === lead.id} className="grid size-7 place-items-center rounded hover:bg-dash-peach" onClick={() => setMenu(menu === lead.id ? null : lead.id)}><LuEllipsis size={16} aria-hidden="true" /></button>{menu === lead.id && <div className="mt-2 flex flex-col gap-2"><button className="text-left text-dash-primary" onClick={() => showDetails(lead)}>View details</button><label className="sr-only" htmlFor={`status-${lead.id}`}>Status for {lead.name}</label><Select id={`status-${lead.id}`} className="w-32" value={lead.status} onChange={event => updateStatus(lead, event.target.value)}>{["New", "Qualified", "Audited", "Contacted"].map(status => <option key={status}>{status}</option>)}</Select></div>}</TableCell></TableRow>)}</TableBody></Table></div>

      <ul aria-label="Discovered leads" className="mt-4 grid min-w-0 grid-cols-1 gap-3 @min-[600px]:grid-cols-2 @min-[900px]:hidden">
        {visible.map(lead => <li key={lead.id} className={`min-w-0 rounded-xl border border-dash-border p-4 ${selectedLeadIds.includes(lead.id) ? "workspace-selected" : ""}`}>
          <div className="flex items-start justify-between gap-2"><label className="flex size-11 shrink-0 items-center justify-center"><Input type="checkbox" aria-label={`Select ${lead.name}`} checked={selectedLeadIds.includes(lead.id)} onChange={() => toggleLead(lead.id)} /><span className="sr-only">Select lead</span></label><button className="min-h-11 min-w-0 flex-1 break-words text-left text-sm font-semibold text-dash-text hover:text-dash-primary" onClick={() => showDetails(lead)}>{lead.name}</button><button aria-label={`View details for ${lead.name}`} onClick={() => showDetails(lead)} className="grid size-11 shrink-0 place-items-center rounded-lg hover:bg-dash-peach"><LuArrowUpRight size={18} aria-hidden="true" /></button></div>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-dash-muted"><span>{lead.location}</span><span className="font-medium text-dash-text">Score {lead.score || "pending"}</span>{lead.duplicate && <span className="rounded bg-dash-sand px-2 py-1 text-dash-orange">Duplicate</span>}</div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2"><span className={`rounded-md px-2 py-1 text-xs ${lead.status === "Qualified" ? "bg-dash-sage text-dash-green" : "bg-dash-bg text-dash-muted"}`}>{lead.status}</span><button aria-label={`Change status for ${lead.name}`} onClick={() => showDetails(lead)} className="min-h-11 rounded-lg px-2 text-xs font-medium text-dash-text hover:bg-dash-sage">Change status</button></div>
        </li>)}
      </ul>
      {!visible.length && <EmptyState title="No matching leads" description="Try a different search or reset your filters to see all businesses." actionLabel="Clear search and filters" onAction={resetFilters} />}
    </section>
    <Feedback message={notice} onDismiss={() => setNotice("")} />
    <dialog ref={addDialog} className="m-auto w-[min(440px,90vw)] rounded-2xl border border-dash-border bg-dash-card p-6 text-dash-text backdrop:bg-black/30"><form onSubmit={addLead} className="space-y-4"><div className="flex min-w-0 items-center justify-between gap-3"><h2 className="!text-lg">Add lead</h2><button type="button" aria-label="Close add lead" onClick={() => addDialog.current?.close()}><LuX size={18} /></button></div><label className="block text-sm">Business name<Input name="name" required maxLength={120} className="mt-2 w-full" /></label><label className="block text-sm">Category<Select name="category" className="mt-2 w-full">{categories.map(category => <option key={category}>{category}</option>)}</Select></label><label className="block text-sm">Location<Input name="location" required maxLength={100} className="mt-2 w-full" /></label><Button type="submit" className="w-full">Add lead</Button></form></dialog>
    <dialog ref={detailDialog} className="m-auto w-[min(440px,90vw)] rounded-2xl border border-dash-border bg-dash-card p-6 text-dash-text backdrop:bg-black/30"><div className="flex min-w-0 items-center justify-between gap-3"><h2 className="min-w-0 break-words !text-lg">{details?.name}</h2><button aria-label="Close lead details" onClick={() => detailDialog.current?.close()}><LuX size={18} /></button></div><p className="mt-3 text-sm text-dash-muted">{details?.category} · {details?.location}</p><dl className="mt-5 grid grid-cols-[auto_minmax(0,1fr)] gap-3 text-sm [&_dd]:break-words"><dt>Lead score</dt><dd>{details?.score || "Pending"}</dd><dt>Status</dt><dd>{details?.status}</dd><dt>Source</dt><dd>{details?.source}</dd></dl><label className="mt-5 block text-xs text-dash-muted">Change status<Select aria-label="Client lead status" className="mt-2 w-full" value={leads.find(lead => lead.id === details?.id)?.status ?? "New"} onChange={event => { if (details) { updateStatus(details, event.target.value); setDetails({ ...details, status: event.target.value }); detailDialog.current?.close(); } }}>{["New", "Qualified", "Audited", "Contacted"].map(status => <option key={status}>{status}</option>)}</Select></label></dialog>
  </div>;
}
