"use client";

import { Button } from "@/components/ui/button";
import { AlertCircleIcon, ArrowLeft02Icon } from "hugeicons-react";
import Cookies from "js-cookie";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Page = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const [source, setSource] = useState("");

  useEffect(() => {
    if (error) {
      toast.error(error);
    }

    const source = Cookies.get("source");
    setSource(source);
  }, [error]);

  return (
    <div className="flex h-[100vh] bg-foreground items-center justify-center">
      <div className="flex items-center justify-center p-10 rounded-2xl  bg-background flex-col gap-6 text-lg text-gray-800">
        <AlertCircleIcon className="h-10 w-10 text-red-600" />
        {error}
        <Link href={`/v0/signin?source=${source}`}>
          <Button className="bg-gray-900 hover:bg-gray-800">
            <ArrowLeft02Icon /> Back to Sign in
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Page;
