import { CrewLogo } from "@/components/crew-logo";
import { CrewStatement } from "@/components/crew-statement";
import { GuestGuard } from "@/features/auth/components/guest-guard";
import { LoginForm } from "@/features/auth/components/login-form";
import { isInvitationPath } from "@/features/invitations/lib/invitation-link";
import { getSafeRedirect } from "@/lib/safe-redirect";

type LoginPageProps = {
  searchParams: Promise<{ redirect?: string | string[] }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { redirect: redirectParam } = await searchParams;
  const redirectTo = getSafeRedirect(redirectParam);

  const description = isInvitationPath(redirectTo)
    ? "Sign in to accept your invitation."
    : "Sign in to continue to your workspace.";

  return (
    <GuestGuard redirectTo={redirectTo}>
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
                  {description}
                </p>
              </div>

              <LoginForm redirectTo={redirectTo} />
            </div>
          </div>
        </section>

        <CrewStatement />
      </main>
    </GuestGuard>
  );
}