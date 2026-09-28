import { CrewLogo } from "@/components/crew-logo";
import { CrewStatement } from "@/components/crew-statement";
import { AcceptInvitationView } from "@/features/invitations/components/accept-invitation-view";

export default async function AcceptInvitationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="grid min-h-svh bg-background lg:grid-cols-2">
      <section className="flex flex-col gap-6 p-6 md:p-10">
        <CrewLogo href="/" />

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <AcceptInvitationView invitationId={id} />
          </div>
        </div>
      </section>

      <CrewStatement />
    </main>
  );
}