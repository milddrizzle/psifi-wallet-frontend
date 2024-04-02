"use client";

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Paragraph from "@/components/ui/Paragraph";
import Graph from "@/components/Graph";
import Header from "@/components/buy/Header";
import Category from "@/components/buy/Category";
import { Suspense, useState, useEffect, useMemo } from "react";
import Transactions from "@/components/buy/Transactions";
import BillModal from "@/components/buy/BillModal";
import DepositModal from "@/components/buy/DepositModal";
import { useRouter, useSearchParams } from "next/navigation";
import { getBalance } from "@/lib/ethereum/etherUtils";
import Cookies from "js-cookie";
import SendDialog from "@/components/buy/SendDialog";
import { useCoinPrice } from "@/context/PriceContext";

export default function Home() {
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

  const router = useRouter();
  const searchParams = useSearchParams();
  var initialCurrency = searchParams.get("currency") || "bitcoin";
  const [currency, setCurrency] = useState(initialCurrency);

  const [user, setUser]: any = useState();
  const [address, setAddress] = useState("");

  const coinPrice: any = useCoinPrice();

  const [myBalance, setMyBalance]: any = useState({
    bitcoin: 0,
    solana: 0,
    ethereum: 0,
    avalanche: 0,
    bsc: 0,
  });

  const [contacts, setContacts] = useState([]);

  async function getContactList(address: {}) {
    const addresses = Object.values(address).map((add) =>
      (add as string).toLowerCase()
    );
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_API_URL + "/getContactList",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ addresses: addresses }),
        }
      );

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();

      if (data.contacts.length > 0) {
        setContacts(data.contacts);
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    const _user = Cookies.get("user");

    if (_user) {
      setUser(JSON.parse(_user));
      getContactList(JSON.parse(_user).address);
    }
  }, []);

  useEffect(() => {
    if (user) {
      getBalance(user.address.ethereum).then((balance) => {
        // @ts-ignore
        setMyBalance((prevBalance) => ({ ...prevBalance, ethereum: balance }));
      });
      setAddress(user.address[currency]);
    }
  }, [user, currency]);

  useEffect(() => {
    if (!(currency in currencies)) {
      setCurrency("bitcoin");
      router.push("/buy");
    }
  }, [currency]);

  return (
    <main className="w-full h-screen overflow-hidden flex flex-col overflow-x-hidden">
      <div className="w-full overflow-y-scroll">
        <MaxWidthWrapper>
          <Header
            currency={currency}
            balance={myBalance[currency] * coinPrice[currency]}
          />
          <div className="flex w-full justify-between items-center">
            <span>
              <h3 className="text-xl my-2 text-neutral-500">Current balance</h3>
              <Paragraph size={"lg"} className="flex items-center text-black">
                {"$"}
                {
                  (myBalance[currency] * coinPrice[currency])
                    .toLocaleString()
                    .split(".")[0]
                }
                {"."}
                <span className="text-stone-400">
                  {(myBalance[currency] * coinPrice[currency])
                    .toLocaleString()
                    .split(".")[1] || "0"}
                </span>
                <span className="text-sm sm:text-base text-strong-green ml-2">
                  +0%
                </span>
              </Paragraph>
              <h4 className="text-sm my-2 text-neutral-500">
                {myBalance[currency].toLocaleString().substring(0, 8)}{" "}
                {currencies[currency]}
              </h4>
            </span>
            <DepositModal
              address={user?.address[currency]}
              currency={currency}
            />
          </div>
        </MaxWidthWrapper>
        <MaxWidthWrapper className="px-0 md:px-5">
          <div className="mt-10 mb-10 xs:mb-24 w-full flex flex-col items-center bg-gradient-to-b from-white from-5% to-main-bg p-5  h-full rounded-t-[50px]">
            <div className="w-full">
              <Graph
                type={"line"}
                series={[
                  {
                    data: [
                      [1, 25],
                      [2, 29],
                      [3, 10],
                      [4, 32],
                      [5, 20],
                      [6, 40],
                      [7, 30],
                      [8, 50],
                      [9, 70],
                      [10, 60],
                    ],
                  },
                ]}
              >
                <h3 className="text-sm my-2 text-neutral-500">
                  {currencies[currency]} price
                </h3>
                <Paragraph
                  size={"default"}
                  className="flex items-center text-black"
                >
                  {"$"}
                  {coinPrice[currency].toLocaleString()}
                  <span className="text-xs sm:text-xs text-strong-green ml-2">
                    +0%
                  </span>
                </Paragraph>
              </Graph>
            </div>
            <Suspense>
              <Category />
            </Suspense>
            <Transactions
              address={address}
              coin={currencies[currency]}
              currency={currency}
            />
          </div>
        </MaxWidthWrapper>
      </div>
      <div className="absolute bottom-20 bg-gradient-to-t from-black/10 to-transparent w-full h-[5rem] xs:h-28 pointer-events-none"></div>
      <div className="absolute flex px-5 md:px-10 gap-5 items-center bg-gray-100 bottom-0 left-0 w-full h-[5rem] xs:h-28">
        <SendDialog
          currency={currency}
          contacts={contacts}
          self={
            // @ts-ignore
            user?.username
          }
        />
        <BillModal currency={currency} />
      </div>
    </main>
  );
}
