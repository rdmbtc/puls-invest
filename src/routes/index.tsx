import { createFileRoute } from "@tanstack/react-router";
import { faqItems } from "@/lib/faq";
import { AuroraBackground } from "@/components/invest/AuroraBackground";
import { Navbar } from "@/components/invest/Navbar";
import { ScrollProgress } from "@/components/invest/ScrollProgress";
import { Hero } from "@/components/invest/Hero";
import { TrustStrip } from "@/components/invest/TrustStrip";
import { HowItWorks } from "@/components/invest/HowItWorks";
import { AgentBentoGrid } from "@/components/invest/AgentBentoGrid";
import { TrustSection } from "@/components/invest/TrustSection";
import { ProtocolStats } from "@/components/invest/ProtocolStats";
import { SectionDivider } from "@/components/invest/SectionDivider";
import { FaqAccordion } from "@/components/invest/FaqAccordion";
import { FinalCta } from "@/components/invest/FinalCta";
import { Footer } from "@/components/invest/Footer";

const title = "Puls Invest — Stake USDC into 8 autonomous AI trading agents";
const description =
  "Delegate USDC to eight autonomous AI agents trading prediction markets on Arc. Verifiable on-chain performance, 20% fee on profits only, withdraw anytime.";
const url = "https://invest.pulsmarket.tech/";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { property: "og:site_name", content: "Puls Invest" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "theme-color", content: "#0A0E1A" },
    ],
    links: [{ rel: "canonical", href: url }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebApplication",
              name: "Puls Invest",
              url,
              applicationCategory: "FinanceApplication",
              operatingSystem: "Web",
              description,
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
                description:
                  "No deposit or management fees. 20% performance fee on profits only.",
              },
            },
            {
              "@type": "FAQPage",
              mainEntity: faqItems.map((item) => ({
                "@type": "Question",
                name: item.q,
                acceptedAnswer: { "@type": "Answer", text: item.a },
              })),
            },
          ],
        }),
      },
    ],

  }),
  component: InvestLanding,
});

function InvestLanding() {
  return (
    <>
      <AuroraBackground />
      <ScrollProgress />
      <Navbar />
      <noscript>
        <div className="mx-auto max-w-[1180px] px-4 pt-28 text-sm text-muted-foreground">
          JavaScript is disabled, so animations and the delegation form are unavailable. All agent
          performance data and information below is still readable.
        </div>
      </noscript>
      <main>
        <Hero />
        <TrustStrip />
        <HowItWorks />
        <SectionDivider />
        <AgentBentoGrid />
        <SectionDivider />
        <TrustSection />
        <SectionDivider />
        <ProtocolStats />
        <FaqAccordion />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
