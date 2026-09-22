import { CrewLogo } from "@/components/crew-logo";
import { CrewStatement } from "@/components/crew-statement";
import { SignUpGuard } from "@/features/auth/components/sign-up-guard";
import { SignUpStepper } from "@/features/auth/components/sign-up-stepper";

export default function SignUpPage() {
  return (
    <SignUpGuard>
      <main className="grid min-h-svh lg:grid-cols-2">
        <section className="flex flex-col gap-6 p-6 md:p-10">
          <div className="flex items-center gap-2 self-center font-semibold md:self-start">
            <CrewLogo />
          </div>

          <div className="m-auto w-full max-w-sm">
            <div className="mb-8 space-y-2 text-center md:text-left">
              <h1 className="font-display text-2xl font-semibold tracking-tight">
                Create your account
              </h1>

              <p className="text-sm text-muted-foreground">
                Start organizing your team&apos;s work in one place.
              </p>
            </div>

            <SignUpStepper />
          </div>
        </section>

        <CrewStatement />
      </main>
    </SignUpGuard>
  );
}