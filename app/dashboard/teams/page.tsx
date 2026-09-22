import { TeamsList } from "@/features/teams/components/teams-list";

export default function TeamsPage() {
  return (
    <main className="flex min-h-full w-full flex-1 px-5 py-8 md:px-8 lg:px-10">
      <TeamsList />
    </main>
  );
}