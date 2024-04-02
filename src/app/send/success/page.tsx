"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button } from "@/components/ui/button";
import { FC } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { useSearchParams } from "next/navigation";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const searchParams = useSearchParams();
  return (
    <div className="w-full mx-auto overflow-hidden">
      <MaxWidthWrapper>
        <div className="mx-auto pb-8 min-h-screen py-8 flex w-full flex-col justify-center items-center sm:w-md">
          <div className="mb-12 mt-10 text-stone-700 self-start">
            <Link href={"/"}>
              <X />
            </Link>
          </div>
          <p className="text-center text-2xl font-semibold">
            Transaction Successful
          </p>
          <small className="text-center text-base mt-3 text-stone-500">
            You sent {searchParams.get("unit")} to{" "}
            {searchParams.get("receiver")}.
          </small>
          <div className="h-52 w-52 md:h-80 md:w-80 rounded-full my-7 md:my-10 bg-[radial-gradient(circle_closest-side,_var(--tw-gradient-stops))] from-[#84f17a] from-20% via-[#99EA92]/50 to-[#99EA92]/0 flex items-center justify-center">
            <Avatar className="h-20 w-20">
              <AvatarImage src={searchParams.get("image") as any} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
          <div className="w-full mb-12 flex flex-col items-center mx-4">
            <h2 className="text-2xl md:text-3xl font-semibold">
              {searchParams.get("amount")} {searchParams.get("unit")}
            </h2>
            <h2 className="font-semibold md:text-lg text-stone-600 my-4">
              ${searchParams.get("usd")}
            </h2>
          </div>
          <Link href={"/"} className="w-full">
            <Button className="w-full h-16 mt-auto px-10">Done</Button>
          </Link>
          <div className="h-10"></div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default page;
