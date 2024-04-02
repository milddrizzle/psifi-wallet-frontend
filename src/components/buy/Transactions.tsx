"use client";

import { FC, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Icons } from "../Icons";
import { set } from "zod";

interface TransactionsProps {
  address: string;
  coin: string;
  currency: string;
}

const Transactions: FC<TransactionsProps> = ({ address, coin, currency }) => {
  const searchParams = useSearchParams();
  var activity = searchParams.get("activity") || "all";
  const router = useRouter();

  const handleTransactionClick = (receiver: string) => {
    router.push(
      `/send?currency=${currency.toLowerCase()}&receiver=${receiver}`
    );
  };

  const [transactions, setTransactions]: [{}[], any] = useState([]);
  const [trades, setTrades]: [{}[], any] = useState([]);
  const [activities, setActivities]: [{}[], any] = useState([]);

  async function getTransactions(address: string, coin: string) {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_API_URL + "/getMessage",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ address: address, coin: coin }),
        }
      );

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();

      if (data.messages.length > 0) {
        const newTransactions: {}[] = [];
        data.messages.forEach((message: any) => {
          newTransactions.push({
            time: message.date,
            abbr:
              message.status === "Received"
                ? "From " + message.sender
                : "To " + message.receiver,
            shortcut:
              message.status === "Received" ? message.sender : message.receiver,
            icon: (Icons.transactions as any)[message.status.toLowerCase()],
            sign:
              message.status === "Received" ? (
                <p className="text-lime-500 font-bold">+</p>
              ) : (
                <p className="text-orange-600 font-bold">-</p>
              ),
            amount: message.usdValue,
            nbr: message.coinAmount,
            unit: message.coinUnit,
          });
        });
        setTransactions(newTransactions);
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    getTransactions(address, coin);
  }, [address, coin]);

  useEffect(() => {
    setActivities([...transactions, ...trades]);
  }, [transactions, trades]);

  return (
    <div className="w-full grid grid-cols-1 gap-1 max-h-[19rem] overflow-auto">
      {(activity === "all"
        ? activities
        : activity === "transactions"
        ? transactions
        : trades
      ).length === 0 ? (
        <p className="pl-4 text-stone-400">No activities found</p>
      ) : (
        (activity === "all"
          ? activities
          : activity === "transactions"
          ? transactions
          : trades
        ).map((transaction: any, i) => (
          <div
            key={i}
            className="flex transition-colors duration-300 hover:bg-stone-150 cursor-pointer border hover:border-slate-200 bg-white p-5 rounded-3xl items-center justify-between"
            onClick={() => handleTransactionClick(transaction.shortcut)}
          >
            <div className="flex gap-3 items-center">
              <span className="xs:inline hidden">
                {transaction.icon ? <transaction.icon /> : ""}
              </span>
              <div>
                <p className="font-semibold text-md xs:text-lg">
                  {transaction.abbr}
                </p>
                <p className="text-stone-400 text-md xs:text-lg">
                  {transaction.time}
                </p>
              </div>
            </div>
            <div>
              <span className="flex itmes-center uppercase justify-end text-md xs:text-lg">
                {transaction.sign}
                <p className="font-semibold ml-1">
                  {"$"}
                  {transaction.amount.toLocaleString()}
                </p>
              </span>
              <span className="flex items-center text-stone-400 text-right justify-end text-md xs:text-lg">
                {transaction.nbr.toLocaleString()} {transaction.unit}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Transactions;
