import { TeamDetail } from "@/features/teams/components/team-detail";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function TeamDetailPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="mx-auto w-full max-w-3xl p-4 md:p-6">
      <TeamDetail teamId={id} />
    </div>
  );
}