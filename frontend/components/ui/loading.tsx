type LoadingProps = {
  label?: string;
  description?: string;
  className?: string;
};

export default function Loading({
  label = "Just a moment",
  className = "",
}: LoadingProps) {
  return (
    <div role="status" aria-live="polite" className={`flex flex-col items-center justify-center px-4 text-center ${className}`}>
      <div aria-hidden="true" className="mb-6 flex h-12 items-center gap-2.5">
        {["bg-dash-primary", "bg-dash-green", "bg-dash-blue"].map((color, index) => (
          <span key={color} className={`size-3 rounded-full ${color} motion-safe:animate-bounce`} style={{ animationDelay: `${index * 160}ms`, animationDuration: "1.2s" }} />
        ))}
      </div>
      <div>
        <p className="text-base font-medium tracking-tight text-dash-text">{label}</p>
      </div>
    </div>
  );
}
