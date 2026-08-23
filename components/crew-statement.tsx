export function CrewStatement() {
  return (
    <aside className="relative hidden overflow-hidden bg-[#101828] px-12 py-14 text-[#f8fafc] lg:flex lg:flex-col" aria-label="CrewLobby statement">
      <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(90deg,currentColor_1px,transparent_1px),linear-gradient(currentColor_1px,transparent_1px)] [background-size:48px_48px]" />
      <div className="absolute -right-32 top-28 size-[28rem] rounded-full border border-sky-200/20" />
      <div className="absolute -right-12 top-44 size-72 rounded-full border border-sky-200/10" />

      <div className="relative flex items-center justify-between text-xs font-medium tracking-[0.18em] text-slate-400">
        <span>CREWLOBBY</span>
        <span>01 / WORKSPACE</span>
      </div>

      <div className="relative my-auto max-w-2xl">
        <div className="mb-10 flex items-center gap-3 text-sm text-slate-300">
          <span className="h-px w-12 bg-[#ff7a7a]" />
          SOFTWARE TEAMS, ALIGNED
        </div>
        <h2 className="max-w-xl text-5xl font-semibold leading-[0.98] tracking-[-0.055em] xl:text-7xl">
          Onde a equipe entra em <span className="text-[#8dd5ee]">sintonia.</span>
        </h2>
        <p className="mt-8 max-w-md text-base leading-7 text-slate-300">
          Organização, contexto e histórico para equipes de software trabalharem com mais clareza.
        </p>
      </div>

      <div className="relative flex items-end justify-between border-t border-white/15 pt-5 text-xs text-slate-400">
        <span>PLANEJAR · ACOMPANHAR · EVOLUIR</span>
        <span className="flex size-8 items-center justify-center rounded-full border border-white/25 text-base text-[#8dd5ee]">↗</span>
      </div>
    </aside>
  );
}
