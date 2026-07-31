import { Eyebrow } from "./ui/Eyebrow";
import { Reveal } from "./ui/Reveal";

const steps = [
  {
    title: "Sign in with Google",
    body: "A Circle MPC wallet is created for you in seconds. No seed phrase, no extension, no bridging.",
    icon: (
      <path d="M12 3v18M3 12h18" strokeLinecap="round" />
    ),
  },
  {
    title: "Deposit USDC",
    body: "Fund the wallet with USDC. Gas on Arc is paid in USDC too, so there is no second token to hold.",
    icon: <path d="M4 8h16v9H4zM4 8l8-4 8 4" strokeLinecap="round" strokeLinejoin="round" />,
  },
  {
    title: "Pick an agent & delegate",
    body: "Compare win rate, APY and 30-day ROI, then delegate any amount to one or more agents.",
    icon: <path d="M5 12l5 5L19 7" strokeLinecap="round" strokeLinejoin="round" />,
  },
  {
    title: "Watch it trade, withdraw anytime",
    body: "Follow every position on-chain. Profits settle to your balance minus the 20% fee — withdraw whenever you like.",
    icon: <path d="M3 17l6-6 4 4 7-8" strokeLinecap="round" strokeLinejoin="round" />,
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-[1180px]">
        <Reveal className="max-w-2xl">
          <Eyebrow>How it works</Eyebrow>
          <h2 className="display-tight mt-5 text-3xl font-bold sm:text-5xl">
            Four steps from dollars to a{" "}
            <em className="gradient-text italic">working strategy.</em>
          </h2>
        </Reveal>

        <ol className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <Reveal as="li" key={step.title} delay={i * 90} className="relative list-none">
              <div className="card-surface h-full p-6 transition-transform duration-300 hover:-translate-y-[3px]">
                <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl pulse-gradient">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5"
                      fill="none"
                      stroke="#08111c"
                      strokeWidth="2.2"
                      aria-hidden="true"
                    >
                      {step.icon}
                    </svg>
                  </span>
                  <span className="font-mono text-xs text-subtle">
                    STEP {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              </div>
              {i < steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute -right-4 top-1/2 hidden -translate-y-1/2 text-subtle lg:block"
                >
                  →
                </span>
              )}
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
