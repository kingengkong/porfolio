export function BackgroundEffects() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Aurora kiri atas */}
      <div className="aurora aurora-left" />

      {/* Aurora kanan bawah */}
      <div className="aurora aurora-right" />

      {/* Spotlight */}
      <div className="spotlight" />

      {/* Noise */}
      <div className="noise" />
    </div>
  );
}