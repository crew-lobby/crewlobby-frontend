import { CrewLogo } from "@/components/crew-logo";
import { CrewStatement } from "@/components/crew-statement";
import { SignUpGuard } from "@/features/auth/components/sign-up-guard";
import { SignUpStepper } from "@/features/auth/components/sign-up-stepper";
import { InvitedSignUp } from "@/features/invitations/components/invited-sign-up";
import { getInvitationIdFromPath } from "@/features/invitations/lib/invitation-link";
import { getSafeRedirect } from "@/lib/safe-redirect";

type SignUpPageProps = {
  searchParams: Promise<{ redirect?: string | string[] }>;
};

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const { redirect: redirectParam } = await searchParams;
  const redirectTo = getSafeRedirect(redirectParam);
  const invitationId = getInvitationIdFromPath(redirectTo);

  const description = invitationId
    ? "Create an account with the email your invitation was sent to."
    : "Start organizing your team's work in one place.";

  return (
    <SignUpGuard
      redirectTo={redirectTo}
      skipOrganization={Boolean(invitationId)}
    >
      <main className="grid min-h-svh lg:grid-cols-2">
        <section className="flex flex-col gap-6 p-6 md:p-10">
          <div className="flex items-center gap-2 self-center font-semibold md:self-start">
            <CrewLogo href="/" />
          </div>

          <div className="m-auto w-full max-w-sm">
            <div className="mb-8 space-y-2 text-center md:text-left">
              <h1 className="font-display text-2xl font-semibold tracking-tight">
                Create your account
              </h1>

              <p className="text-sm text-muted-foreground">{description}</p>
            </div>

            {invitationId ? (
              <InvitedSignUp invitationId={invitationId} redirectTo={redirectTo} />
            ) : (
              <SignUpStepper />
            )}
          </div>
        </section>

        <CrewStatement />
      </main>
    </SignUpGuard>
  );
}