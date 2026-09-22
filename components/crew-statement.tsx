export function CrewStatement() {
  return (
    <aside
      className="relative hidden overflow-hidden rounded-l-3xl border-l border-border/60 bg-white px-12 py-14 text-foreground lg:flex lg:flex-col xl:px-16"
      aria-label="CrewLobby statement"
    >
      <div className="absolute inset-0 opacity-[0.3] [background-image:linear-gradient(90deg,var(--border)_1px,transparent_1px),linear-gradient(var(--border)_1px,transparent_1px)] [background-size:44px_44px]" />

      <div className="relative my-auto max-w-2xl">
        <div className="mb-8 flex items-center gap-3 text-sm font-medium text-muted-foreground">
          <span className="h-px w-12 bg-primary" />
          <span>Software teams, aligned</span>
        </div>

        <h2 className="max-w-xl font-display text-5xl font-semibold leading-[0.98] tracking-[-0.03em] text-foreground xl:text-7xl">
          Where your team finds its{" "}
          <span className="text-primary">rhythm.</span>
        </h2>

        <p className="mt-8 max-w-md text-base leading-7 text-muted-foreground">
          Structure, context and history for software teams to work with more
          clarity.
        </p>
      </div>

      <div className="relative flex items-center gap-2 border-t border-border/60 pt-5 text-sm text-muted-foreground">
        <span className="size-1.5 rounded-full bg-primary" />
        <span>Plan, track, and evolve — together</span>
      </div>
    </aside>
  );
}