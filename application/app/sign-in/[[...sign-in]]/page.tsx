"use client";

import { useState } from "react";
import { SignOutButton, useSignIn } from "@clerk/nextjs";
import Link from "next/link";
import { IconBrandGoogle, IconBrandFacebook, IconBrandApple, IconUsers } from "@tabler/icons-react";

export default function SignIn() {
   const { isLoaded, signIn } = useSignIn();
   const [error, setError] = useState("");
   const [loading, setLoading] = useState(false);

   const handleOAuthSignIn = async (strategy: "oauth_google" | "oauth_facebook" | "oauth_apple") => {
      if (!isLoaded) return;
      setLoading(true);
      try {
         await signIn.authenticateWithRedirect({
            strategy,
            redirectUrl: "/",
            redirectUrlComplete: "/",
         });
      } catch (err: unknown) {
         if (err instanceof Error) {
            setError(err?.message || "OAuth sign-in failed. Please try again.");
         } else {
            setError("OAuth sign-in failed. Please try again.");
         }
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="w-full min-h-screen flex justify-center items-center bg-[var(--color-background)]">
         <div className="max-w-md w-full mx-4 p-8 rounded-xl shadow-lg animate-fadeIn bg-[var(--color-surface)] border border-[var(--color-border)]">
            {loading && (
               <div className="absolute inset-0 flex items-center justify-center z-10 bg-opacity-10 bg-black">
                  <div className="p-4 rounded-md bg-[var(--color-surface)]">
                     <span className="text-lg font-semibold text-[var(--color-foreground)]">
                        Loading...
                     </span>
                  </div>
               </div>
            )}

            {/* Logo/Icon Section */}
            <div className="flex justify-center mb-6">
               <div className="w-16 h-16 rounded-full bg-[var(--color-surface-hover)] flex items-center justify-center">
                  <IconUsers size={32} className="text-[var(--color-foreground)]" />
               </div>
            </div>

            <h2 className="text-2xl font-bold text-center mb-2 text-[var(--color-foreground)]">
               Sign in to ConnectSocial
            </h2>
            <p className="text-center mb-6 text-[var(--color-gray-400)]">
               Welcome back! Connect with your community.
            </p>

            <div className="space-y-3">
               <button
                  className="w-full py-3 flex items-center justify-center rounded-md transition-all hover:bg-[var(--color-surface-hover)] bg-[var(--color-background)] text-[var(--color-foreground)] border border-[var(--color-border)]"
                  style={{
                     opacity: loading ? "0.7" : "1"
                  }}
                  type="button"
                  onClick={() => handleOAuthSignIn("oauth_google")}
                  disabled={loading}
               >
                  <IconBrandGoogle className="mr-2" size={20} />
                  Continue with Google
               </button>
               <button
                  className="w-full py-3 flex items-center justify-center rounded-md transition-all hover:bg-[var(--color-surface-hover)] bg-[var(--color-background)] text-[var(--color-foreground)] border border-[var(--color-border)]"
                  style={{
                     opacity: loading ? "0.7" : "1"
                  }}
                  type="button"
                  onClick={() => handleOAuthSignIn("oauth_facebook")}
                  disabled={loading}
               >
                  <IconBrandFacebook className="mr-2" size={20} />
                  Continue with Facebook
               </button>
               <button
                  className="w-full py-3 flex items-center justify-center rounded-md transition-all hover:bg-[var(--color-surface-hover)] bg-[var(--color-background)] text-[var(--color-foreground)] border border-[var(--color-border)]"
                  style={{
                     opacity: loading ? "0.7" : "1"
                  }}
                  type="button"
                  onClick={() => handleOAuthSignIn("oauth_apple")}
                  disabled={loading}
               >
                  <IconBrandApple className="mr-2" size={20} />
                  Continue with Apple
               </button>

               {/* show errors */}
               {error && (
                  <>
                     <div className="text-sm mt-4 text-center text-red-500">{error}</div>
                     {
                        error === "You're currently in single session mode. You can only be signed into one account at a time." && (
                           <div className="text-center mt-4">
                              <SignOutButton>
                                 <button className="w-full py-3 flex items-center justify-center rounded-md transition-all hover:opacity-90 bg-red-600 text-white">
                                    Sign Out
                                 </button>
                              </SignOutButton>
                           </div>
                        )
                     }
                  </>
               )}
            </div>

            <div className="pt-6 mt-6 text-center border-t border-[var(--color-border)]">
               <p className="text-sm text-[var(--color-gray-400)]">
                  Don&apos;t have an account?{" "}
                  <Link href="/sign-up" className="font-medium hover:underline text-[var(--color-foreground)]">
                     Sign Up
                  </Link>
               </p>
            </div>

            <div className="mt-8 text-xs text-center text-[var(--color-gray-400)]">
               By signing in, you agree to our Terms of Service and Privacy Policy.
            </div>
         </div>
      </div>
   );
}