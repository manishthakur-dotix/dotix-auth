"use client";

import { Button } from "@/components/ui/button";
import Input from "@/components/common/Input";
import axios from "axios";
import { ViewIcon, ViewOffSlashIcon } from "hugeicons-react";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

const Page = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const source = Cookies.get("source") || "";

  const [continueWithEmail, setContinueWithEmail] = useState(false);

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

  const handleRegister = async () => {
    if (!name || !email || !password) {
      toast.error("All fields are required!");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`/api/auth/register`, {
        name,
        email,
        password,
      });

      toast.success(response?.data?.msg);
      setEmail("");
      setName("");
      setPassword("");
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
              Create an account
            </h2>
            <p className="mt-2 md:mt-4 text-gray-600">
              Select a sign-up method to join the community
            </p>
          </div>

          {continueWithEmail ? (
            <div className="w-[400px]">
              <Input
                placeholder="Fullname"
                value={name}
                setValue={setName}
                type={"email"}
              />
              <div className="h-4"></div>
              <Input
                placeholder="Your email"
                value={email}
                setValue={setEmail}
                type={"email"}
              />
              <div className="h-4"></div>
              <div className="relative">
                <Input
                  placeholder="Password"
                  value={password}
                  setValue={setPassword}
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

              <div className="flex items-center justify-end gap-4 mt-8">
                <Link href={`/v0/signin?source=${source}`}>
                  <Button
                    className="h-12 rounded-full px-5 text-[15px]"
                    variant="link"
                  >
                    Sign in
                  </Button>
                </Link>

                <Button
                  className="h-[44px] rounded-full px-5 text-[15px] hover:bg-primary"
                  onClick={handleRegister}
                >
                  {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}{" "}
                  Create account
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
                onClick={handleGoogleSignIn}
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
          <p>Privacy</p>
          <p>Cookie Policy</p>
          <p>Terms</p>
        </div>
      </div>
    </div>
  );
};

export default Page;
