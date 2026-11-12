"use client";

import Feedback from "@/components/ui/feedback";

import { useRef, useState, type FormEvent } from "react";
import { LuArrowUpRight, LuDownload, LuEllipsis, LuFileSearch, LuGlobe, LuTrendingUp, LuX } from "react-icons/lu";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const leadOptions = [
  { name: "Bloom Dental Studio", url: "https://example.com/bloom-dental" },
  { name: "The Daily Grind", url: "https://example.com/daily-grind" },
  { name: "Nook & Nest", url: "https://example.com/nook-and-nest" },
];
const metrics = [
  { label: "Performance", score: 82, tone: "bg-dash-sage text-dash-green", bar: "bg-dash-green", detail: "Review image sizes, loading priorities and scripts. Run a real performance test to confirm loading speed." },
  { label: "SEO", score: 68, tone: "bg-dash-peach text-dash-primary", bar: "bg-dash-primary", detail: "Check page titles, descriptions and indexing. This score does not reflect a crawl of the website." },
  { label: "Accessibility", score: 91, tone: "bg-dash-lavender text-dash-purple", bar: "bg-dash-purple", detail: "Test keyboard navigation, form labels and contrast. Automated checks alone cannot establish accessibility compliance." },
  { label: "Best practices", score: 76, tone: "bg-dash-sand text-dash-orange", bar: "bg-dash-orange", detail: "Review secure connections, browser errors and outdated dependencies with a connected audit tool." },
];
const findings = [
  { title: "No clear call-to-action above the fold", tone: "bg-dash-peach text-dash-primary" },
  { title: "Meta description is missing", tone: "bg-dash-lavender text-dash-purple" },
];
const recommendations = [
  { title: 'Add a primary “Book a call” CTA', effort: "Easy win", detail: "Give the main service page one clear next step. Place a descriptive booking button near the introduction, then verify the flow on mobile and with a keyboard." },
  { title: "Write a focused services section", effort: "Medium effort", detail: "Explain the services, who they help and what visitors can expect. Add a clear enquiry link and confirm the content with the business owner." },
  { title: "Improve mobile page speed", effort: "Larger project", detail: "Measure a real mobile baseline first. Investigate oversized images, render-blocking assets and unnecessary scripts, then compare the same metrics after changes." },
];
type Audit = { id: number; name: string; url: string; time: string };
const panel = "min-w-0 rounded-[18px] border border-dash-border bg-dash-card p-5 min-[1250px]:p-6";

export default function WebsiteAuditor() {
  const [url, setUrl] = useState("");
  const [lead, setLead] = useState("");
  const [history, setHistory] = useState<Audit[]>([{ id: 1, name: "Bloom Dental Studio", url: leadOptions[0].url, time: "audit" }]);
  const [activeAudit, setActiveAudit] = useState<Audit | null>(null);
  const [notice, setNotice] = useState("");
  const [metricOpen, setMetricOpen] = useState<string | null>(null);
  const [recommendation, setRecommendation] = useState<(typeof recommendations)[number] | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  function runAudit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    let parsed: URL;
    try {
      parsed = new URL(url.trim());
      if (!["https:", "http:"].includes(parsed.protocol)) throw Error();
    } catch {
      setNotice("Enter a valid website URL starting with https:// or http://.");
      return;
    }
    const selected = leadOptions.find(item => item.name === lead && item.url === parsed.href);
    const audit = { id: Date.now(), name: selected?.name ?? parsed.hostname, url: parsed.href, time: new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date()) + " IST" };
    setHistory(previous => [audit, ...previous]);
    setActiveAudit(audit);
    setNotice(`audit complete for ${audit.name}. Scores and findings are simulated; no website was fetched. Confirm findings manually before outreach.`);
  }

  function exportHistory() {
    const rows = [["Business", "URL", "Run time", "Mode", ...metrics.map(metric => metric.label)], ...history.map(audit => [audit.name, audit.url, audit.time, "Simulated / unverified", ...metrics.map(metric => String(metric.score))])];
    const csv = rows.map(row => row.map(value => `"${value.replaceAll('"', '""')}"`).join(",")).join("\r\n");
    const href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const anchor = document.createElement("a");
    anchor.href = href; anchor.download = "audit-history.csv"; anchor.click();
    setTimeout(() => URL.revokeObjectURL(href), 1000);
    setNotice("audit history exported. All scores and findings in this export are simulated.");
  }

  return <div className="@container min-w-0 space-y-6">
    <header className="flex flex-wrap items-end justify-between gap-4 pt-3">
      <div>
        <p className="mb-3 text-[12px] font-medium tracking-[1.8px] text-dash-muted">WEBSITE INTELLIGENCE</p>
        <h1 className="text-[32px] font-semibold tracking-[-1px]">Website Auditor</h1>
        <p className="mt-3 text-sm leading-6 text-dash-muted">Turn website observations into clear, valuable recommendations.</p>
      </div>
      <div className="flex items-center gap-2">
        <Button type="submit" form="website-audit"><LuFileSearch size={15} aria-hidden="true" />Run Audit</Button>
      </div>
    </header>

    <form id="website-audit" onSubmit={runAudit} className={panel}>
      <div className="grid min-w-0 grid-cols-1 items-center gap-3 @min-[640px]:grid-cols-[minmax(0,1fr)_192px]">
        <Input type="url" required aria-label="Business website URL" placeholder="Paste a business website URL" value={url} onChange={event => { setUrl(event.target.value); setLead(""); }} startIcon={<LuGlobe size={17} />} />
        <Select aria-label="Select lead" value={lead} onChange={event => { const selected = leadOptions.find(item => item.name === event.target.value); setLead(event.target.value); setUrl(selected?.url ?? ""); }} className="w-full">
          <option value="">Select lead</option>
          {leadOptions.map(item => <option key={item.name}>{item.name}</option>)}
        </Select>
      </div>
      
    </form>

    <section aria-label="Simulated audit scores" className="grid min-w-0 grid-cols-1 gap-4 @min-[600px]:grid-cols-2 @min-[1100px]:grid-cols-4">
      {metrics.map(metric => <article key={metric.label} className={panel}>
        <div className="grid min-w-0 grid-cols-[36px_minmax(0,1fr)_44px] items-center gap-2">
          <span className={`grid size-9 place-items-center rounded-xl ${metric.tone}`}><LuTrendingUp size={18} aria-hidden="true" /></span>
          <h2 className="min-w-0 break-words !text-sm !font-medium !tracking-normal">{metric.label}</h2>
          <button type="button" aria-label={`${metric.label} score information`} aria-expanded={metricOpen === metric.label} className="ml-auto grid size-7 place-items-center rounded-lg text-dash-muted hover:bg-dash-sand" onClick={() => setMetricOpen(metricOpen === metric.label ? null : metric.label)}><LuEllipsis size={17} aria-hidden="true" /></button>
        </div>
        <p className="mt-6 mb-4"><strong className="text-[36px] font-semibold leading-none tracking-[-1.5px]">{metric.score}</strong><span className="ml-1 text-[12px] text-dash-muted">/100</span></p>
        <div role="meter" aria-label={`${metric.label} simulated score`} aria-valuenow={metric.score} aria-valuemin={0} aria-valuemax={100} className="h-1.5 overflow-hidden rounded-full bg-dash-border"><div className={`h-full rounded-full ${metric.bar}`} style={{ width: `${metric.score}%` }} /></div>
        
        {metricOpen === metric.label && <p className="mt-3 border-t border-dash-border pt-3 text-sm leading-6 text-dash-muted">{metric.detail}</p>}
      </article>)}
    </section>

    {activeAudit && <p className="break-words text-sm text-dash-muted">Showing simulated results for <span className="font-medium text-dash-text">{activeAudit.name}</span> · {activeAudit.url}</p>}

    <div className="grid min-w-0 grid-cols-1 gap-4 @min-[1000px]:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
      <section className={`${panel} min-h-[295px]`} aria-labelledby="findings-title">
        <h2 id="findings-title" className="!text-base !tracking-tight">Priority findings</h2>
        <p className="mt-2 text-[12px] text-dash-muted">observations from the audit.</p>
        <ol className="mt-2 divide-y divide-dash-border">
          {findings.map((finding, index) => <li key={finding.title} className="grid min-w-0 grid-cols-[32px_minmax(0,1fr)] items-start gap-3 py-5">
            <span className={`grid size-8 shrink-0 place-items-center rounded-[10px] text-[12px] ${finding.tone}`}>{String(index + 1).padStart(2, "0")}</span>
            <div className="min-w-0 flex-1"><h3 className="text-sm font-medium leading-5">{finding.title}</h3><p className="mt-1 text-[12px] leading-5 text-dash-muted">UNVERIFIED · Needs manual confirmation before outreach</p></div>
            <span className="col-start-2 w-fit rounded-md bg-dash-bg px-2 py-1.5 text-[12px] text-dash-muted">UNVERIFIED</span>
          </li>)}
        </ol>
      </section>
      <section className={panel} aria-labelledby="recommendations-title">
        <h2 id="recommendations-title" className="!text-base !tracking-tight">Recommended improvements</h2>
        <p className="mt-2 text-[12px] text-dash-muted">Ranked from easiest to hardest.</p>
        <ol className="mt-2 divide-y divide-dash-border">
          {recommendations.map((item, index) => <li key={item.title}><button onClick={() => { setRecommendation(item); dialog.current?.showModal(); }} className="flex w-full items-center gap-3 rounded-lg py-4 text-left hover:bg-dash-bg">
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-dash-bg text-[12px] text-dash-primary">{index + 1}</span>
            <span className="min-w-0 flex-1 break-words"><span className="block text-sm font-medium leading-5">{item.title}</span><span className="mt-1 block text-[12px] text-dash-muted">{item.effort}</span></span>
            <LuArrowUpRight size={15} className="text-dash-primary" aria-hidden="true" />
          </button></li>)}
        </ol>
      </section>
    </div>

    <section className={panel} aria-labelledby="history-title">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><h2 id="history-title" className="!text-base !tracking-tight">Audit history</h2><p className="mt-2 text-[12px] text-dash-muted">Recent audits for your leads.</p></div><Button variant="secondary" onClick={exportHistory}><LuDownload size={15} aria-hidden="true" />Export</Button></div>
      <div className="hidden min-w-0 @min-[900px]:block"><Table aria-label="audit history" className="min-w-[700px]">
        <TableHeader><TableRow><TableHead>BUSINESS</TableHead><TableHead>RUN</TableHead><TableHead>SCORES</TableHead><TableHead>STATUS</TableHead></TableRow></TableHeader>
        <TableBody>{history.map(audit => <TableRow key={audit.id}>
          <TableCell><button className="text-left font-semibold hover:text-dash-primary" onClick={() => { setActiveAudit(audit); setNotice(`Viewing ${audit.name}. These are fixed scores and unverified findings.`); }}>{audit.name}</button><p className="mt-1 max-w-64 truncate text-[12px] text-dash-muted" title={audit.url}>{audit.url}</p></TableCell>
          <TableCell><p>{audit.time}</p><p className="mt-1 text-[12px] text-dash-muted">4 categories checked · Simulated</p></TableCell>
          <TableCell><div className="flex flex-wrap gap-1.5">{metrics.slice(0, 3).map(metric => <span key={metric.label} className="rounded-md bg-dash-bg px-2 py-1.5 text-[12px] text-dash-muted">{metric.score} {metric.label}</span>)}</div></TableCell>
          <TableCell><span className="rounded-md bg-dash-sage px-2.5 py-1.5 text-[12px] text-dash-green">Complete · preview</span></TableCell>
        </TableRow>)}</TableBody>
      </Table></div>
      <ul aria-label="Audit history" className="grid min-w-0 grid-cols-1 gap-3 @min-[600px]:grid-cols-2 @min-[900px]:hidden">{history.map(audit => <li key={audit.id} className="min-w-0 rounded-xl border border-dash-border p-4"><button onClick={() => { setActiveAudit(audit); setNotice(`Viewing ${audit.name}. Scores are simulated.`); }} className="flex min-h-11 w-full min-w-0 items-start justify-between gap-3 text-left"><span className="min-w-0 break-words font-semibold">{audit.name}</span><LuArrowUpRight size={16} aria-hidden="true" className="shrink-0 text-dash-primary" /></button><p className="break-all text-xs leading-5 text-dash-muted">{audit.url}</p><div className="mt-3 flex flex-wrap justify-between gap-2 text-xs"><span className="text-dash-muted">{audit.time}</span><span className="rounded-md bg-dash-sage px-2 py-1 text-dash-green">Complete (preview)</span></div><dl className="mt-3 grid grid-cols-2 gap-2 border-t border-dash-border pt-3 text-xs">{metrics.map(metric => <div key={metric.label} className="min-w-0 rounded-lg bg-dash-bg/50 p-2"><dt className="break-words text-dash-muted">{metric.label}</dt><dd className="mt-1 font-semibold">{metric.score}/100</dd></div>)}</dl></li>)}</ul>
    </section>
    <Feedback message={notice} onDismiss={() => setNotice("")} />
    <dialog ref={dialog} aria-labelledby="improvement-title" className="m-auto w-[min(460px,90vw)] rounded-[18px] border border-dash-border bg-dash-card p-6 text-dash-text backdrop:bg-black/30">
      <div className="flex items-start justify-between gap-4"><h2 id="improvement-title" className="!text-lg">{recommendation?.title}</h2><button aria-label="Close improvement" onClick={() => dialog.current?.close()} className="grid size-7 shrink-0 place-items-center rounded-lg hover:bg-dash-sand"><LuX size={18} aria-hidden="true" /></button></div>
      <p className="mt-3 text-[12px] text-dash-primary">{recommendation?.effort}</p><p className="mt-4 text-sm leading-7 text-dash-muted">{recommendation?.detail}</p><Button className="mt-5" onClick={() => dialog.current?.close()}>Got it</Button>
    </dialog>
  </div>;
}
