"use client";
import Link from "next/link";
import { workspaceHref } from "@/common/workspace-routes";
import Image from "next/image";
import type { IconType } from "react-icons";
import {
  LuSparkles,
  LuLayoutDashboard,
  LuCompass,
  LuFileSearch,
  LuPencilLine,
  LuBriefcaseBusiness,
  LuMessageCircle,
  LuCalendarDays,
  LuChartColumn,
  LuActivity,
  LuSettings,
  LuChevronLeft,
  LuArrowUpRight,
  LuEllipsis,
} from "react-icons/lu";
type NavigationItem = {
  icon: IconType;
  label: string;
  badge?: string;
};
const navigation: {
  heading: string;
  items: NavigationItem[];
}[] = [
  {
    heading: "WORKSPACE",
    items: [
      { icon: LuLayoutDashboard, label: "Overview" },
      { icon: LuCompass, label: "Lead Hunter" },
      { icon: LuFileSearch, label: "Website Auditor" },
      { icon: LuPencilLine, label: "AI Writer", badge: "6" },
      { icon: LuBriefcaseBusiness, label: "Deal Room" },
      { icon: LuMessageCircle, label: "Conversations" },
    ],
  },
  {
    heading: "MANAGE",
    items: [
      { icon: LuCalendarDays, label: "Follow-up Calendar" },
      { icon: LuChartColumn, label: "Analytics" },
      { icon: LuActivity, label: "Agent Activity" },
      { icon: LuSettings, label: "Settings" },
    ],
  },
];
type SidebarProps = {
  mobile?: boolean;
  onNavigate?: () => void;
  active: string;
  onSelect: (item: string) => void;
  collapsed: boolean;
  onToggle: () => void;
};
export default function Sidebar({
  mobile = false,
  onNavigate,
  active,
  onSelect,
  collapsed,
  onToggle,
}: SidebarProps) {
  return (
    <aside
      data-mobile={mobile}
      data-collapsed={collapsed}
      className={`group sticky top-0 flex h-dvh w-[244px] shrink-0 flex-col overflow-hidden border-r border-dash-border bg-dash-sidebar px-[17px] py-[18px] transition-[width,padding] duration-[320ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none data-[collapsed=true]:w-[78px] data-[collapsed=true]:px-3 max-[1250px]:w-[215px] max-[1250px]:px-3 ${mobile ? "w-[min(300px,85vw)] max-[1250px]:w-[min(300px,85vw)]" : "max-[850px]:hidden"}`}
    >
      <div className="flex h-[42px] shrink-0 items-center gap-3 px-2 group-data-[collapsed=true]:h-auto group-data-[collapsed=true]:flex-wrap group-data-[collapsed=true]:justify-center group-data-[collapsed=true]:p-0 group-data-[mobile=false]:max-[850px]:h-auto group-data-[mobile=false]:max-[850px]:flex-wrap group-data-[mobile=false]:max-[850px]:justify-center group-data-[mobile=false]:max-[850px]:p-0 [&_strong]:text-[15px] [&_strong]:tracking-[-0.6px] [&_strong_span]:text-dash-primary">
        <Image
          src="/branding/clientpilot-icon.svg"
          alt="ClientPilot"
          width={32}
          height={32}
          className="size-8 shrink-0 max-[560px]:size-[30px]"
          priority
        />
        <strong className="group-data-[collapsed=true]:hidden group-data-[mobile=false]:max-[850px]:hidden">
          Client<span>Pilot</span>
        </strong>
        <button
          className="group-data-[mobile=true]:hidden inline-flex size-7 shrink-0 items-center justify-center transition-transform duration-[320ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none rounded-lg border-0 bg-transparent text-dash-muted hover:bg-dash-sand ml-auto bg-dash-border group-data-[collapsed=true]:mx-auto group-data-[collapsed=true]:mt-2 group-data-[collapsed=true]:rotate-180 group-data-[mobile=false]:max-[850px]:hidden"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
          onClick={onToggle}
        >
          <LuChevronLeft aria-hidden="true" size={18} />
        </button>
      </div>
      <nav aria-label="Workspace navigation" className="mt-5 min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain pr-1 [scrollbar-width:thin] [scrollbar-color:var(--dash-border)_transparent]">
        {navigation.map(({ heading, items }) => (
          <div className="mb-5 last:mb-0 [&>p]:mb-2 [&>p]:pl-3" key={heading}>
            <p className="mb-2.5 text-[12px] font-semibold tracking-[1.5px] text-dash-muted group-data-[collapsed=true]:hidden group-data-[mobile=false]:max-[850px]:hidden">
              {heading}
            </p>
            {items.map(({ icon: ItemIcon, label, badge }) => (
              <Link
                key={label}
                href={workspaceHref(label)}
                title={label}
                className={`my-1 flex min-h-10 w-full items-center gap-2.5 rounded-xl border-0 px-3 py-2.5 text-left text-sm leading-5 whitespace-nowrap transition-[background-color,color,padding,gap] duration-[320ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none hover:bg-dash-card group-data-[collapsed=true]:p-3 group-data-[mobile=false]:max-[850px]:justify-center group-data-[mobile=false]:max-[850px]:p-3 ${active === label ? "bg-dash-card font-semibold text-dash-primary shadow-[0_4px_15px_var(--dash-shadow)]" : "bg-transparent text-dash-muted"}`}
                aria-current={active === label ? "page" : undefined}
                onClick={onNavigate}
              >
                <ItemIcon aria-hidden="true" size={18} className="size-[18px] shrink-0" />
                <span className="group-data-[collapsed=true]:hidden group-data-[mobile=false]:max-[850px]:hidden">
                  {label}
                </span>
                {badge && (
                  <span className="ml-auto rounded-[20px] bg-dash-peach px-1.5 py-px text-[12px] text-dash-primary group-data-[collapsed=true]:hidden group-data-[mobile=false]:max-[850px]:hidden">
                    {badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
        ))}
      </nav>
      <div className="shrink-0 border-t border-dash-border pt-3 mt-3">
        <div className="rounded-[17px] border border-dash-border bg-dash-bg p-4 [@media(max-height:760px)]:hidden [&_h3]:mb-[3px] [&_h3]:text-sm [&_h3]:font-semibold [&_p]:mb-3 [&_p]:text-sm [&_p]:text-dash-muted [&_button]:inline-flex [&_button]:items-center [&_button]:gap-[5px] [&_button]:text-sm [&_button]:text-dash-primary group-data-[collapsed=true]:hidden group-data-[mobile=false]:max-[850px]:hidden">
          <span className="mb-3 grid size-8 place-items-center rounded-full bg-dash-peach text-dash-primary">
            <LuSparkles aria-hidden="true" size={18} />
          </span>
          <h3>Make more moves</h3>
          <p>You&apos;re on the Starter plan.</p>
          <button onClick={() => onSelect("Upgrade plan")}>
            Upgrade plan <LuArrowUpRight aria-hidden="true" size={12} />
          </button>
        </div>
        <button
          className="flex w-full items-center gap-3 border-0 bg-transparent px-2 pt-3 pb-1 text-left group-data-[collapsed=true]:justify-center group-data-[collapsed=true]:px-0 group-data-[mobile=false]:max-[850px]:justify-center group-data-[mobile=false]:max-[850px]:px-0 [&_strong]:block [&_strong]:text-sm [&_small]:block [&_small]:text-[12px] [&_small]:text-dash-muted"
          title="Account settings"
          onClick={() => onSelect("Settings")}
        >
          <span className="inline-grid size-[30px] shrink-0 place-items-center rounded-full bg-dash-avatar text-[12px] font-bold text-dash-avatar-text">
            AK
          </span>
          <span className="group-data-[collapsed=true]:hidden group-data-[mobile=false]:max-[850px]:hidden">
            <strong>Aarav Kapoor</strong>
            <small>Independent studio</small>
          </span>
          <span className="group-data-[collapsed=true]:hidden group-data-[mobile=false]:max-[850px]:hidden ml-auto text-dash-muted">
            <LuEllipsis aria-hidden="true" size={18} />
          </span>
        </button>
      </div>
    </aside>
  );
}
