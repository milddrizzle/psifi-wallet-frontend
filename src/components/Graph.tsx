"use client";
import React, { useState } from "react";
import { options } from "./GraphProperties";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});
const Graph = ({
  series,
  type,
  children,
}: {
  series: { data: [number, number][] }[];
  type: "line" | "area";
  children: any;
}) => {
  const [active, setActive] = useState<number>(0);
  if (options.fill) options.fill.type = type === "area" ? "gradient" : "solid";
  return (
    <div className="flex w-full flex-col relative">
      <div className="absolute top-0 left-0 p-2">{children}</div>
      <div className="w-full sm:p-4 min-h-[100px]">
        <ReactApexChart
          width={"100%"}
          options={options}
          series={series}
          type={type}
          height={200}
        />
      </div>
      <div className="flex cursor-pointer w-full mb-8 text-zinc-600 items-center justify-between gap-1 sm:gap-3 px-2">
        {(["1H", "1D", "1W", "1M", "1Y"] as const).map((e, i) => (
          <span
            className={cn(
              "text-stone-600 text-xs sm:text-sm px-4 sm:px-5 py-1",
              {
                "bg-primary-green rounded-full": active === i,
              }
            )}
            key={i}
            onClick={() => setActive(i)}
          >
            {e}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Graph;
