"use client";

import Input from "@/components/common/Input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { Suspense, useState } from "react";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendLink = async () => {
    if (!email) {
      toast.error("Please enter your email!");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`/api/auth/forgot-password`, { email });

      setEmail("");
      toast.success(response?.data?.msg);
    } catch (error) {
      console.log(error);
      if (error?.response) {
        toast.error(error?.response?.data?.msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[100vh] bg-foreground items-center justify-center">
      <div className=" w-[100%] sm:w-[400px] md:w-[800px] lg:w-[1000px]">
        <div className="w-[100%] min-h-[350px] px-[20px] md:px-[40px] p-[40px] rounded-[25px] bg-background flex items-start justify-between md:flex-nowrap flex-wrap gap-[60px]">
          <div>
            <Image
              src={"/images/dotix.ico"}
              height={40}
              width={40}
              alt="logo"
            />
            <h2 className="text-gray-800 text-3xl mt-6 font-semibold">
              Forgot Password
            </h2>
            <p className="mt-2 md:mt-4 text-gray-600">
              Provide email address to receive a password reset link.
            </p>
          </div>

          <div className="w-[400px]">
            <Input
              placeholder="Your email"
              setValue={setEmail}
              value={email}
              type={"email"}
            />

            <div className="flex items-center justify-end gap-4 mt-10">
              <Button
                className="h-[44px] rounded-full px-5 text-[15px] hover:bg-primary"
                onClick={handleSendLink}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{" "}
                Send Link
              </Button>
            </div>
          </div>
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
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }
    >
      <ForgotPassword />
    </Suspense>
  );
};

export default Page;
