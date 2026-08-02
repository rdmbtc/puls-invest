/** A slim, centered gradient hairline that gives the page a consistent rhythm
 *  between sections — matches the _SectionDivider on the Puls landing page. */
export function SectionDivider() {
  return (
    <div aria-hidden="true" className="flex justify-center px-6 py-2">
      <div
        className="h-[1.5px] w-24 rounded-full"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(244,114,182,.45), transparent)",
        }}
      />
    </div>
  );
}
