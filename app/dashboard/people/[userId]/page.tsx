import { ProfilePage } from "@/features/profile/components/profile-page";

type PageProps = {
  params: Promise<{ userId: string }>;
};

export default async function PersonProfilePage({ params }: PageProps) {
  const { userId } = await params;

  return (
    <div className="w-full px-5 py-8 md:px-8 lg:px-10">
      <ProfilePage userId={userId} />
    </div>
  );
}