"use client";

import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaApple } from "react-icons/fa";

import { Button } from "@/components/ui/button";

export const Social = () => {
  const onClick = (provider: "google" | "facebook" | "apple") => {
    console.log("onClick", provider);
  };

  return (
    <div className="flex justify-center items-center w-full gap-x-2">
      <Button
        className="w-fit rounded-full h-fit p-5 hover:bg-zinc-200 transition-colors duration-300"
        variant="outline"
        onClick={() => onClick("google")}
      >
        <FcGoogle className="h-8 w-8" />
      </Button>
      <Button
        className="w-fit rounded-full h-fit p-5 hover:bg-zinc-200 transition-colors duration-300"
        variant="outline"
        onClick={() => onClick("facebook")}
      >
        <FaFacebook className="h-8 w-8" />
      </Button>
      <Button
        className="w-fit rounded-full h-fit p-5 hover:bg-zinc-200 transition-colors duration-300"
        variant="outline"
        onClick={() => onClick("apple")}
      >
        <FaApple className="h-8 w-8" />
      </Button>
    </div>
  );
};
