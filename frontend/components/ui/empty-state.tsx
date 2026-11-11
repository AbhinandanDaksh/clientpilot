import Button from "./button";

export default function EmptyState({ title, description, actionLabel, onAction }: { title: string; description: string; actionLabel: string; onAction: () => void }) {
  return <div className="flex flex-col items-center gap-3 px-4 py-10 text-center"><h3 className="text-base font-semibold">{title}</h3><p className="max-w-sm text-sm leading-6 text-dash-muted">{description}</p><Button variant="secondary" onClick={onAction}>{actionLabel}</Button></div>;
}
