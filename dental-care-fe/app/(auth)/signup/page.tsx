"use client";

import { useRouter } from "next/navigation";
import { SigninForm } from "@/components/auth/signin-form";
import { SignupForm } from "@/components/auth/signup-form";

export default function SignupPage() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <SignupForm
          onSwitchToSignin={() => {
            router.push("/signin");
          }}
          onSignupSuccess={async () => {
            router.push("/signin");
          }}
        />
      </div>
    </div>
  );
}
