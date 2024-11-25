"use client";

import Cookies from "js-cookie";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

const Page = () => {
  const searchParams = useSearchParams();
  const { data, status } = useSession();
  const callback = Cookies.get("callback");
  const source = Cookies.get("source") || searchParams.get("source");
  const router = useRouter();

  useEffect(() => {
    if (data?.user?.sessionId) {
      router.push(`${callback}?sessionId=${data?.user?.sessionId}`);
    } else {
      router.push(`/v0/signin?source=${source}`);
    }
  }, [data]);

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

export default Page;
