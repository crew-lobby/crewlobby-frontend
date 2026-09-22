import { PeopleList } from "@/features/profile/components/people-list";

export default function PeoplePage() {
  return (
    <main className="flex min-h-full w-full flex-1 flex-col px-5 py-8 md:px-8 lg:px-10">
      <PeopleList />
    </main>
  );
}