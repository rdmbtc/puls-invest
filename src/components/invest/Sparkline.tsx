import { sparkSeries } from "@/lib/agents";

/** Catmull-Rom → cubic bezier, so the line reads as a smooth curve instead of
 *  a polyline of hard corners. */
function smoothPath(pts: Array<[number, number]>): string {
  if (pts.length < 2) return "";
  let d = `M ${pts[0]![0]},${pts[0]![1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i]!;
    const p1 = pts[i]!;
    const p2 = pts[i + 1]!;
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x},${c1y} ${c2x},${c2y} ${p2[0]},${p2[1]}`;
  }
  return d;
}

export function Sparkline({
  seed,
  color,
  height = 44,
  className = "",
}: {
  seed: number;
  color: string;
  height?: number | string;
  className?: string;
}) {
  const series = sparkSeries(seed);
  const w = 100;
  const pts: Array<[number, number]> = series.map((v, i) => [
    (i / (series.length - 1)) * w,
    100 - v,
  ]);
  const line = smoothPath(pts);
  const gradId = `spark-${seed}`;
  const glowId = `spark-glow-${seed}`;

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={`w-full ${className}`}
      style={{ height }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
        <filter id={glowId} x="-20%" y="-40%" width="140%" height="180%">
          <feGaussianBlur stdDeviation="2.4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path d={`${line} L 100,100 L 0,100 Z`} fill={`url(#${gradId})`} />
      <path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#${glowId})`}
      />
    </svg>
  );
}
