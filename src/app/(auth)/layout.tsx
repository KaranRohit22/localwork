import { Suspense } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={<div className="h-16 bg-white border-b border-border" />}>
        <Navbar />
      </Suspense>
      <main className="flex-1 flex items-center justify-center py-12 px-4 bg-background">
        {children}
      </main>
      <Footer />
    </>
  );
}
