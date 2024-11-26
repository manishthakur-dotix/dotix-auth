"use client";

import Input from "@/components/common/Input";
import SourceInfo from "@/components/common/SourceInfo";
import SourceNotListed from "@/components/common/SourceNotListed";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { AlertCircleIcon, ViewIcon, ViewOffSlashIcon } from "hugeicons-react";
import Cookies from "js-cookie";
import { Loader2 } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import toast from "react-hot-toast";

const SignIn = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const source = searchParams.get("source");

  const { data, status } = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [domainData, setDomainData] = useState(null);
  const [error, setError] = useState(null);

  const [signOutExecuted, setSignOutExecuted] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);
  const [continueWithEmail, setContinueWithEmail] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      // If the user is authenticated and source matches, redirect to home page
      if (source === Cookies.get("source") && data?.user?.sessionId) {
        router.push("/");
      } else {
        // Prevent multiple sign-out calls
        if (!signOutExecuted) {
          setSignOutExecuted(true); // Mark that we have executed sign-out

          const getDomainInfo = async () => {
            try {
              const response = await axios.get(
                `/api/auth/verify-domain?domain=${source}`
              );

              setDomainData(response?.data?.domain);

              // Get theme from domain info and set it in cookies
              const theme = response?.data?.domain?.theme || "default";

              Cookies.set("source", source, { path: "/" });
              Cookies.set("theme", theme, { path: "/" });
              Cookies.set("callback", response?.data?.domain?.callback, {
                path: "/",
              });

              // Apply the theme dynamically
              document.documentElement.setAttribute("data-theme", theme);

              // Sign out the user manually without redirecting
              signOut({ redirect: false });

              setLoadingPage(false);
            } catch (error) {
              setLoadingPage(false);
              console.log(error);
              if (error.response) {
                if (error?.response?.data?.msg === "Invalid domain") {
                  setError("Invalid domain");
                }
                toast.error(error?.response?.data?.msg);
              }
            }
          };

          getDomainInfo();
        }
      }
    } else {
      setLoadingPage(false); // Stop loading if not authenticated
    }
  }, [source, data, status]); // Added `status` to dependency to monitor session state

  const handleGoogleSignIn = async () => {
    try {
      const result = await signIn("google", {
        callbackUrl: "/",
        redirect: false,
      });
      console.log("result", result);

      if (!result) throw new Error("Google sign-in failed.");
    } catch (error) {
      console.error("Error during Google sign-in:", error);
    }
  };

  // Github sign-in handler
  const handleGitHubSignIn = async () => {
    try {
      const result = await signIn("github", {
        callbackUrl: "/",
        redirect: false,
      });

      console.log("result", result);
      if (!result) throw new Error("Github sign-in failed.");
    } catch (error) {
      console.error("Error during Github sign-in:", error);
    }
  };

  const handleSignInEmail = async () => {
    if (!email || !password) {
      toast.error("Enter email & password");
      return;
    }
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email,
        password,
        callbackUrl: "/",
        redirect: false,
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        router.push("/");
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        toast.error(error?.response.data?.msg);
      } else {
        toast.error("Something went wrong! try again");
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  if (error) {
    return error === "Invalid domain" ? (
      <SourceNotListed />
    ) : (
      <div className="flex items-center justify-center h-[100vh] flex-col gap-6 text-lg text-gray-800">
        <AlertCircleIcon className="h-10 w-10 text-red-600" />
        {error}
      </div>
    );
  }

  if (loadingPage) {
    return (
      <div className="flex items-center justify-center h-[100vh]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-800" />{" "}
      </div>
    );
  }

  return (
    <div className="flex h-[100vh] bg-foreground items-center justify-center">
      <div className=" w-[100%] sm:w-[400px] md:w-[800px] lg:w-[1000px]">
        <div className="w-[100%] px-[20px] md:px-[40px] p-[40px] rounded-[25px] bg-background flex items-start justify-between md:flex-nowrap flex-wrap gap-[60px]">
          <div>
            <Image
              src={domainData?.icon || "/images/dotix.ico"}
              height={40}
              width={40}
              alt="logo"
            />
            <h2 className="text-gray-800 text-3xl mt-6 font-semibold">
              Sign in
            </h2>
            <p className="mt-2 md:mt-4 text-gray-600">
              Sign in to your{" "}
              <SourceInfo
                name={domainData?.name}
                email={domainData?.email}
                phone={domainData?.phone}
                source={source}
              />{" "}
              account
            </p>
          </div>

          {continueWithEmail ? (
            <div className="w-[400px]">
              <Input
                placeholder="Your email"
                setValue={setEmail}
                value={email}
                type={"email"}
              />
              <div className="h-4"></div>
              <div className="relative">
                <Input
                  placeholder="Password"
                  setValue={setPassword}
                  value={password}
                  type={showPassword ? "text" : "password"}
                />
                <div className="absolute z-10 top-4 right-5 text-gray-600 cursor-pointer">
                  {showPassword ? (
                    <ViewIcon onClick={toggleShowPassword} />
                  ) : (
                    <ViewOffSlashIcon onClick={toggleShowPassword} />
                  )}
                </div>
              </div>
              <Link href={`/v0/forgot-password`}>
                <Button
                  className="h-12 rounded-full text-[14px] px-3 mt-1"
                  variant="link"
                >
                  Forgot Password?
                </Button>
              </Link>

              <div className="flex items-center justify-end gap-4 mt-10">
                <Link href={"/v0/register"}>
                  <Button
                    className="h-12 rounded-full px-5 text-[15px]"
                    variant="link"
                  >
                    Create account
                  </Button>
                </Link>

                <Button
                  className="h-[44px] rounded-full px-5 text-[15px] hover:bg-primary"
                  onClick={handleSignInEmail}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{" "}
                  Sign in
                </Button>
              </div>
            </div>
          ) : (
            <div className="w-[400px]">
              <Button
                className="h-12 w-[100%] rounded-full text-[15px] hover:bg-muted/20 text-gray-700"
                variant="outline"
                onClick={handleGoogleSignIn}
              >
                <Image
                  src="/images/google.svg"
                  height={18}
                  width={18}
                  alt="google"
                  className="mr-2"
                />{" "}
                Sign in with google
              </Button>

              <Button
                className="h-12 w-[100%] rounded-full  text-[15px] hover:bg-muted/20 text-gray-700 mt-6"
                variant="outline"
                onClick={handleGitHubSignIn}
              >
                <Image
                  src="/images/github.png"
                  height={18}
                  width={18}
                  alt="google"
                  className="mr-2"
                />{" "}
                Sign in with Github
              </Button>

              <div className="flex gap-3 items-center mt-6 justify-center">
                <div className="h-[1px] w-[50px] md:w-[140px] bg-muted"></div>
                <p className="text-muted-foreground">or</p>
                <div className="h-[1px] w-[50px] md:w-[140px] bg-muted"></div>
              </div>

              <Button
                className="h-12 w-[100%] rounded-full text-[15px] hover:bg-muted/20 text-gray-700 mt-6"
                variant="outline"
                onClick={() => setContinueWithEmail(true)}
              >
                <Image
                  src="/images/gmail.webp"
                  height={18}
                  width={18}
                  alt="email"
                  className="mr-2"
                />{" "}
                Continue with email
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end mt-6 text-gray-500 gap-6 text-sm pr-5">
          <Link href={"/privacy-policy"}>
            <p>Privacy</p>
          </Link>
          <Link href={"/cookie-policy"}>
            <p>Cookie Policy</p>
          </Link>
          <Link href={"/terms"}>
            <p>Terms</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

const Page = () => {
  return (
    <Suspense
      fallback={
        <div className="w-[100%] h-[100%] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-800" />{" "}
        </div>
      }
    >
      <SignIn />
    </Suspense>
  );
};

export default Page;
