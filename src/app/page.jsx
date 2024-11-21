"use client";

import Cookies from "js-cookie";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Page = () => {
  const { data } = useSession();
  const callback = Cookies.get("callback");
  const source = Cookies.get("source");
  const router = useRouter();

  useEffect(() => {
    if (data?.user?.sessionId) {
      router.push(`${callback}/${data?.user?.sessionId}`);
    } else {
      router.push(`/v0/signin?source=${source}`);
    }
  }, [data]);

  return <div>Page</div>;
};

export default Page;
