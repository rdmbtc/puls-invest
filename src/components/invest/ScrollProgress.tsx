import { useEffect, useState } from "react";

/** Gradient scroll-progress bar pinned to the top of the viewport — the same
 *  "reading depth" cue the Flutter landing page uses. */
export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div aria-hidden="true" className="fixed inset-x-0 top-0 z-[60] h-[3px] pointer-events-none">
      <div
        className="pulse-gradient h-full origin-left"
        style={{
          transform: `scaleX(${progress === 0 ? 0.0001 : progress})`,
          boxShadow: "0 0 8px rgba(246,95,169,.55)",
        }}
      />
    </div>
  );
}
