"use client";
import Button from "@/components/ui/button";
import { LuArrowLeft, LuPencilLine } from "react-icons/lu";
import { useWorkspace } from "@/components/layout/workspace-shell";
export default function AIWriter() {
  const { setActive, setNotice } = useWorkspace();
  const active = "AI Writer";
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
                <>
                  <p>6 sample drafts awaiting approval.</p>
                  {[
                    "A fresh perspective for Bloom Studio",
                    "A better website for The Good Bean",
                    "Helping Northside Dental grow",
                  ].map((title) => (
                    <div
                      className="flex items-center gap-3.5 border-b border-dash-border py-[17px] last:border-b-0 [&_h3]:m-0 [&_h3]:text-xs [&_h3]:font-semibold [&_p]:mt-[3px] [&_p]:text-[11px] [&_p]:text-dash-muted max-[560px]:gap-2"
                      key={title}
                    >
                      <LuPencilLine aria-hidden="true" size={18} />
                      <div>
                        <h3>{title}</h3>
                        <p>Sample outreach draft · Ready for review</p>
                      </div>
                      <Button
                        variant="secondary"
                        onClick={() =>
                          setNotice(
                            `${title}: Hi there! I noticed a few opportunities to improve your online presence. Would you be open to a quick conversation? Demo draft only.`,
                          )
                        }
                      >
                        Review
                      </Button>
                    </div>
                  ))}
                </>
            </section>);
}
