"use client";

import { useRouter } from "next/navigation";
import { SigninForm } from "@/components/auth/signin-form";

export default function SigninPage() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <SigninForm
          onSwitchToSignup={() => {
            router.push("/signup");
          }}
          onSigninSuccess={async () => {
            router.push("/dashboard");
          }}
        />
      </div>
    </div>
  );
}
