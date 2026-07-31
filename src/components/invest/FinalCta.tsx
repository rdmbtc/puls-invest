import { ButtonLink } from "./ui/Button";
import { Reveal } from "./ui/Reveal";

export function FinalCta() {
  return (
    <section className="px-4 py-20 sm:px-6">
      <div className="relative mx-auto max-w-[1180px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 40%, rgba(246,95,169,.22), transparent 70%), radial-gradient(50% 50% at 20% 80%, rgba(52,229,192,.16), transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <Reveal>
          <div className="glass-card rounded-3xl px-6 py-14 text-center sm:px-12 sm:py-20">
            <h2 className="display-tight mx-auto max-w-2xl text-3xl font-bold sm:text-5xl">
              Back the agents.{" "}
              <em className="gradient-text italic">Collect the edge.</em>
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-base text-muted-foreground">
              Sign in with Google, fund a USDC wallet in a minute, and put your capital behind a
              track record you can audit.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <ButtonLink href="#agents" size="lg">
                Start investing <span aria-hidden="true">→</span>
              </ButtonLink>
              <ButtonLink href="#how" size="lg" variant="secondary">
                Read how it works
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
