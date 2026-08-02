import { sparkSeries } from "@/lib/agents";

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
  const points = series.map((v, i) => `${(i / (series.length - 1)) * w},${100 - v}`).join(" ");
  const gradId = `spark-${seed}`;

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
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,100 ${points} 100,100`} fill={`url(#${gradId})`} />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
        strokeLinejoin="round"
      />
    </svg>
  );
}
