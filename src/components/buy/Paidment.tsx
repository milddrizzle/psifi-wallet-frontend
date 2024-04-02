"use client";
import { FC } from "react";
import { useMemo } from "react";
import { Icons } from "../Icons";

interface PaidmentProps {
  currency: string;
}

const Paidment: FC<PaidmentProps> = ({ currency }) => {
  const currencies: any = useMemo(
    () => ({
      bitcoin: "BTC",
      solana: "SOL",
      ethereum: "ETH",
      bsc: "BNB",
      avalanche: "AVAX",
    }),
    []
  );

  const CurrencyIcon =
    Icons.currencies[currency as keyof typeof Icons.currencies];

  return (
    <div className="mt-1 mb-5 w-full rounded-3xl flex flex-col items-center bg-muted p-5 h-full">
      <div className="w-full">
        <div className="gap-3 items-center">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-stone-500 text-sm">You get</p>
              <div className="flex items-center">
                <p className="text-3xl md:text-4xl text-stone-600 my-1 pr-1">
                  0
                </p>
              </div>
            </div>
            <div className="flex w-[100px] h-14 rounded-3xl px-3 items-center border">
              <div className="flex items-center justify-between w-full">
                <CurrencyIcon className="w-6 h-6" />
                <p className="text-base my-1 p-1">{currencies[currency]}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Paidment;
