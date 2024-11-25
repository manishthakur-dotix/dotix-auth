"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import Cookies from "js-cookie";
import { CookingPot, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import toast from "react-hot-toast";

const VerifyEmail = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const source = Cookies.get("source") || "";
  const router = useRouter();
  const [loadingPage, setLoadingPage] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setLoadingPage(false);
        toast.error("No verification token was provided.");
        return;
      }

      try {
        const response = await axios.get(
          `/api/auth/verify-email?token=${token}`
        );
        console.log(response);
        toast.success(response?.data?.msg);
        router.push(`/v0/signin?source=${source}`);
      } catch (error) {
        console.log(error);
        if (error?.response?.data?.msg === "Invalid or expired token") {
          setError("Invalid or expired token");
        }
      } finally {
        setLoadingPage(false); // Stop loading in either case
      }
    };

    verifyEmail(); // Call the function to verify email
  }, [token]);

  if (loadingPage) {
    return (
      <div className="w-[100vw] h-[100vh] flex justify-center items-center">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  if (error === "Invalid or expired token") {
    return (
      <>
        <div className="flex items-center justify-center h-[100vh] bg-slate-100">
          <div className="w-[400px] bg-white rounded-lg p-6 py-10 text-center">
            <i class="ri-error-warning-line text-[50px] text-red-600"></i>

            <p className="font-medium text-gray-600 text-lg">
              Your token has been expired or invalid.
            </p>

            <Link href={"/auth/signin"}>
              <Button className="h-12 px-10 mt-8 font-medium text-[15px]">
                Back to signin
              </Button>
            </Link>
          </div>
        </div>
      </>
    );
  }

  return null;
};

const Page = () => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-[100vh]">
          <Loader2 className="h-8 w-8 animate-spin text-gray-800" />
        </div>
      }
    >
      <VerifyEmail />
    </Suspense>
  );
};

export default Page;
