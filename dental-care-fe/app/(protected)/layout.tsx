"use client";

import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { AuthProvider } from "@/lib/auth-context";
import { TranslationProvider, useTranslation } from "@/lib/i18n";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";

export default function ProtectedLayoutWrapper({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <TranslationProvider>
      <AuthProvider>
        <SidebarProvider>
          <ProtectedLayout>{children}</ProtectedLayout>
        </SidebarProvider>
      </AuthProvider>
    </TranslationProvider>
  );
}

function ProtectedLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, userEmail, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const { t, isRTL } = useTranslation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/signin");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) return null; // just in case

  let activeView: "overview" | "patients" | "chatbot" = "overview";
  if (pathname?.startsWith("/patient")) activeView = "patients";
  else if (pathname?.startsWith("/chat")) activeView = "chatbot";

  const patientCount = 0;

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      <AppSidebar
        userEmail={userEmail || ""}
        activeView={activeView}
        onViewChange={(view) => {
          router.push(view === "overview" ? "/dashboard" : `/${view}`);
        }}
        patientCount={patientCount}
        onSignout={async () => {
          await fetch("/api/auth/signout", { method: "POST" });
          router.push("/signin");
        }}
      />
      <main className="flex-1">
        <header className="border-b bg-white px-6 py-4">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <h1 className="text-2xl font-bold text-gray-900">
              {t("dashboard.title")}
            </h1>
          </div>
        </header>
        <section className="p-6">{children}</section>
      </main>
    </div>
  );
}
