"use client";
import { FC, useState } from "react";
import { cashes } from "./Cashes";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaymentProps {}

const Payment: FC<PaymentProps> = ({}) => {
  const [selectedCash, setSelectedCash] = useState(cashes[0]);

  return (
    <div className="mt-6 w-full rounded-3xl flex flex-col items-center bg-muted p-5 h-full">
      <div className="w-full">
        <div className="gap-3 items-center">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-stone-500 text-sm">You pay</p>
              <div className="flex items-center">
                <p className="w-6 text-3xl md:text-4xl text-stone-600 my-1">
                  {selectedCash.unit}
                </p>
                <Input
                  className="px-0 rounded-none w-28 md:w-40 border-0 bg-transparent focus:border-b border-stone-300 text-3xl md:text-4xl text-stone-600"
                  placeholder="0"
                />
              </div>
            </div>
            <Select
              defaultValue="USD"
              onValueChange={(value) => {
                const foundCash = cashes.find((cash) => cash.abbr === value);
                if (foundCash) {
                  setSelectedCash(foundCash);
                }
              }}
            >
              <SelectTrigger className="w-[120px] h-14 rounded-3xl border-none focus:ring-0 focus:ring-offset-0 bg-white px-3">
                <SelectValue placeholder="Select a cash" />
              </SelectTrigger>
              <SelectContent className="rounded-3xl border-none bg-white">
                <SelectGroup>
                  {cashes.map((cash, i) => (
                    <SelectItem
                      key={i}
                      value={cash.abbr}
                      className="h-14 rounded-3xl cursor-pointer w-full"
                    >
                      <div className="flex items-center justify-between w-full">
                        <cash.icon className="w-6 h-6" />
                        <p className="text-base ml-2">{cash.abbr}</p>
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
