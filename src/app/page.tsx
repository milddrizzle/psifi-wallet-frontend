"use client";

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Currencies from "@/components/home/Currencies";
import Header from "@/components/home/Header";
import Paragraph from "@/components/ui/Paragraph";
import Graph from "@/components/Graph";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { getBalance } from "@/lib/ethereum/etherUtils";
import Confetti from "react-dom-confetti";
import { useCoinPrice } from "@/context/PriceContext";

export default function Home() {
  const [user, setUser]: any = useState();

  const coinPrice: any = useCoinPrice();

  const [myBalance, setMyBalance]: any = useState({
    bitcoin: 0,
    solana: 0,
    ethereum: 0,
    avalanche: 0,
    bsc: 0,
  });

  const [totalBalance, setTotalBalance] = useState(0);

  function calculateTotalBalance(
    coinPrice: { [key: string]: number },
    myBalance: { [key: string]: number }
  ): number {
    let totalBalance = 0;
    for (const coin in myBalance) {
      totalBalance += coinPrice[coin] * myBalance[coin];
    }
    return totalBalance;
  }

  const confettiConfig = {
    angle: 90,
    spread: 360,
    startVelocity: 35,
    elementCount: 250,
    dragFriction: 0.12,
    duration: 4000,
    stagger: 5,
    width: "10px",
    height: "15px",
    perspective: "500px",
    colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"],
  };
  const [confetti, setConfetti] = useState<boolean>(false);

  useEffect(() => {
    setTotalBalance(calculateTotalBalance(coinPrice, myBalance));
  }, [coinPrice, myBalance]);

  useEffect(() => {
    const _user = Cookies.get("user");
    const _welcome = Cookies.get("welcome");

    if (_user) {
      setUser(JSON.parse(_user));
    }
    if (_welcome) {
      setConfetti(true);
      Cookies.remove("welcome");
    }
  }, []);

  useEffect(() => {
    if (user) {
      getBalance(user.address.ethereum).then((balance) => {
        // @ts-ignore
        setMyBalance((prevBalance) => ({ ...prevBalance, ethereum: balance }));
      });
    }
  }, [user]);

  return (
    <main className="w-full h-screen overflow-hidden flex flex-col overflow-x-hidden">
      <div className="w-full overflow-y-scroll">
        <MaxWidthWrapper>
          <Header />
          <div className="w-full flex justify-center items-center">
            <Confetti active={confetti} config={confettiConfig} />
          </div>
          <span>
            <h3 className="text-xl my-2 text-neutral-500">Current balance</h3>
            <Paragraph size={"lg"} className="flex items-center text-black">
              {"$"}
              {totalBalance.toLocaleString().split(".")[0]}
              {"."}
              <span className="text-stone-400">
                {totalBalance.toLocaleString().split(".")[1] || "0"}
              </span>
              <span className="text-sm sm:text-base text-strong-green ml-2">
                +0%
              </span>
            </Paragraph>
          </span>
        </MaxWidthWrapper>
        <MaxWidthWrapper className="px-0 md:px-5">
          <div className="mt-10 mb-8 w-full flex flex-col items-center bg-gradient-to-b from-white from-5% to-main-bg p-5 h-full rounded-t-[50px]">
            <div className="w-full">
              <Graph
                type={"area"}
                series={[
                  {
                    data: [
                      [1327359600000, 30.95],
                      [1358290800000, 37.88],
                    ],
                  },
                ]}
              >
                {" "}
              </Graph>
            </div>
            <Currencies balance={myBalance} price={coinPrice} />
          </div>
        </MaxWidthWrapper>
      </div>
      <div className="absolute flex px-5 md:px-10 gap-5 items-center bg-gray-100 bottom-0 left-0 w-full h-12"></div>
    </main>
  );
}
