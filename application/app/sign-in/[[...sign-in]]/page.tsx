"use client";

import { useState } from "react";
import { SignOutButton, useSignIn } from "@clerk/nextjs";
import Link from "next/link";
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";

export default function SignIn() {
   const { isLoaded, signIn } = useSignIn();
   const [error, setError] = useState("");
   const [loading, setLoading] = useState(false);

   const handleOAuthSignIn = async (strategy: "oauth_google" | "oauth_github") => {
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
      <div className="w-full min-h-screen flex justify-center items-center bg-background">
         <div className="max-w-lg w-full mx-auto p-6 bg-box rounded-lg border-theme border shadow-md">
            {loading && (
               <div className="absolute inset-0 bg-glass flex items-center justify-center z-10">
                  <span className="text-lg font-semibold text-primary">Loading...</span>
               </div>
            )}

            <h2 className="text-2xl font-bold text-primary text-center mb-2">
               Sign in to your account
            </h2>
            <p className="text-secondary text-center mb-6">
               Welcome back! Please sign in to continue.
            </p>

            <div className="mt-6 space-y-6">
               <>
                  <div className="space-y-4">
                     <button
                        className="w-full py-3 flex items-center justify-center bg-background-secondary text-primary rounded-md border-theme border hover:bg-foreground transition-all"
                        type="button"
                        onClick={() => handleOAuthSignIn("oauth_google")}
                        disabled={loading}
                     >
                        <IconBrandGoogle className="mr-2" />
                        {"Continue with Google"}
                     </button>
                     <button
                        className="w-full py-3 flex items-center justify-center bg-background-secondary text-primary rounded-md border-theme border hover:bg-foreground transition-all"
                        type="button"
                        onClick={() => handleOAuthSignIn("oauth_github")}
                        disabled={loading}
                     >
                        <IconBrandGithub className="mr-2" />
                        {"Continue with GitHub"}
                     </button>

                     {/* show errors */}
                     {error && (
                        <>
                           <div className="accent-red text-sm mt-2">{error}</div>
                           {
                              error === "You're currently in single session mode. You can only be signed into one account at a time." && (
                                 <div className="text-center mt-4">
                                    <SignOutButton>
                                       <button className="w-full py-3 flex items-center justify-center bg-highlight-primary text-white rounded-md hover:bg-link-hover transition-all">
                                          Sign Out
                                       </button>
                                    </SignOutButton>
                                 </div>
                              )
                           }
                        </>
                     )}
                  </div>
               </>

               <div className="border-t border-theme pt-4 mt-4">
                  <p className="text-center text-sm text-secondary">
                     Don&apos;t have an account?{" "}
                     <Link href="/sign-up" className="link-color hover:link-hover font-medium">
                        Register
                     </Link>
                  </p>
               </div>
            </div>
         </div>
      </div>
   );
}