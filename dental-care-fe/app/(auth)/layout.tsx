"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { TranslationProvider } from "@/lib/i18n";
import { AuthProvider, useAuth } from "@/lib/auth-context";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TranslationProvider>
      <AuthProvider>
        <AuthRedirectWrapper>{children}</AuthRedirectWrapper>
      </AuthProvider>
    </TranslationProvider>
  );
}

function AuthRedirectWrapper({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || isAuthenticated) {
    // Either loading or already redirecting — render nothing
    return null;
  }

  return <>{children}</>;
}
