"use client";

import Cookies from "js-cookie";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect } from "react";

const Home = () => {
  const searchParams = useSearchParams();
  const { data, status } = useSession();
  const callback = Cookies.get("callback");
  const source = Cookies.get("source") || searchParams.get("source");
  const router = useRouter();

  useEffect(() => {
    if (data?.user?.sessionId) {
      router.push(`${callback}${data?.user?.sessionId}`);
    } else {
      router.push(`/v0/signin?source=${source}`);
    }
  }, [data, router, callback, source]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-[100vh]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-700" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-[100vh]">
      <Loader2 className="h-8 w-8 animate-spin text-gray-700" />
    </div>
  );
};

const Page = () => {
  return (
    <Suspense
      fallback={
        <div className="w-[100%] h-[100vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-800" />{" "}
        </div>
      }
    >
      <Home />
    </Suspense>
  );
};

export default Page;
