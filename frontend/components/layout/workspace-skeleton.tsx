import Skeleton from "@/components/ui/skeleton";

export default function WorkspaceSkeleton({ overview = false }: { overview?: boolean }) {
  return <div role="status" aria-busy="true" className="space-y-6">
    <span className="sr-only">Loading workspace content</span>
    <div className="rounded-[18px] border border-dash-border bg-dash-card p-6">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="mt-6 h-9 w-56 max-w-full" />
      <Skeleton className="mt-4 h-4 w-96 max-w-full" />
    </div>
    <div className={overview ? "grid grid-cols-3 gap-4 max-[560px]:grid-cols-1" : "space-y-4"}>
      {Array.from({ length: 3 }, (_, index) => <div key={index} className="flex items-center gap-3 rounded-[18px] border border-dash-border bg-dash-card p-5"><Skeleton className="size-10 shrink-0" /><div className="min-w-0 flex-1"><Skeleton className="h-4 w-36 max-w-full" /><Skeleton className="mt-3 h-3 w-24 max-w-full" /></div></div>)}
    </div>
  </div>;
}
