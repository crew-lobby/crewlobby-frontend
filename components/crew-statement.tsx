export function CrewStatement() {
  return (
    <aside
      className="relative hidden overflow-hidden bg-[var(--sidebar)] px-12 py-14 text-[var(--sidebar-foreground)] lg:flex lg:flex-col"
      aria-label="CrewLobby statement"
    >
      <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(90deg,currentColor_1px,transparent_1px),linear-gradient(currentColor_1px,transparent_1px)] [background-size:44px_44px]" />

      <div className="relative flex items-center justify-between text-sm font-medium text-[var(--sidebar-foreground)]/70">
        <span className="font-display">CrewLobby</span>
        <span className="rounded-sm border border-white/15 px-2 py-1 font-mono text-xs text-[var(--brass)]">
          CREW-001
        </span>
      </div>

      <div className="relative my-auto max-w-2xl">
        <div className="mb-10 flex items-center gap-3 text-sm text-[var(--sidebar-foreground)]/60">
          <span className="h-px w-12 bg-[var(--brass)]" />
          Software teams, aligned
        </div>
        <h2 className="max-w-xl font-display text-5xl leading-[0.98] tracking-[-0.03em] xl:text-7xl">
          Where your team finds its <span className="text-[var(--brass)]">rhythm.</span>
        </h2>
        <p className="mt-8 max-w-md text-base leading-7 text-[var(--sidebar-foreground)]/70">
          Structure, context and history for software teams to work with more clarity.
        </p>
      </div>

      <div className="relative flex items-center gap-2 border-t border-white/10 pt-5 text-sm text-[var(--sidebar-foreground)]/60">
        <span className="size-1.5 rounded-full bg-[var(--brass)]" />
        Plan, track, and evolve — together
      </div>
    </aside>
  );
}