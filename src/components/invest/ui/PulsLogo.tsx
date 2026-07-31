export function PulsLogo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <img
      src="/logo.png"
      alt="Puls Logo"
      className={`${className} shrink-0 object-contain rounded-xl`}
    />
  );
}
