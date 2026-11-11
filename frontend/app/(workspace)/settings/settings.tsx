"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import WorkspaceSkeleton from "@/components/layout/workspace-skeleton";
import Button from "@/components/ui/button";
import ScreenHeader from "@/components/layout/screen-header";
import Select from "@/components/ui/select";
import Feedback from "@/components/ui/feedback";
import { LuCheck, LuPencil, LuX } from "react-icons/lu";

const defaults = {
  name: "Aarav Kapoor", studio: "Independent studio",
  locations: "Modinagar, Ghaziabad", target: "20 qualified leads",
  categories: "Restaurants, Healthcare, Retail, Salons", schedule: "09:00",
  automation: true, review: true, signature: "Aarav Kapoor · Independent studio",
  reducedMotion: false,
};
type Preferences = typeof defaults;
const sections = ["Profile", "Lead preferences", "Integrations", "Automation", "Outreach", "Appearance"];
const sectionId = (name: string) => name.toLowerCase().replaceAll(" ", "-");
const storageKey = "clientpilot-workspace-settings-v1";
const inputClass = "mt-2 w-full rounded-[9px] border border-dash-border bg-transparent px-3 py-3 text-sm text-dash-text outline-none focus:border-dash-primary focus:ring-2 focus:ring-dash-peach";
const buttonClass = "inline-flex items-center justify-center gap-2 rounded-[10px] border border-dash-border px-3 py-2 text-sm text-dash-text transition-colors hover:bg-dash-peach";

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
  const [savedPreferences, setSavedPreferences] = useState(initial.preferences);
  const [active, setActive] = useState("Profile");
  const [status, setStatus] = useState(initial.error);
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({ name: defaults.name, studio: defaults.studio });
  const [configuration, setConfiguration] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const dirty = JSON.stringify(preferences) !== JSON.stringify(savedPreferences);
  const statusText = status === "Unsaved changes" && !dirty ? "" : status;

  useEffect(() => {
    let frame = 0;
    const sync = () => {
      const atBottom = window.scrollY > 0 && window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8;
      const current = atBottom ? sections.at(-1)! : [...sections].reverse().find(name => (document.getElementById(sectionId(name))?.getBoundingClientRect().top ?? Infinity) <= 160) ?? sections[0];
      setActive(current);
    };
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(sync); };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); };
  }, []);

  function goToSection(name: string) {
    setActive(name);
    document.getElementById(sectionId(name))?.scrollIntoView({ behavior: preferences.reducedMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
    window.history.replaceState(null, "", `#${sectionId(name)}`);
  }

  function update<K extends keyof Preferences>(key: K, value: Preferences[K]) {
    setPreferences((previous) => ({ ...previous, [key]: value }));
    setStatus("Unsaved changes");
  }

  function save() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(preferences));
      setSavedPreferences({ ...preferences });
      setStatus("Changes saved in this browser.");
    } catch { setStatus("Could not save changes. Browser storage may be unavailable."); }
  }

  const initials = preferences.name.trim().split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase() || "AK";

  function toggle(key: "automation" | "review" | "reducedMotion", title: string, description: string) {
    return <div className="flex items-center justify-between gap-5 py-3">
      <div><p className="text-sm font-medium">{title}</p><p className="mt-1 text-sm text-dash-muted">{description}</p></div>
      <button type="button" role="switch" aria-checked={preferences[key]} aria-label={title} onClick={() => update(key, !preferences[key])} className={`inline-flex h-6 w-11 shrink-0 items-center rounded-full p-1 ${preferences[key] ? "bg-dash-primary" : "bg-dash-border"}`}>
        <span className={`size-4 rounded-full bg-dash-white ${preferences[key] ? "translate-x-5" : "translate-x-0"} ${preferences.reducedMotion ? "" : "transition-transform"}`} />
      </button>
    </div>;
  }

  return <div className={`@container min-w-0 space-y-6 ${dirty ? "pb-28 min-[851px]:pb-0" : ""}`}>
    <ScreenHeader eyebrow="WORKSPACE PREFERENCES" title="Settings" description="Manage your profile, discovery preferences, and automation settings." actions={<div className="flex min-w-0 flex-wrap items-center gap-3"><Button type="submit" form="workspace-settings" disabled={!dirty} className="disabled:cursor-not-allowed disabled:opacity-50"><LuCheck size={16} aria-hidden="true" />Save changes</Button><span role="status" aria-live="polite" className={statusText ? "text-sm text-dash-muted" : "sr-only"}>{statusText}</span></div>} />
    <div className="grid min-w-0 grid-cols-1 items-start gap-5 @min-[760px]:grid-cols-[170px_minmax(0,1fr)]">
      <nav aria-label="Settings sections" className="min-w-0 @min-[760px]:sticky @min-[760px]:top-5"><label className="block text-xs text-dash-muted @min-[760px]:hidden">Jump to section<Select aria-label="Settings section" className="mt-2 w-full" value={active} onChange={event => goToSection(event.target.value)}>{sections.map(name => <option key={name}>{name}</option>)}</Select></label><div className="hidden flex-col gap-1.5 @min-[760px]:flex">
        {sections.map((name) => <a key={name} href={`#${sectionId(name)}`} onClick={event => { event.preventDefault(); goToSection(name); }} aria-current={active === name ? "location" : undefined} className={`whitespace-nowrap rounded-[10px] px-3 py-3 text-sm focus-visible:outline-2 focus-visible:outline-dash-primary ${active === name ? "bg-dash-card font-medium text-dash-primary" : "text-dash-muted hover:bg-dash-card"}`}>{name}</a>)}
      </div></nav>
      <form id="workspace-settings" onSubmit={(event) => { event.preventDefault(); save(); }} className="min-w-0 space-y-3 [&_section]:scroll-mt-6 [&_section]:rounded-[18px] [&_section]:border [&_section]:border-dash-border [&_section]:bg-dash-card [&_section]:p-6 max-[560px]:[&_section]:p-4 [&_h2]:!text-base [&_h2]:!tracking-[-0.4px]">
        <section id="profile" aria-labelledby="profile-heading">
          <h2 id="profile-heading">Profile</h2><p className="mt-2 text-sm text-dash-muted">Your public workspace identity.</p>
          <div className="mt-6 flex flex-wrap items-center gap-3"><span className="grid size-[42px] place-items-center rounded-full bg-dash-avatar text-sm font-bold text-dash-avatar-text">{initials}</span><div className="flex-1"><p className="font-medium">{preferences.name}</p><p className="mt-1 text-sm text-dash-muted">{preferences.studio}</p></div><button type="button" className={buttonClass} onClick={() => { setProfile({ name: preferences.name, studio: preferences.studio }); setEditing(true); dialog.current?.showModal(); }}><LuPencil aria-hidden="true" size={14} />Edit profile</button></div>
        </section>
        <section id="lead-preferences" aria-labelledby="leads-heading">
          <h2 id="leads-heading">Lead preferences</h2><p className="mt-2 text-sm text-dash-muted">These values guide your discovery runs.</p>
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-5 max-[560px]:grid-cols-1">
            <label className="text-[12px] text-dash-muted">Target locations<input className={inputClass} value={preferences.locations} onChange={(event) => update("locations", event.target.value)} required /></label>
            <label className="text-[12px] text-dash-muted">Daily lead target<input className={inputClass} value={preferences.target} onChange={(event) => update("target", event.target.value)} required /></label>
            <label className="text-[12px] text-dash-muted">Categories<input className={inputClass} value={preferences.categories} onChange={(event) => update("categories", event.target.value)} required /></label>
            <label className="text-[12px] text-dash-muted">Run schedule <span>(IST)</span><input type="time" className={inputClass} value={preferences.schedule} onChange={(event) => update("schedule", event.target.value)} required /></label>
          </div>
        </section>
        <section id="integrations" aria-labelledby="integrations-heading">
          <h2 id="integrations-heading">Integrations</h2><p className="mt-2 text-sm text-dash-muted">Manage your service connections.</p>
          <div className="mt-1 flex flex-wrap items-center gap-3 border-t border-dash-border py-4"><span className="grid size-9 place-items-center rounded-[9px] bg-dash-peach text-lg font-bold text-dash-primary">G</span><div className="min-w-40 flex-1"><p className="text-sm font-medium">Gemini configuration</p><p className="mt-1 text-sm text-dash-muted">API access is disabled in this frontend prototype.</p></div><span className="rounded-lg bg-dash-bg px-2 py-1.5 text-[12px] text-dash-muted">Not connected</span><button type="button" className={buttonClass} aria-expanded={configuration} onClick={() => setConfiguration(!configuration)}>Configure</button></div>
          {configuration && <p className="mb-4 rounded-lg bg-dash-peach p-3 text-sm leading-relaxed">Gemini requires a server-side integration. This preview does not accept API keys. Configure credentials on your backend before enabling live discovery.</p>}
          <div className="flex flex-wrap items-center gap-3 border-t border-dash-border pt-4"><span className="grid size-9 place-items-center rounded-[9px] bg-dash-lavender text-[12px] font-bold text-dash-purple">n8n</span><div className="min-w-40 flex-1"><p className="text-sm font-medium">n8n automation</p><p className="mt-1 text-sm text-dash-muted">Workflow monitoring is simulated locally.</p></div><span className="rounded-lg bg-dash-sage px-2 py-1.5 text-[12px] text-dash-green">Not connected</span><Link href="/agent-activity" className={buttonClass}>View activity</Link></div>
        </section>
        <section id="automation" aria-labelledby="automation-heading"><h2 id="automation-heading">Automation</h2><p className="mt-2 mb-2 text-sm text-dash-muted">Set defaults for your simulated workflows.</p>{toggle("automation", "Scheduled discovery", "Prefer scheduled runs at your selected time. No background jobs are started.")}</section>
        <section id="outreach" aria-labelledby="outreach-heading"><h2 id="outreach-heading">Outreach</h2><p className="mt-2 mb-2 text-sm text-dash-muted">Your preferences for future outreach workflows.</p>{toggle("review", "Review before sending", "Save a preference to review drafts before sending. This preview sends no messages.")}<label className="mt-3 block text-[12px] text-dash-muted">Default signature<input className={inputClass} value={preferences.signature} onChange={(event) => update("signature", event.target.value)} /></label></section>
        <section id="appearance" aria-labelledby="appearance-heading"><h2 id="appearance-heading">Appearance</h2><p className="mt-2 mb-2 text-sm text-dash-muted">Keep your settings comfortable to use.</p>{toggle("reducedMotion", "Reduce motion", "Disable switch animations on this screen.")}</section>
      </form>
    </div>
    {dirty && <div role="region" aria-label="Unsaved settings" className="fixed inset-x-0 bottom-0 z-40 flex flex-wrap items-center justify-between gap-2 border-t border-dash-border bg-dash-card px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] shadow-xl min-[851px]:hidden"><span className="text-xs font-medium">Unsaved changes</span><div className="flex gap-2"><Button variant="secondary" onClick={() => { setPreferences({ ...savedPreferences }); setStatus("Changes discarded."); }}>Discard</Button><Button type="submit" form="workspace-settings"><LuCheck size={16} aria-hidden="true" />Save changes</Button></div></div>}
    <Feedback message={status === "Unsaved changes" ? "" : status} onDismiss={() => setStatus("")} raised={dirty} />
    <dialog ref={dialog} onClose={() => setEditing(false)} aria-labelledby="edit-profile-heading" className="fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-md rounded-[18px] border border-dash-border bg-dash-card p-6 text-dash-text shadow-xl backdrop:bg-black/30">
      {editing && <form onSubmit={(event) => { event.preventDefault(); setPreferences((previous) => ({ ...previous, name: profile.name.trim(), studio: profile.studio.trim() })); setStatus("Unsaved changes"); dialog.current?.close(); }}>
        <div className="mb-5 flex items-center justify-between"><h2 id="edit-profile-heading">Edit profile</h2><button type="button" aria-label="Close profile editor" onClick={() => dialog.current?.close()} className={buttonClass}><LuX aria-hidden="true" /></button></div>
        <label className="block text-sm text-dash-muted">Full name<input autoFocus required pattern=".*\S.*" maxLength={80} className={inputClass} value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} /></label>
        <label className="mt-4 block text-sm text-dash-muted">Studio<input required pattern=".*\S.*" maxLength={100} className={inputClass} value={profile.studio} onChange={(event) => setProfile({ ...profile, studio: event.target.value })} /></label>
        <div className="mt-6 flex justify-end gap-2"><button type="button" className={buttonClass} onClick={() => dialog.current?.close()}>Cancel</button><button type="submit" className={`${buttonClass} bg-dash-peach`}><LuCheck aria-hidden="true" />Apply profile</button></div>
      </form>}
    </dialog>
  </div>;
}
