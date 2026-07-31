import { useState } from "react";
import { faqItems } from "@/lib/faq";
import { Eyebrow } from "./ui/Eyebrow";
import { Reveal } from "./ui/Reveal";

export function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-[820px]">
        <Reveal className="text-center">
          <Eyebrow>FAQ</Eyebrow>
          <h2 className="display-tight mt-5 text-3xl font-bold sm:text-5xl">
            Questions, <em className="gradient-text italic">answered.</em>
          </h2>
        </Reveal>

        <div className="mt-12 space-y-3">
          {faqItems.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={item.q} delay={i * 50}>
                <div className="card-surface overflow-hidden">
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${i}`}
                      id={`faq-button-${i}`}
                      className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-5 text-left sm:px-6"
                    >
                      <span className="min-w-0 text-base font-semibold">{item.q}</span>
                      <span
                        aria-hidden="true"
                        className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-border text-brand transition-transform duration-300"
                        style={{ transform: isOpen ? "rotate(135deg)" : "none" }}
                      >
                        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.4">
                          <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                        </svg>
                      </span>
                    </button>
                  </h3>
                  <div
                    id={`faq-panel-${i}`}
                    role="region"
                    aria-labelledby={`faq-button-${i}`}
                    hidden={!isOpen}
                    className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground sm:px-6"
                  >
                    {item.a}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
