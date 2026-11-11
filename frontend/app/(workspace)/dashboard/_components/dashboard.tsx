"use client";
import { LuSparkles, LuCompass, LuPencilLine, LuMessageCircle, LuPlay, LuArrowUpRight, LuEllipsis } from "react-icons/lu";
import dynamic from "next/dynamic";
import Button from "@/components/ui/button";
import { useWorkspace } from "@/components/layout/workspace-shell";
import { ChartSkeleton } from "./loading-skeleton";
import { metrics, agents, leads } from "./data";
const WeeklyActivityChart = dynamic(() => import("./charts").then((module) => module.WeeklyActivityChart), { ssr: false, loading: () => <ChartSkeleton variant="weekly" /> });
const OutreachTrendChart = dynamic(() => import("./charts").then((module) => module.OutreachTrendChart), { ssr: false, loading: () => <ChartSkeleton /> });

const PipelineCharts = dynamic(() => import("./charts").then((module) => module.PipelineCharts), { ssr: false, loading: () => <ChartSkeleton variant="pipeline" /> });

export default function Dashboard() {
  const { setActive, setNotice, run, ran } = useWorkspace();
  return (
            <>
              <section data-aos="fade-up" className="relative flex min-h-[304px] items-center justify-between overflow-hidden rounded-[23px] border border-dash-peach bg-[linear-gradient(110deg,var(--dash-hero-start),var(--dash-hero-end))] px-[47px] pt-10 pb-[35px] [&_h1]:mb-[15px] [&_h1]:text-[44px] [&_h1]:leading-[1.08] [&_h1]:font-[650] [&_h1]:tracking-[-2px] [&_h1_span]:text-dash-primary max-[1250px]:p-8 max-[1250px]:[&_h1]:text-4xl max-[850px]:min-h-[290px] max-[850px]:[&_h1]:text-[32px] max-[560px]:rounded-[18px] max-[560px]:px-5 max-[560px]:py-[26px] max-[560px]:[&_h1]:text-[30px] max-[560px]:[&_h1]:tracking-[-1.4px]">
                <div className="relative z-1">
                  <p className="mb-[18px] flex items-center gap-2.5 text-[12px] font-semibold tracking-[1px] text-dash-primary max-[560px]:text-[12px]">
                    <span className="inline-block size-1.5 shrink-0 rounded-full bg-dash-green shadow-[0_0_0_4px_var(--dash-sage)]" />
                    MONDAY, 07 OCTOBER 2024
                  </p>
                  <h1>
                    Good evening,
                    <br />
                    <span>let&apos;s find your next client.</span>
                  </h1>
                  <p className="mb-[25px] text-[13px] text-dash-muted max-[560px]:text-sm max-[560px]:leading-[1.8]">
                    Your AI agents are working behind the scenes to grow your
                    freelance business.
                  </p>
                  <div className="flex flex-wrap gap-3 max-[560px]:gap-2">
                    <Button onClick={() => run("Lead Hunter")}>
                      <LuPlay aria-hidden="true" size={15} />
                      Run Lead Hunter
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => setActive("AI Writer")}
                    >
                      <LuPencilLine aria-hidden="true" size={15} />
                      Review drafts
                      <span className="rounded-sm bg-dash-peach px-[5px] py-0.5 text-[12px] text-dash-primary">
                        6
                      </span>
                    </Button>
                  </div>
                </div>
                <div
                  className="relative mr-[15px] h-[225px] w-[290px] shrink-0 text-dash-primary min-[1700px]:mr-[13px] max-[1250px]:-mr-5 max-[1250px]:w-[220px] max-[1250px]:scale-85 max-[850px]:hidden"
                  aria-hidden="true"
                >
                  <div className="absolute rounded-full border border-dash-orbit top-[65px] left-9 h-[100px] w-[210px] -rotate-20 opacity-60" />
                  <div className="absolute rounded-full border border-dash-orbit top-[38px] left-[58px] h-[155px] w-[175px] rotate-[39deg] opacity-35" />
                  <span className="absolute top-[85px] left-[110px] grid size-[63px] place-items-center rounded-[22px] bg-dash-card shadow-[0_16px_32px_var(--dash-shadow)]">
                    <LuSparkles aria-hidden="true" size={31} />
                  </span>
                  <span className="absolute grid size-[33px] place-items-center rounded-xl bg-dash-card shadow-[0_10px_20px_var(--dash-shadow)] top-[65px] left-[25px]">
                    <LuCompass aria-hidden="true" size={16} />
                  </span>
                  <span className="absolute grid size-[33px] place-items-center rounded-xl bg-dash-card shadow-[0_10px_20px_var(--dash-shadow)] top-7 right-[37px] text-dash-green">
                    <LuPencilLine aria-hidden="true" size={16} />
                  </span>
                  <span className="absolute grid size-[33px] place-items-center rounded-xl bg-dash-card shadow-[0_10px_20px_var(--dash-shadow)] right-[29px] bottom-8 text-dash-purple">
                    <LuMessageCircle aria-hidden="true" size={16} />
                  </span>
                </div>
              </section>
              <section data-aos="fade-up"
                className="my-7 grid grid-cols-6 gap-3 max-[1250px]:grid-cols-3 max-[560px]:mt-[18px] max-[560px]:mb-6 max-[560px]:grid-cols-2 max-[560px]:gap-2"
                aria-label="Business overview"
              >
                {metrics.map((metric) => (
                  <article
                    className="min-h-[146px] rounded-[18px] border border-dash-border bg-dash-card p-[15px] [&_p]:mt-5 [&_p]:mb-[3px] [&_p]:text-[12px] [&_p]:whitespace-nowrap [&_p]:text-dash-muted [&>div]:flex [&>div]:items-baseline [&>div]:justify-between [&>div]:gap-1 [&_strong]:text-[27px] [&_strong]:font-semibold [&_strong]:tracking-[-1px] [&_small]:text-[12px] [&_small]:whitespace-nowrap [&_small]:text-dash-green max-[1250px]:[&_p]:mt-[15px] max-[560px]:p-[13px] max-[560px]:[&_p]:min-h-7 max-[560px]:[&_p]:text-[12px] max-[560px]:[&_p]:whitespace-normal"
                    key={metric.label}
                  >
                    <span
                      className={`inline-flex size-[33px] shrink-0 items-center justify-center rounded-[10px] ${metric.tone}`}
                    >
                      <metric.icon aria-hidden="true" size={18} />
                    </span>
                    <p>{metric.label}</p>
                    <div>
                      <strong>{metric.value}</strong>
                      <small>{metric.change}</small>
                    </div>
                  </article>
                ))}
              </section>
              <section data-aos="fade-up">
                <div className="mb-[18px] flex items-center justify-between gap-4 [&_p]:mb-1 [&>button]:max-[560px]:text-sm [&>button]:max-[560px]:whitespace-nowrap">
                  <div>
                    <p className="mb-2.5 text-[12px] font-semibold tracking-[1.5px] text-dash-muted">
                      YOUR AI TEAM
                    </p>
                    <h2>Agents at work</h2>
                  </div>
                  <button
                    className="inline-flex items-center gap-[5px] border-0 bg-transparent p-0 text-sm text-dash-primary"
                    onClick={() => setActive("Agent Activity")}
                  >
                    See activity <LuArrowUpRight aria-hidden="true" size={14} />
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-3 max-[1250px]:grid-cols-2 max-[560px]:grid-cols-1">
                  {agents.map((agent) => (
                    <article
                      className="rounded-[18px] border border-dash-border bg-dash-card p-[17px] [&_h3]:mb-1 [&_h3]:flex [&_h3]:items-center [&_h3]:gap-2 [&_h3]:text-[13px] [&_h3]:font-semibold [&>p]:mb-5 [&>p]:text-sm [&>p]:text-dash-muted"
                      key={agent.name}
                    >
                      <div className="mb-5 flex items-start justify-between [&>span]:size-9">
                        <span
                          className={`inline-flex size-[33px] shrink-0 items-center justify-center rounded-[10px] ${agent.tone}`}
                        >
                          <agent.icon aria-hidden="true" size={20} />
                        </span>
                        <button
                          className="inline-flex size-7 items-center justify-center rounded-lg border-0 bg-transparent text-dash-muted hover:bg-dash-sand font-bold leading-none"
                          aria-label={`${agent.name} details`}
                          onClick={() =>
                            setNotice(
                              `${agent.name}: ${agent.description}. Last run ${agent.time} ago.`,
                            )
                          }
                        >
                          <LuEllipsis aria-hidden="true" size={18} />
                        </button>
                      </div>
                      <h3>
                        {agent.name}
                        <span
                          className={`inline-block size-1.5 shrink-0 rounded-full ${agent.name === "AI Writer" ? "bg-dash-orange shadow-[0_0_0_4px_var(--dash-sand)]" : "bg-dash-green shadow-[0_0_0_4px_var(--dash-sage)]"}`}
                        />
                      </h3>
                      <p>{agent.description}</p>
                      <div className="flex items-center justify-between border-t border-dash-border pt-3 [&_small]:text-[12px] [&_small]:text-dash-muted">
                        <small>
                          {ran.includes(agent.name)
                            ? "Previewed just now"
                            : `Ran ${agent.time} ago`}
                        </small>
                        <button
                          className="grid size-[25px] place-items-center rounded-[7px] border-0 bg-dash-sidebar text-dash-primary hover:bg-dash-peach"
                          aria-label={`Run ${agent.name}`}
                          onClick={() => run(agent.name)}
                        >
                          <LuPlay aria-hidden="true" size={13} />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
              <OutreachTrendChart />
              <PipelineCharts />
              <div className="mt-7 grid grid-cols-[1.65fr_1fr] gap-4 max-[850px]:grid-cols-1">
                <section data-aos="fade-up" className="rounded-[18px] border border-dash-border bg-dash-card p-[25px] max-[560px]:p-[18px]">
                  <div className="mb-[18px] flex items-center justify-between gap-4 [&_p]:mb-1 [&>button]:max-[560px]:text-sm [&>button]:max-[560px]:whitespace-nowrap">
                    <div>
                      <p className="mb-2.5 text-[12px] font-semibold tracking-[1.5px] text-dash-muted">
                        YOUR NEXT OPPORTUNITIES
                      </p>
                      <h2>Fresh leads, real potential</h2>
                    </div>
                    <button
                      className="inline-flex items-center gap-[5px] border-0 bg-transparent p-0 text-sm text-dash-primary"
                      onClick={() => setActive("Lead Hunter")}
                    >
                      View all <LuArrowUpRight aria-hidden="true" size={14} />
                    </button>
                  </div>
                  {leads.map((lead) => (
                    <div
                      className="flex items-center gap-3.5 border-b border-dash-border py-[17px] last:border-b-0 [&_h3]:m-0 [&_h3]:text-sm [&_h3]:font-semibold [&_p]:mt-[3px] [&_p]:text-[12px] [&_p]:text-dash-muted max-[560px]:gap-2"
                      key={lead.name}
                    >
                      <span className="grid size-[34px] shrink-0 place-items-center rounded-[11px] bg-dash-sage text-[12px] font-semibold text-dash-green">
                        {lead.initials}
                      </span>
                      <div>
                        <h3>{lead.name}</h3>
                        <p>{lead.type}</p>
                      </div>
                      <span className="ml-auto rounded-md bg-dash-sage px-2 py-1 text-[12px] text-dash-green max-[560px]:px-1 max-[560px]:text-[12px]">
                        {lead.score} match
                      </span>
                      <button
                        className="inline-flex size-7 items-center justify-center rounded-lg border-0 bg-transparent text-dash-muted hover:bg-dash-sand"
                        aria-label={`View ${lead.name}`}
                        onClick={() =>
                          setNotice(
                            `${lead.name} · ${lead.type} · ${lead.score}% match. This is a lead.`,
                          )
                        }
                      >
                        <LuArrowUpRight aria-hidden="true" size={18} />
                      </button>
                    </div>
                  ))}
                </section>
                <section data-aos="fade-up" className="rounded-[18px] border border-dash-border bg-dash-card p-[25px] max-[560px]:p-[18px]">
                  <p className="mb-2.5 text-[12px] font-semibold tracking-[1.5px] text-dash-muted">
                    A LITTLE MOMENTUM
                  </p>
                  <h2>You&apos;re moving forward.</h2>
                  <p className="mt-3 text-sm leading-[1.9] text-dash-muted">
                    Small actions. Meaningful connections.
                    <br />
                    Your next chapter is taking shape.
                  </p>
                  <WeeklyActivityChart />
                  <p className="mt-2 text-[12px] text-dash-muted">Weekly actions</p>
                </section>
              </div>
            </>
  );
}
