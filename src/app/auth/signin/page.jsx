"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { AlertCircleIcon, ViewIcon, ViewOffSlashIcon } from "hugeicons-react";
import Cookies from "js-cookie";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import toast from "react-hot-toast";

const SignIn = () => {
  const router = useRouter();
  const serachParam = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [domainData, setDomainData] = useState(null);
  const [error, setError] = useState(null);

  const [loadingPage, setLoadingPage] = useState(true);

  const domain = serachParam.get("callbackUrl");

  useEffect(() => {
    const getDomainInfo = async () => {
      try {
        const response = await axios.get(
          `/api/auth/verify-domain?domain=${domain}`
        );

        setDomainData(response?.data?.domain);

        // Get theme from domain info and set it in cookies
        const theme = response?.data?.domain?.theme || "default";
        Cookies.set("theme", theme, { path: "/", sameSite: "strict" });

        // Apply the theme dynamically
        document.documentElement.setAttribute("data-theme", theme);

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
  }, [domain]);

  // Google sign-in handler
  const handleGoogleSignIn = async () => {
    try {
      const result = await signIn("google", {
        callbackUrl: "/",
        redirect: false,
      });
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
    return (
      <div className="flex items-center justify-center h-[100vh] flex-col gap-6 text-lg text-foreground/80">
        <AlertCircleIcon className="h-10 w-10 text-red-600" />
        {error === "Invalid domain" ? <>Source is not listed.</> : <>{error}</>}
      </div>
    );
  }

  if (loadingPage) {
    return (
      <div className="flex items-center justify-center h-[100vh]">
        <Loader2 className="h-5 w-5 animate-spin" />{" "}
      </div>
    );
  }

  return (
    <div className="flex h-[100vh]">
      <div className="grow flex items-center md:justify-center justify-center flex-1 px-0 md:px-10">
        <div className="w-[90%] md:w-[450px]">
          <h2 className="text-2xl font-bold text-foreground/90">
            Sign in to {domainData?.name}
          </h2>

          <div className="flex gap-6 items-center mt-8">
            <Button
              className="h-14 w-[100%] text-[15px] hover:bg-muted/20 text-foreground/80"
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
              Google
            </Button>

            <Button
              className="h-14 w-[100%] text-[15px] hover:bg-muted/20 text-foreground/80"
              variant="outline"
              onClick={handleGitHubSignIn}
            >
              <Image
                src="/images/github.png"
                height={18}
                width={18}
                alt="github"
                className="mr-2"
              />{" "}
              Github
            </Button>
          </div>

          <div className="flex gap-3 items-center mt-6 justify-center">
            <div className="h-[1px] w-[50px] md:w-[130px] bg-muted"></div>
            <p className="text-muted-foreground">or sign in with email</p>
            <div className="h-[1px] w-[50px] md:w-[130px] bg-muted"></div>
          </div>

          <div className="mt-6">
            <Label>Your email</Label>
            <Input
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-[100%] h-14 mt-2 px-5 text-[15px]"
            />

            <br />

            <Label>Password</Label>
            <div className="relative">
              <Input
                placeholder="••••••••"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-[100%] h-14 mt-2 px-5 text-[15px]"
              />
              <div className="absolute top-4 right-5 text-foreground/70 cursor-pointer">
                {showPassword ? (
                  <ViewIcon onClick={toggleShowPassword} />
                ) : (
                  <ViewOffSlashIcon onClick={toggleShowPassword} />
                )}
              </div>
            </div>
          </div>

          <Button
            className="h-14 w-[100%] mt-8 font-medium text-[15px]"
            disabled={loading}
            onClick={handleSignInEmail}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Sign
            in
          </Button>

          <p className="text-muted-foreground mt-5 text-center">
            Don&apos;t have an account{" "}
            <Link
              href="/auth/register"
              className="font-medium text-foreground/80 underline"
            >
              register now
            </Link>
          </p>
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
          Loading...
        </div>
      }
    >
      <SignIn />
    </Suspense>
  );
};

export default Page;
