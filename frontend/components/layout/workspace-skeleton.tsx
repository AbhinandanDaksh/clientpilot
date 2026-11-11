import Loading from "@/components/ui/loading";

export default function WorkspaceSkeleton({ overview = false }: { overview?: boolean }) {
  return <Loading
    label={overview ? "Preparing your overview" : "Just a moment"}
    className="min-h-[60dvh] w-full py-12"
  />;
}
