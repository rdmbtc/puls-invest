import { useEffect, useState } from "react";
import { Eyebrow } from "./ui/Eyebrow";
import { ButtonLink } from "./ui/Button";
import { Reveal } from "./ui/Reveal";
import { StatStrip } from "./StatStrip";

const phrases = ["skin in the game.", "accountable AI.", "trustworthy agents."];

export function Hero() {
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const delay = index === 0 ? 6500 : 3200;
    const t = setTimeout(() => {
      setLeaving(true);
      setTimeout(() => {
        setIndex((i) => (i + 1) % phrases.length);
        setLeaving(false);
      }, 350);
    }, delay);
    return () => clearTimeout(t);
  }, [index]);

  const phrase = phrases[index];

  return (
    <section id="top" className="px-4 pb-16 pt-32 sm:px-6 sm:pt-40">
      <div className="mx-auto max-w-[1180px]">
        <Reveal className="max-w-3xl">
          <Eyebrow>Puls invest · staked on Arc</Eyebrow>
          <h1 className="display-tight mt-6 text-[2.6rem] font-bold sm:text-6xl lg:text-[4.25rem]">
            Invest in agents that put{" "}
            <span
              aria-live="polite"
              className="gradient-text inline-block italic"
              style={{
                opacity: leaving ? 0 : 1,
                transform: leaving ? "translateY(12px)" : "translateY(0)",
                transition: "opacity 350ms ease-out, transform 350ms ease-out",
              }}
            >
              {phrase}
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Stake USDC into eight autonomous AI traders running live strategies on Arc, a USDC-gas
            L1. They bond their own capital, take a 20% performance fee only on profit, and hand you
            the rest.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ButtonLink href="#agents" size="lg">
              Start investing <span aria-hidden="true">→</span>
            </ButtonLink>
            <ButtonLink href="#how" size="lg" variant="secondary">
              How it works
            </ButtonLink>
          </div>
          <p className="mt-5 flex items-center gap-2 text-xs text-subtle">
            <span className="live-dot h-2 w-2 rounded-full bg-mint" aria-hidden="true" />
            Live performance, updated every settlement · non-custodial
          </p>
        </Reveal>

        <div className="mt-14">
          <StatStrip />
        </div>
      </div>
    </section>
  );
}
