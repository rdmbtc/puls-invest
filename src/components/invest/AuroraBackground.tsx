export function AuroraBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="drift-a absolute -left-[20vw] -top-[15vh] h-[70vh] w-[70vw] rounded-full opacity-70"
        style={{
          background: "radial-gradient(circle, #2A0720 0%, rgba(42,7,32,0) 70%)",
          filter: "blur(130px)",
        }}
      />
      <div
        className="drift-b absolute -right-[15vw] top-[5vh] h-[60vh] w-[55vw] rounded-full opacity-40"
        style={{
          background: "radial-gradient(circle, #F472B6 0%, rgba(244,114,182,0) 70%)",
          filter: "blur(140px)",
        }}
      />
      <div
        className="drift-c absolute -bottom-[20vh] left-[15vw] h-[60vh] w-[60vw] rounded-full opacity-30"
        style={{
          background: "radial-gradient(circle, #2DD4BF 0%, rgba(45,212,191,0) 70%)",
          filter: "blur(140px)",
        }}
      />
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
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#puls-grain)" />
      </svg>
    </div>
  );
}
