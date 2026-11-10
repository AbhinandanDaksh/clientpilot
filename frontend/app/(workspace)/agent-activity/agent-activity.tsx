"use client";
import Button from "@/components/ui/button";
import { LuArrowLeft } from "react-icons/lu";
import { agents } from "@/common/workspace-agents";
import { useWorkspace } from "@/components/layout/workspace-shell";
export default function AgentActivity() {
  const { setActive, run, ran } = useWorkspace();
  const active = "Agent Activity";
  return (            <section data-aos="fade-up" className="rounded-[18px] border border-dash-border bg-dash-card p-[25px] max-[560px]:p-[18px] min-h-[400px] w-full break-words [&>p:first-of-type]:mt-[30px] [&_h1]:text-[32px] [&_h1]:font-semibold [&>p:not(:first-of-type)]:my-4 [&>p:not(:first-of-type)]:text-dash-muted [&_button[data-variant]]:ml-auto [&>div]:max-[560px]:flex-wrap">
              <button
                className="inline-flex items-center gap-[5px] border-0 bg-transparent p-0 text-sm text-dash-primary"
                onClick={() => setActive("Overview")}
              >
                <LuArrowLeft aria-hidden="true" size={14} /> Back to overview
              </button>
              <p className="mb-2.5 text-[10px] font-semibold tracking-[1.5px] text-dash-muted">
                WORKSPACE
              </p>
              <h1>{active}</h1>
{                agents.map((agent) => (
                  <div
                    className="flex items-center gap-3.5 border-b border-dash-border py-[17px] last:border-b-0 [&_h3]:m-0 [&_h3]:text-xs [&_h3]:font-semibold [&_p]:mt-[3px] [&_p]:text-[11px] [&_p]:text-dash-muted max-[560px]:gap-2"
                    key={agent.name}
                  >
                    <agent.icon aria-hidden="true" size={18} />
                    <div>
                      <h3>{agent.name}</h3>
                      <p>
                        {ran.includes(agent.name)
                          ? "Demo ran just now"
                          : `Last demo run ${agent.time} ago`}
                      </p>
                    </div>
                    <Button variant="secondary" onClick={() => run(agent.name)}>
                      Run demo
                    </Button>
                  </div>
                ))}
            </section>);
}
