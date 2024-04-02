"use client";

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Header from "@/components/send/Header";
import Payment from "@/components/send/Payment";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import { useState, useEffect, useMemo, Suspense } from "react";
import { getBalance } from "@/lib/ethereum/etherUtils";
import { toast } from "react-toastify";
import { useCoinPrice } from "@/context/PriceContext";

export default function Home() {
  const currencies = useMemo(
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
  var initialReceiver = searchParams.get("receiver");
  const [currency, setCurrency] = useState(initialCurrency);
  const [receiver, setReceiver]: any = useState(initialReceiver);
  const [receiverAddress, setReceiverAddress] = useState("");
  const [receiverImage, setReceiverImage] = useState("");
  const [isReview, setIsReview] = useState<boolean>(false);

  const [user, setUser]: any = useState();

  const coinPrice: any = useCoinPrice();

  const [myBalance, setMyBalance] = useState({
    bitcoin: 0,
    solana: 0,
    ethereum: 0,
    avalanche: 0,
    bsc: 0,
  });

  useEffect(() => {
    const _user = Cookies.get("user");

    if (_user) {
      setUser(JSON.parse(_user));
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

  useEffect(() => {
    if (!(currency in currencies)) {
      setCurrency("bitcoin");
      router.push("/buy");
    }
  }, [currency]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_API_URL + "/getAddress",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: receiver }),
        }
      );

      if (!response.ok) {
        throw response;
      }
      const responseData = await response.json();
      if (responseData.address) {
        setReceiverAddress(responseData.address);
        setReceiverImage(responseData.profileImage);
        return;
      } else {
        toast.error(responseData.message);
        router.push("/buy");
        return;
      }
    };

    fetchData();
  }, [receiver]);

  return (
    <main className="w-full h-screen overflow-hidden flex flex-col overflow-x-hidden">
      <div className="w-full">
        <MaxWidthWrapper>
          <div className="sm:w-md">
            <Header isReview={isReview} setIsReview={setIsReview} />
            <div className="flex items-center justify-center">
              <Avatar className="h-20 w-20">
                <AvatarImage src={receiverImage} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
          </div>
          <p className="text-center text-2xl font-semibold mt-5">{receiver}</p>
        </MaxWidthWrapper>
        <MaxWidthWrapper>
          <Suspense fallback={<div>Loading...</div>}>
            <Payment
              user={user}
              image={receiverImage}
              receiver={receiver}
              address={receiverAddress}
              balance={myBalance}
              price={coinPrice}
              currency={currency}
              isReview={isReview}
              setIsReview={setIsReview}
            />
          </Suspense>
        </MaxWidthWrapper>
      </div>
    </main>
  );
}
