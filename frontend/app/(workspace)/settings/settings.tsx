"use client";

import Link from "next/link";
import { useRef, useState, useSyncExternalStore } from "react";
import WorkspaceSkeleton from "@/components/layout/workspace-skeleton";
import { LuCheck, LuPencil, LuX } from "react-icons/lu";

const defaults = {
  name: "Aarav Kapoor", studio: "Independent studio",
  locations: "Modinagar, Ghaziabad", target: "20 qualified leads",
  categories: "Restaurants, Healthcare, Retail, Salons", schedule: "09:00",
  automation: true, review: true, signature: "Aarav Kapoor · Independent studio",
  reducedMotion: false,
};
type Preferences = typeof defaults;
const sections = ["Profile", "Lead preferences", "Automation", "Outreach", "Appearance"];
const sectionId = (name: string) => name.toLowerCase().replaceAll(" ", "-");
const storageKey = "clientpilot-workspace-settings-v1";
const inputClass = "mt-2 w-full rounded-[9px] border border-dash-border bg-transparent px-3 py-3 text-xs text-dash-text outline-none focus:border-dash-primary focus:ring-2 focus:ring-dash-peach";
const buttonClass = "inline-flex items-center justify-center gap-2 rounded-[10px] border border-dash-border px-3 py-2 text-xs text-dash-text transition-colors hover:bg-dash-peach";

const subscribeToHydration = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

function readSavedPreferences() {
  const preferences = { ...defaults };
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(storageKey) ?? "null");
    if (stored && typeof stored === "object") {
      for (const key of Object.keys(defaults) as (keyof Preferences)[]) {
        const value = (stored as Record<string, unknown>)[key];
        if (typeof value === typeof defaults[key]) Object.assign(preferences, { [key]: value });
      }
    }
    return { preferences, error: "" };
  } catch {
    return { preferences, error: "Saved preferences could not be loaded. You can save new preferences below." };
  }
}

export default function Settings() {
  const hydrated = useSyncExternalStore(subscribeToHydration, clientSnapshot, serverSnapshot);
  return hydrated ? <SettingsForm /> : <WorkspaceSkeleton />;
}

function SettingsForm() {
  const [initial] = useState(readSavedPreferences);
  const [preferences, setPreferences] = useState(initial.preferences);
  const [active, setActive] = useState("Profile");
  const [status, setStatus] = useState(initial.error);
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({ name: defaults.name, studio: defaults.studio });
  const [configuration, setConfiguration] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);

  function update<K extends keyof Preferences>(key: K, value: Preferences[K]) {
    setPreferences((previous) => ({ ...previous, [key]: value }));
    setStatus("Unsaved changes");
  }

  function save() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(preferences));
      setStatus("Changes saved in this browser.");
    } catch { setStatus("Could not save changes. Browser storage may be unavailable."); }
  }

  const initials = preferences.name.trim().split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase() || "AK";

  function toggle(key: "automation" | "review" | "reducedMotion", title: string, description: string) {
    return <div className="flex items-center justify-between gap-5 py-3">
      <div><p className="text-xs font-medium">{title}</p><p className="mt-1 text-xs text-dash-muted">{description}</p></div>
      <button type="button" role="switch" aria-checked={preferences[key]} aria-label={title} onClick={() => update(key, !preferences[key])} className={`inline-flex h-6 w-11 shrink-0 items-center rounded-full p-1 ${preferences[key] ? "bg-dash-primary" : "bg-dash-border"}`}>
        <span className={`size-4 rounded-full bg-dash-white ${preferences[key] ? "translate-x-5" : "translate-x-0"} ${preferences.reducedMotion ? "" : "transition-transform"}`} />
      </button>
    </div>;
  }

  return <div className="min-w-0 space-y-6">
    <header className="mb-7 flex flex-wrap items-end justify-between gap-5">
      <div><p className="text-[10px] font-medium tracking-[1.7px] text-dash-muted">WORKSPACE PREFERENCES</p><h1 className="mt-3 text-[32px] font-semibold tracking-[-1.3px]">Settings</h1><p className="mt-2 text-[13px] text-dash-muted">Tune your command center without exposing credentials in the browser.</p></div>
      <div className="flex flex-wrap items-center gap-3"><span role="status" aria-live="polite" className="text-xs text-dash-muted">{status}</span><button type="submit" form="workspace-settings" className="rounded-[11px] bg-dash-primary px-4 py-3 text-xs font-semibold text-dash-white shadow-[0_6px_16px_var(--dash-shadow)] hover:bg-dash-primary-hover disabled:opacity-50">Save changes</button></div>
    </header>
    <div className="grid grid-cols-[190px_minmax(0,1fr)] items-start gap-5 max-[850px]:grid-cols-[150px_minmax(0,1fr)] max-[640px]:grid-cols-1">
      <nav aria-label="Settings sections" className="sticky top-5 flex flex-col gap-1.5 max-[640px]:static max-[640px]:flex-row max-[640px]:overflow-x-auto">
        {sections.map((name) => <a key={name} href={`#${sectionId(name)}`} onClick={() => setActive(name)} aria-current={active === name ? "location" : undefined} className={`whitespace-nowrap rounded-[10px] px-3 py-3 text-xs focus-visible:outline-2 focus-visible:outline-dash-primary ${active === name ? "bg-dash-card font-medium text-dash-primary" : "text-dash-muted hover:bg-dash-card"}`}>{name}</a>)}
      </nav>
      <form id="workspace-settings" onSubmit={(event) => { event.preventDefault(); save(); }} className="min-w-0 space-y-3 [&_section]:scroll-mt-6 [&_section]:rounded-[18px] [&_section]:border [&_section]:border-dash-border [&_section]:bg-dash-card [&_section]:p-6 max-[560px]:[&_section]:p-4 [&_h2]:!text-base [&_h2]:!tracking-[-0.4px]">
        <section id="profile" aria-labelledby="profile-heading">
          <h2 id="profile-heading">Profile</h2><p className="mt-2 text-xs text-dash-muted">Your public workspace identity.</p>
          <div className="mt-6 flex flex-wrap items-center gap-3"><span className="grid size-[42px] place-items-center rounded-full bg-dash-avatar text-xs font-bold text-dash-avatar-text">{initials}</span><div className="flex-1"><p className="font-medium">{preferences.name}</p><p className="mt-1 text-xs text-dash-muted">{preferences.studio}</p></div><button type="button" className={buttonClass} onClick={() => { setProfile({ name: preferences.name, studio: preferences.studio }); setEditing(true); dialog.current?.showModal(); }}><LuPencil aria-hidden="true" size={14} />Edit profile</button></div>
        </section>
        <section id="lead-preferences" aria-labelledby="leads-heading">
          <h2 id="leads-heading">Lead preferences</h2><p className="mt-2 text-xs text-dash-muted">These values guide your demo discovery runs.</p>
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-5 max-[560px]:grid-cols-1">
            <label className="text-[11px] text-dash-muted">Target locations<input className={inputClass} value={preferences.locations} onChange={(event) => update("locations", event.target.value)} required /></label>
            <label className="text-[11px] text-dash-muted">Daily lead target<input className={inputClass} value={preferences.target} onChange={(event) => update("target", event.target.value)} required /></label>
            <label className="text-[11px] text-dash-muted">Categories<input className={inputClass} value={preferences.categories} onChange={(event) => update("categories", event.target.value)} required /></label>
            <label className="text-[11px] text-dash-muted">Run schedule <span>(IST)</span><input type="time" className={inputClass} value={preferences.schedule} onChange={(event) => update("schedule", event.target.value)} required /></label>
          </div>
        </section>
        <section aria-labelledby="integrations-heading">
          <h2 id="integrations-heading">Integrations</h2><p className="mt-2 text-xs text-dash-muted">Demo placeholders only — no keys are stored or sent.</p>
          <div className="mt-1 flex flex-wrap items-center gap-3 border-t border-dash-border py-4"><span className="grid size-9 place-items-center rounded-[9px] bg-dash-peach text-lg font-bold text-dash-primary">G</span><div className="min-w-40 flex-1"><p className="text-xs font-medium">Gemini configuration</p><p className="mt-1 text-xs text-dash-muted">API access is disabled in this frontend prototype.</p></div><span className="rounded-lg bg-dash-bg px-2 py-1.5 text-[10px] text-dash-muted">Not connected</span><button type="button" className={buttonClass} aria-expanded={configuration} onClick={() => setConfiguration(!configuration)}>Configure</button></div>
          {configuration && <p className="mb-4 rounded-lg bg-dash-peach p-3 text-xs leading-relaxed">Gemini requires a server-side integration. This demo does not accept API keys. Configure credentials on your backend before enabling live discovery.</p>}
          <div className="flex flex-wrap items-center gap-3 border-t border-dash-border pt-4"><span className="grid size-9 place-items-center rounded-[9px] bg-dash-lavender text-[10px] font-bold text-dash-purple">n8n</span><div className="min-w-40 flex-1"><p className="text-xs font-medium">n8n automation</p><p className="mt-1 text-xs text-dash-muted">Workflow monitoring is simulated locally.</p></div><span className="rounded-lg bg-dash-sage px-2 py-1.5 text-[10px] text-dash-green">Demo mode</span><Link href="/agent-activity" className={buttonClass}>View activity</Link></div>
        </section>
        <section id="automation" aria-labelledby="automation-heading"><h2 id="automation-heading">Automation</h2><p className="mt-2 mb-2 text-xs text-dash-muted">Set defaults for your simulated workflows.</p>{toggle("automation", "Scheduled discovery", "Prefer scheduled demo runs at your selected time. No background jobs are started.")}</section>
        <section id="outreach" aria-labelledby="outreach-heading"><h2 id="outreach-heading">Outreach</h2><p className="mt-2 mb-2 text-xs text-dash-muted">Your preferences for future outreach workflows.</p>{toggle("review", "Review before sending", "Save a preference to review drafts before sending. This demo sends no messages.")}<label className="mt-3 block text-[11px] text-dash-muted">Default signature<input className={inputClass} value={preferences.signature} onChange={(event) => update("signature", event.target.value)} /></label></section>
        <section id="appearance" aria-labelledby="appearance-heading"><h2 id="appearance-heading">Appearance</h2><p className="mt-2 mb-2 text-xs text-dash-muted">Keep your settings comfortable to use.</p>{toggle("reducedMotion", "Reduce motion", "Disable switch animations on this screen.")}</section>
      </form>
    </div>
    <dialog ref={dialog} onClose={() => setEditing(false)} aria-labelledby="edit-profile-heading" className="fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-md rounded-[18px] border border-dash-border bg-dash-card p-6 text-dash-text shadow-xl backdrop:bg-black/30">
      {editing && <form onSubmit={(event) => { event.preventDefault(); setPreferences((previous) => ({ ...previous, name: profile.name.trim(), studio: profile.studio.trim() })); setStatus("Unsaved changes"); dialog.current?.close(); }}>
        <div className="mb-5 flex items-center justify-between"><h2 id="edit-profile-heading">Edit profile</h2><button type="button" aria-label="Close profile editor" onClick={() => dialog.current?.close()} className={buttonClass}><LuX aria-hidden="true" /></button></div>
        <label className="block text-xs text-dash-muted">Full name<input autoFocus required pattern=".*\S.*" maxLength={80} className={inputClass} value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} /></label>
        <label className="mt-4 block text-xs text-dash-muted">Studio<input required pattern=".*\S.*" maxLength={100} className={inputClass} value={profile.studio} onChange={(event) => setProfile({ ...profile, studio: event.target.value })} /></label>
        <div className="mt-6 flex justify-end gap-2"><button type="button" className={buttonClass} onClick={() => dialog.current?.close()}>Cancel</button><button type="submit" className={`${buttonClass} bg-dash-peach`}><LuCheck aria-hidden="true" />Apply profile</button></div>
      </form>}
    </dialog>
  </div>;
}
