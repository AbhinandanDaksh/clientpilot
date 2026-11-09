import type { ComponentPropsWithoutRef } from "react";

export default function Skeleton({ className = "", ...props }: ComponentPropsWithoutRef<"div">) {
  return <div {...props} aria-hidden="true" className={"animate-pulse rounded-lg bg-dash-border motion-reduce:animate-none " + className} />;
}
