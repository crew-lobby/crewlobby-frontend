import { GuestGuard } from "@/features/auth/components/guest-guard";
import { LoginForm } from "@/features/auth/components/login-form";

export default function Home() {
  return (
    <GuestGuard>
      <main className="flex min-h-screen items-center justify-center p-8">
        <LoginForm />
      </main>
    </GuestGuard>
  );
}