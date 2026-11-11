"use client";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { workspaceRoutes, workspaceHref } from "@/common/workspace-routes";
import Sidebar from "@/components/layout/sidebar";
import Footer from "@/components/layout/footer";
import {
  LuMenu,
  LuX,
  LuBell,
  LuCircleHelp,
  LuChevronDown,
} from "react-icons/lu";
import Feedback from "@/components/ui/feedback";
// import PreviewMode from "@/components/ui/preview-mode";
type WorkspaceActions = {
  setActive: (item: string) => void;
  setNotice: (message: string) => void;
  run: (name: string) => void;
  ran: string[];
};
const WorkspaceContext = createContext<WorkspaceActions | null>(null);
export function useWorkspace() {
  const value = useContext(WorkspaceContext);
  if (!value) throw new Error("Workspace components require WorkspaceShell");
  return value;
}

export default function WorkspaceShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const active = workspaceRoutes.find((route) => route.href === pathname)?.label ?? "Overview";
  const router = useRouter();
  const setActive = (item: string) => router.push(workspaceHref(item));
  useEffect(() => {
    let cancelled = false;
    void import("aos").then(({ default: AOS }) => {
      if (cancelled) return;
      AOS.init({
        duration: 550,
        easing: "ease-out-cubic",
        once: true,
        offset: 40,
        disable: () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      });
    });
    return () => { cancelled = true; };
  }, [pathname]);
  const mobileMenu = useRef<HTMLDialogElement>(null);
  const menuTrigger = useRef<HTMLButtonElement>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [notice, setNotice] = useState("");
  const [ran, setRan] = useState<string[]>([]);
  const run = (name: string) => {
    setRan((previous) =>
      previous.includes(name) ? previous : [...previous, name],
    );
    setNotice(
      `${name}: preview complete. Connect your agent backend to discover live results.`,
    );
  };
  return (
    <WorkspaceContext.Provider value={{ setActive, setNotice, run, ran }}>
    <div className="dashboard-shell flex min-h-screen bg-dash-bg bg-[radial-gradient(ellipse_at_bottom_left,var(--dash-bg-cool),transparent_65%)] text-[13px] leading-normal text-dash-text [&_button]:cursor-pointer [&_button:focus-visible]:outline-2 [&_button:focus-visible]:outline-dash-primary [&_button:focus-visible]:outline-offset-4 [&_h2]:m-0 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-[-0.6px] max-[560px]:[&_h2]:text-lg">
      <dialog
        ref={mobileMenu}
        aria-label="Workspace menu"
        className="fixed inset-y-0 left-0 m-0 h-dvh max-h-none max-w-none border-0 bg-dash-sidebar p-0 text-dash-text backdrop:bg-black/40 min-[851px]:hidden"
        onClick={(event) => {
          if (event.target === event.currentTarget) mobileMenu.current?.close();
        }}
        onClose={() => {
          document.body.style.overflow = "";
          menuTrigger.current?.focus();
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") mobileMenu.current?.close();
        }}
      >
        <button
          autoFocus
          aria-label="Close menu"
          className="absolute top-5 right-4 z-10 grid size-9 place-items-center rounded-lg bg-dash-sidebar hover:bg-dash-sand"
          onClick={() => mobileMenu.current?.close()}
        >
          <LuX aria-hidden="true" size={20} />
        </button>
        <Sidebar
          mobile
          onNavigate={() => {
            mobileMenu.current?.close();
            document.body.style.overflow = "";
          }}
          active={active}
          onSelect={(item) => {
            mobileMenu.current?.close();
            document.body.style.overflow = "";
            setActive(item);
          }}
          collapsed={false}
          onToggle={() => mobileMenu.current?.close()}
        />
      </dialog>
      <Sidebar
        active={active}
        onSelect={setActive}
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
      />
      <div className="min-w-0 flex-1">
        <header className="flex h-[73px] items-center justify-between gap-2 border-b border-dash-border px-[3.1%] max-[850px]:px-5 max-[560px]:px-3">
          <div className="flex min-w-0 flex-1 items-center gap-2 min-[561px]:gap-3">
            <button
              ref={menuTrigger}
              aria-label="Open workspace menu"
              aria-haspopup="dialog"
              className="hidden size-11 shrink-0 items-center justify-center rounded-lg text-dash-muted hover:bg-dash-sand max-[850px]:inline-flex"
              onClick={() => {
                mobileMenu.current?.showModal();
                document.body.style.overflow = "hidden";
              }}
            >
              <LuMenu aria-hidden="true" size={22} />
            </button>
            <div className="min-w-0">
            <p className="mb-1 hidden truncate text-xs text-dash-muted min-[851px]:block">
              Workspace / <span>{active}</span>
            </p>
            <strong title={active} className="block truncate text-sm font-semibold">{active}</strong>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1 min-[561px]:gap-2">
            <button
              className="hidden size-11 shrink-0 items-center justify-center rounded-lg border-0 bg-transparent text-dash-muted hover:bg-dash-sand min-[561px]:inline-flex"
              aria-label="Help"
              onClick={() =>
                setNotice(
                  "Welcome to ClientPilot. Discover leads, review outreach drafts, and manage your client pipeline.",
                )
              }
            >
              <LuCircleHelp aria-hidden="true" size={18} />
            </button>
            <button
              className="relative inline-flex size-11 shrink-0 items-center justify-center rounded-lg border-0 bg-transparent text-dash-muted hover:bg-dash-sand [&_i]:absolute [&_i]:top-2 [&_i]:right-2 [&_i]:size-[5px] [&_i]:rounded-full [&_i]:bg-dash-primary"
              aria-label="Notifications"
              onClick={() =>
                setNotice(
                  "Open AI Writer to review drafts or Conversations to check client replies.",
                )
              }
            >
              <LuBell aria-hidden="true" size={18} />
              <i />
            </button>
            <span aria-hidden="true" className="hidden h-6 w-px bg-dash-border min-[561px]:block" />
            <button
              className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center gap-2 rounded-lg border-0 bg-transparent text-dash-muted hover:bg-dash-sand"
              aria-label="Open account settings"
              onClick={() => setActive("Settings")}
            >
              <span className="inline-grid size-[30px] shrink-0 place-items-center rounded-full bg-dash-avatar text-[12px] font-bold text-dash-avatar-text">
                AK
              </span>
              <LuChevronDown aria-hidden="true" size={14} className="max-[560px]:hidden" />
            </button>
          </div>
        </header>
        <main className="w-full min-w-0 max-w-none px-8 pt-6 pb-[18px] max-[1250px]:px-6 max-[850px]:p-5 max-[560px]:px-3.5 max-[560px]:py-4">
          {/* <PreviewMode /> */}
          {children}
          <Footer />
        </main>
      </div>
      <Feedback message={notice} onDismiss={() => setNotice("")} />
    </div>
    </WorkspaceContext.Provider>
  );
}
