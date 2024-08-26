"use client";
import UserOnboarding from '../components/user-onboarding';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <UserOnboarding />
    </main>
  );
}