"use client";

import { useRef, useState, type FormEvent } from "react";
import { LuArrowUpRight, LuCheck, LuDownload, LuEllipsis, LuExternalLink, LuFilter, LuPlay, LuPlus, LuSearch, LuSparkles, LuTarget, LuX } from "react-icons/lu";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

type Lead = { id: number; name: string; category: string; location: string; score: number; source: string; status: string; duplicate?: boolean };
const categories = ["Restaurants & Cafés", "Clinics & Healthcare", "Salons & Spas", "Local Retail Shops", "Hotels & Guesthouses"];
const initialLeads: Lead[] = [
  { id: 1, name: "The Daily Grind", category: categories[0], location: "Ghaziabad", score: 92, source: "Google Business", status: "New" },
  { id: 2, name: "Bloom Dental Studio", category: categories[1], location: "Modinagar", score: 86, source: "Verified website", status: "Qualified" },
  { id: 3, name: "Nook & Nest", category: categories[3], location: "Ghaziabad", score: 81, source: "Google Business", status: "Audited", duplicate: true },
  { id: 4, name: "Aura Skin & Spa", category: categories[2], location: "Modinagar", score: 78, source: "Instagram profile", status: "New" },
  { id: 5, name: "The Fern House", category: categories[4], location: "Ghaziabad", score: 74, source: "Verified website", status: "Contacted" },
];
const panelClass = "rounded-2xl border border-dash-border bg-dash-card";

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
  const [notice, setNotice] = useState("");
  const [ran, setRan] = useState(false);
  const [details, setDetails] = useState<Lead | null>(null);
  const addDialog = useRef<HTMLDialogElement>(null);
  const detailDialog = useRef<HTMLDialogElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const visible = leads.filter(lead => (tab === "All leads" || lead.status === tab) && (city === "All locations" || lead.location === city) && (!highScore || lead.score >= 85) && `${lead.name} ${lead.category} ${lead.location}`.toLowerCase().includes(query.toLowerCase()));
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

  return <div className="min-h-[calc(100vh-170px)] text-dash-text">
    <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div><p className="mb-3 text-[9px] font-medium tracking-[2px] text-dash-muted">DISCOVERY WORKSPACE</p><h1 className="text-[30px] font-semibold leading-tight tracking-[-1px]">Lead Hunter</h1><p className="mt-3 text-xs text-dash-muted">Find promising local businesses and turn them into thoughtful opportunities.</p></div>
      <div className="flex items-center gap-2"><span className="inline-flex items-center gap-1.5 rounded-lg border border-dash-peach px-3 py-2.5 text-[10px] text-dash-primary"><LuSparkles size={13} aria-hidden="true" />Demo data</span><Button onClick={() => { if (!selectedCategories.length) { setNotice("Select at least one target category before running."); return; } setRan(true); setNotice(`Demo run complete for ${location}: ${selectedCategories.length} categories, target ${target}. Sample leads shown; live discovery and automated scheduling are not connected.`); }}><LuPlay size={13} fill="currentColor" aria-hidden="true" />Run Lead Hunter</Button></div>
    </header>
    <div className="mb-5 grid grid-cols-[2fr_1fr] gap-4 max-[900px]:grid-cols-1">
      <section className={`${panelClass} p-5`} aria-labelledby="discovery-title">
        <div className="flex items-center justify-between"><h2 id="discovery-title" className="!text-sm !tracking-normal">Discovery settings</h2><span className={`rounded-md px-2 py-1 text-[10px] ${selectedCategories.length ? "bg-dash-sage text-dash-green" : "bg-dash-peach text-dash-primary"}`}>{selectedCategories.length ? "Ready" : "Choose categories"}</span></div>
        <p className="mt-2 text-[11px] text-dash-muted">Your next automated run is configured for this workspace. <span className="sr-only">Demo settings only. Automation is not connected.</span></p>
        <div className="mt-5 grid grid-cols-3 gap-3 max-[600px]:grid-cols-1">{[{ label: "Target locations", value: location, change: setLocation, options: ["Modinagar + Ghaziabad", "Modinagar", "Ghaziabad"] }, { label: "Daily target", value: target, change: setTarget, options: ["10 qualified leads", "20 qualified leads", "30 qualified leads"] }, { label: "Scheduled run", value: schedule, change: setSchedule, options: ["09:00 AM IST", "12:00 PM IST", "06:00 PM IST"] }].map(field => <label key={field.label} className="text-[10px]">{field.label}<Select value={field.value} onChange={event => { field.change(event.target.value); setNotice("Demo discovery settings updated for this visit. Automated scheduling is not connected."); }} className="mt-2 w-full">{field.options.map(option => <option key={option}>{option}</option>)}</Select></label>)}</div>
        <div className="mt-4 border-t border-dash-border pt-4"><p className="mb-2 text-[10px]">Target categories</p><div className="flex flex-wrap gap-2">{categories.map(category => <button key={category} aria-pressed={selectedCategories.includes(category)} onClick={() => setSelectedCategories(previous => previous.includes(category) ? previous.filter(item => item !== category) : [...previous, category])} className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[9px] ${selectedCategories.includes(category) ? "bg-dash-peach text-dash-primary" : "bg-dash-bg text-dash-muted"}`}>{category}{selectedCategories.includes(category) ? <LuX size={10} aria-hidden="true" /> : <LuPlus size={10} aria-hidden="true" />}</button>)}</div></div>
      </section>
      <button onClick={() => { setQuery(""); setTab("All leads"); setCity("All locations"); setHighScore(false); setNotice("Showing all sample leads from the demo workspace."); }} className="flex min-h-[200px] items-center gap-4 rounded-2xl border border-dash-peach bg-dash-peach/40 p-6 text-left"><span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-dash-card text-dash-primary"><LuTarget size={23} aria-hidden="true" /></span><span><span className="text-[9px] font-medium tracking-[2px] text-dash-muted">LAST RUN</span><strong className="mt-2 block text-base font-medium">24 leads discovered</strong><span className="mt-2 block text-[11px] text-dash-muted">{ran ? "Demo ran just now" : "Today at 9:00 AM"} · 11 qualified</span></span><LuArrowUpRight size={16} className="ml-auto shrink-0 text-dash-primary" aria-hidden="true" /></button>
    </div>
    <section className={`${panelClass} p-5`} aria-labelledby="leads-title">
      <div className="flex flex-wrap items-center justify-between gap-4"><div><h2 id="leads-title" className="!text-sm !tracking-normal">Discovered leads</h2><p className="mt-2 text-[11px] text-dash-muted">{leads.length} demo businesses in your workspace</p></div><div className="flex flex-wrap items-center gap-2"><Input type="search" aria-label="Search leads" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search leads" startIcon={<LuSearch size={14} />} className="w-44" /><Button variant="secondary" aria-expanded={filterOpen} onClick={() => setFilterOpen(!filterOpen)}><LuFilter size={13} aria-hidden="true" />Filter</Button><Button variant="secondary" onClick={() => fileInput.current?.click()}><LuDownload size={13} aria-hidden="true" />Import CSV</Button><input ref={fileInput} type="file" accept=".csv,text/csv" className="hidden" aria-label="Import leads CSV" onChange={event => { const file = event.target.files?.[0]; if (file) void importCSV(file); event.target.value = ""; }} /><Button onClick={() => addDialog.current?.showModal()}><LuPlus size={14} aria-hidden="true" />Add lead</Button></div></div>
      {filterOpen && <div className="mt-4 flex flex-wrap items-center gap-4 rounded-lg bg-dash-bg p-3"><label className="text-xs">Location <Select className="ml-2 w-44" value={city} onChange={event => setCity(event.target.value)}>{["All locations", ...new Set(leads.map(lead => lead.location))].map(item => <option key={item}>{item}</option>)}</Select></label><label className="flex items-center gap-2 text-xs"><Input type="checkbox" checked={highScore} onChange={event => setHighScore(event.target.checked)} />Lead score 85+</label><button className="text-xs text-dash-primary" onClick={() => { setCity("All locations"); setHighScore(false); }}>Clear filters</button><span className="text-[10px] text-dash-muted">CSV columns: name, category, location</span></div>}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-b border-dash-border pb-3"><div className="flex gap-2" role="group" aria-label="Lead status">{["All leads", "New", "Qualified", "Audited"].map(item => <button aria-pressed={tab === item} key={item} onClick={() => setTab(item)} className={`rounded-md px-2.5 py-1.5 text-[10px] ${tab === item ? "bg-dash-peach text-dash-primary" : "bg-dash-bg text-dash-muted"}`}>{item}</button>)}</div><span className="flex items-center gap-1.5 text-[10px] text-dash-muted"><LuCheck size={12} className="text-dash-green" aria-hidden="true" />Duplicate detection on</span></div>
      <div className="mt-4"><Table className="min-w-[700px]" aria-label="Discovered leads"><TableHeader><TableRow >{["BUSINESS", "LOCATION", "LEAD SCORE", "SOURCE", "STATUS", ""].map((heading, index) => <TableHead key={index} scope="col" >{heading || <span className="sr-only">Actions</span>}</TableHead>)}</TableRow></TableHeader><TableBody>{visible.map(lead => <TableRow key={lead.id} ><TableCell className="w-[32%]"><button className="text-left font-medium" onClick={() => showDetails(lead)}>{lead.name}</button>{lead.duplicate && <span className="ml-2 rounded bg-dash-sand px-1.5 py-1 text-[8px] text-dash-orange">Duplicate</span>}<p className="mt-1.5 text-[10px] text-dash-muted">{lead.category}</p></TableCell><TableCell className="text-dash-muted">{lead.location}</TableCell><TableCell ><span className="flex items-center gap-2"><span className="h-[3px] w-14 bg-dash-sage"><span className="block h-full bg-dash-green" style={{ width: `${lead.score}%` }} /></span>{lead.score || "Pending"}</span></TableCell><TableCell ><button onClick={() => { setNotice(`${lead.name}: ${lead.source} is a demo source label. No verified external URL is connected.`); }} className="inline-flex items-center gap-1 text-dash-primary">{lead.source}<LuExternalLink size={10} aria-hidden="true" /></button></TableCell><TableCell ><span className={`inline-block rounded-md px-2.5 py-1.5 text-[9px] ${lead.status === "Qualified" ? "bg-dash-sage text-dash-green" : "bg-dash-bg text-dash-muted"}`}>{lead.status}</span></TableCell><TableCell ><button aria-label={`Actions for ${lead.name}`} aria-expanded={menu === lead.id} className="grid size-7 place-items-center rounded hover:bg-dash-peach" onClick={() => setMenu(menu === lead.id ? null : lead.id)}><LuEllipsis size={16} aria-hidden="true" /></button>{menu === lead.id && <div className="mt-2 flex flex-col gap-2"><button className="text-left text-dash-primary" onClick={() => showDetails(lead)}>View details</button><label className="sr-only" htmlFor={`status-${lead.id}`}>Status for {lead.name}</label><Select id={`status-${lead.id}`} className="w-32" value={lead.status} onChange={event => { setLeads(previous => previous.map(item => item.id === lead.id ? { ...item, status: event.target.value } : item)); setMenu(null); }}>{["New", "Qualified", "Audited", "Contacted"].map(status => <option key={status}>{status}</option>)}</Select></div>}</TableCell></TableRow>)}</TableBody></Table></div>
      {!visible.length && <p className="py-12 text-center text-xs text-dash-muted">No leads match your search. Try another name or clear your filters.</p>}
    </section>
    <p role="status" className="mt-4 text-[11px] leading-6 text-dash-muted">{notice || "Demo workspace · Business profiles, scores and last-run totals are illustrative. Changes apply to this visit."}</p>
    <dialog ref={addDialog} className="m-auto w-[min(440px,90vw)] rounded-2xl border border-dash-border bg-dash-card p-6 text-dash-text backdrop:bg-black/30"><form onSubmit={addLead} className="space-y-4"><div className="flex items-center justify-between"><h2 className="!text-lg">Add lead</h2><button type="button" aria-label="Close add lead" onClick={() => addDialog.current?.close()}><LuX size={18} /></button></div><label className="block text-xs">Business name<Input name="name" required maxLength={120} className="mt-2 w-full" /></label><label className="block text-xs">Category<Select name="category" className="mt-2 w-full">{categories.map(category => <option key={category}>{category}</option>)}</Select></label><label className="block text-xs">Location<Input name="location" required maxLength={100} className="mt-2 w-full" /></label><Button type="submit" className="w-full">Add lead</Button></form></dialog>
    <dialog ref={detailDialog} className="m-auto w-[min(440px,90vw)] rounded-2xl border border-dash-border bg-dash-card p-6 text-dash-text backdrop:bg-black/30"><div className="flex items-center justify-between"><h2 className="!text-lg">{details?.name}</h2><button aria-label="Close lead details" onClick={() => detailDialog.current?.close()}><LuX size={18} /></button></div><p className="mt-3 text-xs text-dash-muted">{details?.category} · {details?.location}</p><dl className="mt-5 grid grid-cols-2 gap-3 text-xs"><dt>Lead score</dt><dd>{details?.score || "Pending"}</dd><dt>Status</dt><dd>{details?.status}</dd><dt>Source</dt><dd>{details?.source}</dd></dl><p className="mt-5 text-xs leading-6 text-dash-muted">Sample business profile. Verify business details and contact information before outreach.</p></dialog>
  </div>;
}
