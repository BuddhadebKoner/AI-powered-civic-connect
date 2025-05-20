"use client";

import { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import Link from "next/link";
import { IconBrandGithub, IconBrandGoogle, IconUsers } from "@tabler/icons-react";

export default function SignUp() {
   const { isLoaded, signUp } = useSignUp();
   const [error, setError] = useState("");
   const [isSubmitting, setIsSubmitting] = useState(false);

   const handleOAuthSignUp = async (strategy: "oauth_google" | "oauth_github") => {
      if (!isLoaded || isSubmitting) return;

      setIsSubmitting(true);
      try {
         await signUp.authenticateWithRedirect({
            strategy,
            redirectUrl: "/",
            redirectUrlComplete: "/",
         });
      } catch (err: unknown) {
         if (err instanceof Error) {
            setError(err.message || "OAuth sign-up failed. Please try again.");
         } else {
            setError("OAuth sign-up failed. Please try again.");
         }
      } finally {
         setIsSubmitting(false);
      }
   };

   return (
      <div className="w-full min-h-screen flex justify-center items-center bg-[var(--color-background)]">
         <div className="max-w-md w-full mx-4 p-8 rounded-xl shadow-lg animate-fadeIn bg-[var(--color-surface)] border border-[var(--color-border)]">
            {/* Logo/Icon Section */}
            <div className="flex justify-center mb-6">
               <div className="w-16 h-16 rounded-full bg-[var(--color-surface-hover)] flex items-center justify-center">
                  <IconUsers size={32} className="text-[var(--color-foreground)]" />
               </div>
            </div>

            <div className="mb-6 text-center">
               <h1 className="text-2xl font-bold mb-2 text-[var(--color-foreground)]">
                  Join ConnectSocial
               </h1>
               <p className="text-sm text-[var(--color-gray-400)]">
                  Connect with friends and the world around you
               </p>
            </div>

            {/* OAuth Sign-up Options */}
            <div className="space-y-3">
               <button
                  className="w-full py-3 flex items-center justify-center rounded-md transition-all hover:bg-[var(--color-surface-hover)] bg-[var(--color-background)] text-[var(--color-foreground)] border border-[var(--color-border)]"
                  style={{
                     opacity: (isSubmitting || !isLoaded) ? "0.7" : "1"
                  }}
                  type="button"
                  onClick={() => handleOAuthSignUp("oauth_google")}
                  disabled={isSubmitting || !isLoaded}
               >
                  <IconBrandGoogle className="mr-2" size={20} />
                  Continue with Google
               </button>
               <button
                  className="w-full py-3 flex items-center justify-center rounded-md transition-all hover:bg-[var(--color-surface-hover)] bg-[var(--color-background)] text-[var(--color-foreground)] border border-[var(--color-border)]"
                  style={{
                     opacity: (isSubmitting || !isLoaded) ? "0.7" : "1"
                  }}
                  type="button"
                  onClick={() => handleOAuthSignUp("oauth_github")}
                  disabled={isSubmitting || !isLoaded}
               >
                  <IconBrandGithub className="mr-2" size={20} />
                  Continue with GitHub
               </button>
            </div>

            {/* CAPTCHA Widget */}
            <div id="clerk-captcha" className="mt-6"></div>

            {error && (
               <p className="text-sm mt-4 text-center text-red-500">
                  {error}
               </p>
            )}

            <div className="pt-6 mt-6 text-center border-t border-[var(--color-border)]">
               <p className="text-sm text-[var(--color-gray-400)]">
                  Already have an account?{" "}
                  <Link
                     href="/sign-in"
                     className="font-medium hover:underline text-[var(--color-foreground)]"
                  >
                     Sign In
                  </Link>
               </p>
            </div>

            <div className="mt-8 text-xs text-center text-[var(--color-gray-400)]">
               By signing up, you agree to our Terms of Service and Privacy Policy.
            </div>
         </div>
      </div>
   );
}