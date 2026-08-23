export default function DashboardPage() {
  return (
    <main className="flex min-h-full flex-1 flex-col gap-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">A quick view of your workspace.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {["Active projects", "Tasks due", "Team members"].map((label) => (
          <section key={label} className="rounded-xl border bg-card p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-3 text-3xl font-semibold">—</p>
          </section>
        ))}
      </div>
      <section className="flex min-h-72 flex-1 items-center justify-center rounded-xl border border-dashed bg-muted/30 p-6 text-center">
        <div><p className="font-medium">Your workspace is ready.</p><p className="mt-1 text-sm text-muted-foreground">Create a project to start collaborating with your crew.</p></div>
      </section>
    </main>
  )
}
