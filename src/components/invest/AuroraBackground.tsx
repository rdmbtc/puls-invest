import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "./ui/Reveal";

/** Animated aurora backdrop (blobs + dot grid + film grain) with a subtle
 *  cursor parallax, matching the Puls Flutter landing page. */
export function AuroraBackground() {
  const reduced = usePrefersReducedMotion();
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (reduced) return;
    const root = rootRef.current;
    if (!root) return;
    let raf = 0;
    const tx = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      cur.x = e.clientX;
      cur.y = e.clientY;
    };
    const tick = () => {
      tx.x += (cur.x - tx.x) * 0.06;
      tx.y += (cur.y - tx.y) * 0.06;
      const cx = (tx.x / window.innerWidth - 0.5) * 2;
      const cy = (tx.y / window.innerHeight - 0.5) * 2;
      root.style.setProperty("--px", `${cx * 30}px`);
      root.style.setProperty("--py", `${cy * 30}px`);
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Blob 1 — deep plum, drifts toward the cursor */}
      <div
        className="absolute -left-[20vw] -top-[15vh]"
        style={{ transform: "translate(var(--px,0px), var(--py,0px))" }}
      >
        <div
          className="drift-a h-[70vh] w-[70vw] rounded-full opacity-70"
          style={{
            background: "radial-gradient(circle, #2A0720 0%, rgba(42,7,32,0) 70%)",
            filter: "blur(130px)",
          }}
        />
      </div>
      {/* Blob 2 — pink, drifts away from the cursor */}
      <div
        className="absolute -right-[15vw] top-[5vh]"
        style={{
          transform: "translate(calc(var(--px,0px) * -0.8), calc(var(--py,0px) * -0.8))",
        }}
      >
        <div
          className="drift-b h-[60vh] w-[55vw] rounded-full opacity-40"
          style={{
            background: "radial-gradient(circle, #F472B6 0%, rgba(244,114,182,0) 70%)",
            filter: "blur(140px)",
          }}
        />
      </div>
      {/* Blob 3 — mint, drifts with the cursor */}
      <div
        className="absolute -bottom-[20vh] left-[15vw]"
        style={{
          transform: "translate(calc(var(--px,0px) * 0.5), calc(var(--py,0px) * 0.5))",
        }}
      >
        <div
          className="drift-c h-[60vh] w-[60vw] rounded-full opacity-30"
          style={{
            background: "radial-gradient(circle, #2DD4BF 0%, rgba(45,212,191,0) 70%)",
            filter: "blur(140px)",
          }}
        />
      </div>
      {/* dot grid */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: "radial-gradient(rgba(154,166,192,.18) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
          maskImage: "radial-gradient(ellipse at 50% 0%, #000 0%, transparent 75%)",
        }}
      />
      {/* film grain */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.03]" aria-hidden="true">
        <filter id="puls-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#puls-grain)" />
      </svg>
    </div>
  );
}
