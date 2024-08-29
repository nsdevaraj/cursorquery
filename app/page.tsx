"use client";
import BannerGenerator from '@/components/BannerGenerator';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24"> 
      <BannerGenerator />
    </main>
  );
}