"use client";

import { Icons } from "@/components/Icons";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button } from "@/components/ui/button";
import { FC, useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import Confetti from "react-dom-confetti";

interface pageProps {}

const Page: FC<pageProps> = ({}) => {
  const confettiConfig = {
    angle: 90,
    spread: 360,
    startVelocity: 35,
    elementCount: 250,
    dragFriction: 0.12,
    duration: 20000,
    stagger: 5,
    width: "10px",
    height: "15px",
    perspective: "500px",
    colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"],
  };
  const [confetti, setConfetti] = useState<boolean>(false);

  useEffect(() => {
    setConfetti(true);
  }, []);

  return (
    <div className="w-full mx-auto overflow-hidden">
      <MaxWidthWrapper>
        <div className="mx-auto pb-8 min-h-screen py-8 flex w-full flex-col justify-center items-center sm:w-md">
          <div className="mb-12 mt-10 text-stone-700 self-start">
            <Link href={"/"}>
              <X />
            </Link>
          </div>
          <Confetti active={confetti} config={confettiConfig} />
          <p className="text-center text-2xl font-semibold">Congratulations!</p>
          <div className="h-52 w-52 md:h-80 md:w-80 rounded-full my-7 md:my-10 bg-[radial-gradient(circle_closest-side,_var(--tw-gradient-stops))] from-[#84f17a] from-20% via-[#99EA92]/50 to-[#99EA92]/0 flex items-center justify-center">
            <Icons.success.tick />
          </div>
          <div className="mb-12 flex flex-col items-center">
            <h2 className="text-2xl md:text-3xl font-semibold">0 BTC</h2>
            <h2 className="font-semibold md:text-lg text-stone-600 my-4">$0</h2>
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

export default Page;
