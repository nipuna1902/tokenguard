export function BackgroundEffects() {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url('https://grainy-gradients.vercel.app/noise.svg')",
          }}
        />
      </div>
    </>
  );
}