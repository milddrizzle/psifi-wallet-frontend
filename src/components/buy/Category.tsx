"use client";

import { useRouter, useSearchParams } from "next/navigation";

const Category = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activities = ["All", "Trades", "Transactions"];
  const init_activities = ["all", "trades", "transactions"];
  var activity = searchParams.get("activity") || "all";
  if (!init_activities.includes(activity)) {
    router.push("/buy");
  }

  const handleSetFilter = (value: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("activity", value);

    router.push(`/buy?${newSearchParams.toString()}`);
  };

  return (
    <div className="flex cursor-pointer w-full my-4 text-zinc-600 items-center justify-start gap-1 sm:gap-3 pl-4">
      {activities.map((activity, i) => (
        <div
          key={i}
          className={"text-neutral-500 text-base sm:text-xl pr-2 sm:pr-4 py-1"}
          onClick={() => handleSetFilter(activity.toLowerCase())}
        >
          <span
            className={`${
              (searchParams.get("activity") || "all") === activity.toLowerCase()
                ? "border-b-2 border-primary-green"
                : ""
            }`}
          >
            {activity}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Category;
