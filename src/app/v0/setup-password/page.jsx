"use client";

import Input from "@/components/common/Input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { AlertCircleIcon, ViewIcon, ViewOffSlashIcon } from "hugeicons-react";
import Cookies from "js-cookie";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import toast from "react-hot-toast";

const SetUpPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const source = Cookies.get("source");

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  const [loadingPage, setLoadingPage] = useState(true);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await axios.get(`/api/auth/user?token=${token}`);
        setEmail(response?.data?.email);
        setName(response?.data?.name);
        setLoadingPage(false);
      } catch (error) {
        setLoadingPage(false);
        console.log(error);
        if (error.response) {
          if (error?.response?.data?.msg === "Invalid token") {
            setError("Invalid token");
          }
          toast.error(error?.response?.data?.msg);
        }
      }
    };

    getUserInfo();
  }, [token]);

  const handleResetPassword = async () => {
    if (password != confirmPass) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`/api/auth/reset-password`, {
        password,
        email,
        name,
      });
      toast.success(response?.data?.msg);

      setConfirmPass("");
      setPassword("");
      router.push(`/v0/signin?source=${source}`);
    } catch (error) {
      console.log(error);
      if (error?.response) {
        toast.error(error?.response?.data?.msg);
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
      <div className="flex items-center justify-center h-[100vh] flex-col gap-6 text-lg text-gray-800">
        <AlertCircleIcon className="h-10 w-10 text-red-600" />
        {error === "Invalid token" ? (
          <>Token is expired or invalid.</>
        ) : (
          <>{error}</>
        )}
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
              src={"/images/dotix.ico"}
              height={40}
              width={40}
              alt="logo"
            />
            <h2 className="text-gray-800 text-3xl mt-6 font-semibold">
              Hello, {name}
            </h2>
            <p className="mt-2 md:mt-4 text-gray-600">
              Please enter your new password
            </p>
          </div>

          <div className="w-[400px]">
            <Input
              placeholder="New Password"
              setValue={setPassword}
              value={password}
              type={"password"}
            />

            <div className="h-4"></div>

            <div className="relative">
              <Input
                placeholder="Confirm Password"
                setValue={setConfirmPass}
                value={confirmPass}
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

            <div className="flex items-center justify-end gap-4 mt-10">
              <Button
                className="h-[44px] rounded-full px-5 text-[15px] hover:bg-primary"
                onClick={handleResetPassword}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{" "}
                Reset Password
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
          <Loader2 className="h-8 w-8 animate-spin text-gray-800" />{" "}
        </div>
      }
    >
      <SetUpPassword />
    </Suspense>
  );
};

export default Page;
