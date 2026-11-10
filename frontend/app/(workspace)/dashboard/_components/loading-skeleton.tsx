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

