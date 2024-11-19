"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { ViewIcon, ViewOffSlashIcon } from "hugeicons-react";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

const Page = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

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
    <div className="flex h-[100vh]">
      <div className="w-0 md:w-[430px] hidden md:block">
        <video
          src="/images/signup.mp4"
          autoPlay={true}
          className="h-full aspect-video object-cover"
          muted
          loop
        />
      </div>
      <div className="grow flex items-center md:justify-center justify-center flex-1 px-0 md:px-10">
        <div className="w-[90%] md:w-[450px]">
          <h2 className="text-2xl font-bold  text-foreground/90">
            Create an account
          </h2>

          <div className="flex gap-6 items-center mt-8">
            <Button
              className="h-14 w-[100%] hover:bg-muted/20"
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
              className="h-14 w-[100%] hover:bg-muted/20"
              variant="outline"
              onClick={handleGoogleSignIn}
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
            <p className="text-muted-foreground">or continue with email</p>
            <div className="h-[1px] w-[50px] md:w-[130px] bg-muted"></div>
          </div>

          <div className="mt-6">
            <Label>Fullname</Label>
            <Input
              placeholder="Your fullname"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-[100%] h-14 mt-2 px-5 text-[15px]"
            />

            <br />

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
            onClick={handleRegister}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Sign
            in
          </Button>

          <p className="text-muted-foreground mt-5 text-center">
            Already have an account{" "}
            <Link
              href="/auth/signin"
              className="font-medium text-foreground/80 underline"
            >
              signin
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
