import { CrewLogo } from "@/components/crew-logo";
import { CrewStatement } from "@/components/crew-statement";
import { GuestGuard } from "@/features/auth/components/guest-guard";
import { LoginForm } from "@/features/auth/components/login-form";

export default function LoginPage() {
  return (
    <GuestGuard>
      <main className="grid min-h-svh bg-background lg:grid-cols-2">
        <section className="flex flex-col gap-6 p-6 md:p-10">
          <CrewLogo href="/" />

          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-sm">
              <div className="mb-8 space-y-2 text-center md:text-left">
                <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                  Welcome back
                </h1>

                <p className="font-[family-name:var(--font-sans)] text-sm text-muted-foreground">
                  Sign in to continue to your workspace.
                </p>
              </div>

              <LoginForm />
            </div>
          </div>
        </section>

        <CrewStatement />
      </main>
    </GuestGuard>
  );
}