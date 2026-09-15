import { ProfilePage } from "@/features/profile/components/profile-page";

type PageProps = {
  params: Promise<{ userId: string }>;
};

export default async function PersonProfilePage({ params }: PageProps) {
  const { userId } = await params;

  return (
    <div className="mx-auto w-full max-w-2xl p-4 md:p-6">
      <ProfilePage userId={userId} />
    </div>
  );
}
