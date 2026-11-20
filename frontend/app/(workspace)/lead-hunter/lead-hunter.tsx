"use client";
import { useEffect, useState, type FormEvent } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";

import {
  leadErrorMessage,
  useCreateLeadMutation,
  useDeleteLeadMutation,
  useGetLeadsQuery,
  useGetRunsQuery,
  useRunDiscoveryMutation,
  useUpdateLeadMutation,
  type Lead,
} from "@/store/leads-api";

const statuses = ["New", "Qualified", "Audited", "Contacted", "Rejected"];

export default function LeadHunter() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [location, setLocation] = useState("Modinagar + Ghaziabad");
  const [page, setPage] = useState(1);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [editing, setEditing] = useState<Lead | null | undefined>(undefined);
  const [filters, setFilters] = useState({ search, status, page, limit: 20 });
  useEffect(() => {
    const timer = setTimeout(() => setFilters({ search, status, page, limit: 20 }), 250);
    return () => clearTimeout(timer);
  }, [search, status, page]);

  const leadQuery = useGetLeadsQuery({ ...filters, status: filters.status || undefined });
  const runQuery = useGetRunsQuery();
  const [createLead] = useCreateLeadMutation();
  const [updateLead] = useUpdateLeadMutation();
  const [deleteLead] = useDeleteLeadMutation();
  const [runDiscovery] = useRunDiscoveryMutation();
  const leads = leadQuery.currentData?.data ?? [];
  const total = leadQuery.currentData?.total ?? 0;
  const runs = runQuery.data?.data ?? [];
  const loading = leadQuery.isFetching && !leadQuery.currentData;
  const error = leadQuery.error ? leadErrorMessage(leadQuery.error) : "";

  async function action(work: () => Promise<void>) {
    setBusy(true);
    setNotice("");
    try {
      await work();
    } catch (err) {
      setNotice(leadErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = Object.fromEntries(new FormData(event.currentTarget));
    void action(async () => {
      if (editing) await updateLead({ id: editing._id, fields }).unwrap();
      else await createLead(fields).unwrap();
      setEditing(undefined);
      setNotice("Lead saved to MongoDB.");
    });
  }

  const panel = "rounded-2xl border border-dash-border bg-dash-card p-5";
  return <div className="space-y-5 text-dash-text">
    <header><p className="text-xs tracking-widest text-dash-muted">DISCOVERY WORKSPACE</p><h1 className="mt-2 text-3xl font-semibold">Lead Hunter</h1><p className="mt-2 text-sm text-dash-muted">Discover local businesses from OpenStreetMap and manage saved leads.</p></header>
    <section className={`${panel} flex flex-wrap items-end gap-4`}>
      <label className="text-sm">Discovery location<Select className="mt-2 block" value={location} onChange={e => setLocation(e.target.value)}>{["Modinagar + Ghaziabad", "Modinagar", "Ghaziabad"].map(city => <option key={city}>{city}</option>)}</Select></label>
      <Button disabled={busy} onClick={() => void action(async () => { const { data } = await runDiscovery({ location, limit: 20 }).unwrap(); setNotice(data.status === "failed" ? `Discovery failed: ${data.error}. Saved ${data.saved} leads before failure.` : `Discovery complete: ${data.saved} saved, ${data.duplicates} duplicates skipped.`); })}>{busy ? "Working…" : "Run Lead Hunter"}</Button>
      <p className="text-xs leading-5 text-dash-muted">Daily 9:00 AM IST while backend is running · up to 20 new leads per run<br />No API key needed. Coverage and contact details vary; businesses need review.</p>
    </section>
    {notice && <p role="status" className={panel}>{notice}</p>}
    {editing !== undefined && <section className={panel}><form key={editing?._id ?? "new"} onSubmit={save} className="grid gap-4 sm:grid-cols-2"><h2 className="sm:col-span-2">{editing ? "Edit lead" : "Add lead"}</h2>{(["name", "category", "location", "website", "email", "phone", "notes"] as const).map(field => <label key={field} className="block text-sm capitalize">{field}<Input className="mt-1 w-full" name={field} defaultValue={editing?.[field] ?? ""} required={["name", "category", "location"].includes(field)} maxLength={field === "notes" ? 4000 : field === "phone" ? 80 : ["name", "category", "location"].includes(field) ? 150 : undefined} type={field === "email" ? "email" : field === "website" ? "url" : "text"} /></label>)}<div className="flex gap-3"><Button type="submit" disabled={busy}>Save lead</Button><Button type="button" variant="secondary" onClick={() => setEditing(undefined)}>Cancel</Button></div></form></section>}
    <section className={panel}>
      <div className="flex flex-wrap items-center gap-3"><h2 className="mr-auto text-lg font-medium">Saved leads ({total})</h2><Input aria-label="Search leads" placeholder="Search businesses" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} /><Select aria-label="Filter by status" value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}><option value="">All statuses</option>{statuses.map(s => <option key={s}>{s}</option>)}</Select><Button disabled={busy} onClick={() => setEditing(null)}>Add lead</Button><Button variant="secondary" disabled={busy} onClick={() => void action(async () => { await Promise.all([leadQuery.refetch().unwrap(), runQuery.refetch().unwrap()]); })}>Refresh</Button></div>
      {error ? <p role="alert" className="mt-5">{error}</p> : loading ? <p role="status" className="mt-5">Loading saved leads…</p> : !leads.length ? <p className="mt-5 text-dash-muted">No leads found. Add a business or run discovery.</p> : <ul className="mt-4 divide-y divide-dash-border">{leads.map(lead => <li key={lead._id} className="flex flex-wrap items-start gap-4 py-4">
        <div className="min-w-0 flex-1"><h3 className="font-medium">{lead.name}</h3><p className="mt-1 text-sm text-dash-muted">{lead.category} · {lead.location}</p><p className="mt-2 break-words text-sm">{lead.phone || "Phone unavailable"} · {lead.email || "Email unavailable"}</p>{lead.website && <a className="mt-2 block break-all text-sm underline" href={lead.website} target="_blank" rel="noopener noreferrer">{lead.website}</a>}<p className="mt-2 text-xs text-dash-muted">{lead.sourceUrl ? <a href={lead.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline">{lead.source}</a> : lead.source} · Discovered {new Date(lead.discoveredAt).toLocaleDateString("en-IN")}</p>{lead.notes && <p className="mt-2 text-sm">{lead.notes}</p>}</div>
        <Select aria-label={`Status for ${lead.name}`} value={lead.status} disabled={busy} onChange={e => { const value = e.target.value; void action(async () => { await updateLead({ id: lead._id, fields: { status: value } }).unwrap(); }); }}>{statuses.map(s => <option key={s}>{s}</option>)}</Select>
        <Button variant="secondary" disabled={busy} onClick={() => setEditing(lead)}>Edit</Button><Button variant="secondary" disabled={busy} onClick={() => { if (window.confirm(`Delete ${lead.name}?`)) void action(async () => { await deleteLead(lead._id).unwrap(); setNotice("Lead deleted."); }); }}>Delete</Button>
      </li>)}</ul>}
      <div className="mt-4 flex items-center gap-3"><Button variant="secondary" disabled={page === 1 || loading} onClick={() => setPage(p => p - 1)}>Previous</Button><span className="text-sm">Page {page}</span><Button variant="secondary" disabled={page * 20 >= total || loading} onClick={() => setPage(p => p + 1)}>Next</Button></div>
      <p className="mt-5 text-xs text-dash-muted">© <a className="underline" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap contributors</a> · Open data under ODbL. Listing does not verify that a business is currently operating.</p>
    </section>
    <section className={panel}><h2 className="font-medium">Recent discovery runs</h2>{runQuery.error && <p role="alert" className="mt-3 text-sm">{leadErrorMessage(runQuery.error)}</p>}{!runQuery.error && !runQuery.isLoading && !runs.length && <p className="mt-3 text-sm text-dash-muted">No runs yet.</p>}<ul className="mt-3 space-y-2 text-sm">{runs.map(run => <li key={run._id}>{new Date(run.startedAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST · {run.status} · {run.saved} saved · {run.duplicates} duplicates {run.error && <span>· {run.error}</span>}</li>)}</ul></section>
  </div>;
}
