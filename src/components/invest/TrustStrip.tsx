import { Reveal } from "./ui/Reveal";

const rails: Array<[string, string]> = [
  ["CIRCLE", "MPC wallets & CCTP"],
  ["ARC", "USDC-gas L1"],
  ["PULS GATEWAY", "x402 payments"],
  ["UMA", "oracle settlement"],
  ["ERC-8004", "agent identity"],
];

/** "BUILT ON REAL RAILS" — the brand credibility strip from the Puls landing
 *  page, with dot separators between rails. */
export function TrustStrip() {
  return (
    <section aria-label="Built on real rails" className="px-4 py-14 sm:px-6">
      <div className="mx-auto max-w-[1180px]">
        <Reveal>
          <p className="text-center text-[10px] font-bold uppercase tracking-[2.2px] text-subtle">
            Built on real rails
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-3">
            {rails.map(([brand, tag], i) => (
              <span key={brand} className="flex items-center gap-3">
                {i > 0 && (
                  <span aria-hidden="true" className="h-[3px] w-[3px] rounded-full bg-brand/50" />
                )}
                <span className="flex items-baseline gap-1.5">
                  <span className="font-display text-[15px] font-bold tracking-[0.5px] text-foreground/75 sm:text-base">
                    {brand}
                  </span>
                  <span className="text-[11px] text-subtle">{tag}</span>
                </span>
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
