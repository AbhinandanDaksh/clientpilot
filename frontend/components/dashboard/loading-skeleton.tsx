import Skeleton from "@/components/ui/skeleton";

function ChartPlaceholder({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "flex h-[190px] items-end gap-3 pt-5" : "flex h-[250px] items-end gap-3 pt-5 max-[560px]:h-[210px]"}>
      {[38, 62, 48, 78, 58, 86, 70].map((height, index) => (
        <Skeleton key={index} className="flex-1 rounded-t-lg rounded-b-none" style={{ height: height + "%" }} />
      ))}
    </div>
  );
}

export function ChartSkeleton({ variant = "area" }: { variant?: "weekly" | "area" | "pipeline" }) {
  if (variant === "weekly") {
    return <div role="status" aria-busy="true" className="mt-5"><span className="sr-only">Loading weekly activity chart</span><ChartPlaceholder compact /></div>;
  }
  return (
    <div role="status" aria-busy="true" className={variant === "pipeline" ? "mt-7 grid min-w-0 grid-cols-2 gap-4 max-[850px]:grid-cols-1" : "mt-7 min-w-0"}>
      <span className="sr-only">Loading charts</span>
      {Array.from({ length: variant === "pipeline" ? 2 : 1 }, (_, index) => (
        <div key={index} className="min-w-0 rounded-[18px] border border-dash-border bg-dash-card p-6 max-[560px]:p-[18px]">
          <Skeleton className="h-6 w-44 max-w-full" />
          <Skeleton className="mt-2 h-4 w-60 max-w-full" />
          <ChartPlaceholder />
        </div>
      ))}
    </div>
  );
}

export default function WorkspaceSkeleton({ overview = false }: { overview?: boolean }) {
  return (
    <div role="status" aria-busy="true" className="dashboard-shell flex min-h-screen w-full bg-dash-bg text-dash-text">
      <span className="sr-only">Loading workspace</span>
      <div className="h-dvh w-[244px] shrink-0 border-r border-dash-border bg-dash-sidebar p-5 max-[1250px]:w-[215px] max-[850px]:hidden">
        <div className="mb-10 flex items-center gap-3"><Skeleton className="size-8" /><Skeleton className="h-5 w-24" /></div>
        {Array.from({ length: 10 }, (_, index) => <Skeleton key={index} className="mb-4 h-9 w-full" />)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex h-[73px] items-center justify-between border-b border-dash-border px-8 max-[560px]:px-4"><Skeleton className="h-8 w-36" /><Skeleton className="size-8 rounded-full" /></div>
        <div className="px-8 pt-6 max-[1250px]:px-6 max-[850px]:px-5 max-[560px]:px-3.5">
          <div className="min-h-[400px] rounded-[18px] border border-dash-border bg-dash-card p-6 max-[560px]:p-[18px]">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="mt-8 h-9 w-56 max-w-full" />
            <Skeleton className="mt-4 h-4 w-96 max-w-full" />
            {overview ? <ChartPlaceholder /> : Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="mt-6 flex items-center gap-3 border-b border-dash-border pb-5"><Skeleton className="size-9 shrink-0" /><div className="min-w-0 flex-1"><Skeleton className="h-4 w-56 max-w-full" /><Skeleton className="mt-2 h-3 w-36 max-w-full" /></div><Skeleton className="h-8 w-16 shrink-0" /></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
