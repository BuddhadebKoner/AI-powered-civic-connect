"use client";

import { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";

export default function SignUp() {
   const { isLoaded, signUp } = useSignUp();
   const [error, setError] = useState("");
   const [isSubmitting, setIsSubmitting] = useState(false);
   const router = useRouter();

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
      <div className="w-full min-h-screen flex justify-center items-center bg-background">
         <div className="max-w-lg w-full mx-auto p-6 bg-box rounded-lg border-theme border shadow-md">
            <h2 className="text-2xl font-bold text-primary text-center mb-2">
               Register For An Account
            </h2>
            <p className="text-secondary text-center mb-6">
               Please read the terms and conditions before signing up.
            </p>

            {/* OAuth Sign-up Options */}
            <div className="space-y-4 mb-6">
               <button
                  className="w-full py-3 flex items-center justify-center bg-background-secondary text-primary rounded-md border-theme border hover:bg-foreground transition-all"
                  type="button"
                  onClick={() => handleOAuthSignUp("oauth_google")}
                  disabled={isSubmitting || !isLoaded}
               >
                  <IconBrandGoogle className="mr-2" />
                  {"Continue with Google"}
               </button>
               <button
                  className="w-full py-3 flex items-center justify-center bg-background-secondary text-primary rounded-md border-theme border hover:bg-foreground transition-all"
                  type="button"
                  onClick={() => handleOAuthSignUp("oauth_github")}
                  disabled={isSubmitting || !isLoaded}
               >
                  <IconBrandGithub className="mr-2" />
                  {"Continue with GitHub"}
               </button>
            </div>

            {/* CAPTCHA Widget */}
            <div id="clerk-captcha" className="mt-4"></div>

            {error && <p className="text-accent-red text-sm mt-2 text-center">{error}</p>}

            <div className="border-t border-theme pt-4 mt-4">
               <p className="text-center text-sm text-secondary">
                  Already have an account?{" "}
                  <Link href="/sign-in" className="link-color hover:link-hover font-medium">
                     Sign In
                  </Link>
               </p>
            </div>
         </div>
      </div>
   );
}