"use client";
import { FC, useState, useMemo, useEffect } from "react";
import { currencies } from "../home/Currencies";
import { IoWallet } from "react-icons/io5";
import { LuArrowUpDown } from "react-icons/lu";
import { Input } from "../ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import { sendEther, getBalance } from "@/lib/ethereum/etherUtils";
import { getPrivateKey } from "@/lib/addressUtils/userAccount";
let SlideButton: any = "";

interface PaymentProps {
  user: any;
  image: string;
  receiver: string;
  address: any;
  balance: any;
  price: any;
  currency: string;
  isReview: boolean;
  setIsReview: (isReview: boolean) => void;
}

const Payment: FC<PaymentProps> = ({
  user,
  image,
  receiver,
  address,
  balance,
  price,
  currency,
  isReview,
  setIsReview,
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const cryptos: any = useMemo(
    () => ({
      BTC: "bitcoin",
      SOL: "solana",
      ETH: "ethereum",
      BNB: "bsc",
      AVAX: "avalanche",
    }),
    []
  );
  var crypto = searchParams.get("currency") || currency;
  if (!Object.values(cryptos).includes(crypto)) {
    router.push("/send");
  }

  const [selectedCurrency, setSelectedCurrency]: any = useState(currencies[0]);
  const [inputValue, setInputValue]: any = useState("");
  const [coinValue, setCoinValue]: any = useState(0);
  const [willReceive, setWillReceive]: any = useState(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (isClient) {
    SlideButton = require("react-slide-button").default;
  }

  const handleSetFilter = (value: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("currency", cryptos[value]);

    router.push(`/send?${newSearchParams.toString()}`);
  };

  useEffect(() => {
    setCoinValue(inputValue / price[crypto] || 0);
  }, [inputValue]);

  useEffect(() => {
    setInputValue("");
  }, [crypto]);

  async function reviewAndSend() {
    setIsLoading(true);

    try {
      const { seed, privateKey } = await getPrivateKey(
        user.encryptedSeed,
        user.salt,
        user.iv,
        crypto
      );
      const res = sendEther(privateKey, address[crypto], coinValue, "review");
      res
        .then(async (res: any) => {
          if (!res.failed) {
            setWillReceive(Number(res.receive));
            setIsReview(true);
            setIsLoading(false);
          } else {
            if (res.min) {
              toast.error(
                "Minimum amount is $" +
                  Number((res.min * price[crypto]).toFixed(8)).toString()
              );
            } else {
              toast.error(res.message);
            }
            setIsLoading(false);
          }
        })
        .catch((err) => {
          toast.error("Invalid input");
          setIsLoading(false);
        });
    } catch {
      toast.error("Invalid input");
      setIsLoading(false);
    }
  }

  async function slideToSend() {
    setIsLoading(true);

    try {
      const { seed, privateKey } = await getPrivateKey(
        user.encryptedSeed,
        user.salt,
        user.iv,
        crypto
      );
      const res = sendEther(privateKey, address[crypto], coinValue, "send");
      res
        .then(async (res: any) => {
          if (!res.failed) {
            const transaction = {
              txHash: res.hash,
              sender: res.from.toLowerCase() || user.address,
              receiver: res.to.toLowerCase() || address[crypto],
              usdValue: inputValue,
              coinAmount: coinValue,
              coinUnit: Object.keys(cryptos).find(
                (key) => cryptos[key] === crypto
              ),
            };
            const response = await fetch(
              process.env.NEXT_PUBLIC_BACKEND_API_URL + "/recordMessage",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(transaction),
              }
            );

            if (!response.ok) {
              throw response;
            }

            toast.success("Transaction Successful");
            router.push(
              `/send/success?receiver=${receiver}&amount=${Number(
                coinValue.toFixed(8)
              ).toString()}&unit=${Object.keys(cryptos).find(
                (key) => cryptos[key] === crypto
              )}&usd=${inputValue}&image=${image}&hash=${res.hash}`
            );
            setIsLoading(false);
          } else {
            if (res.min) {
              toast.error(
                "Minimum amount is $" +
                  Number((res.min * price[crypto]).toFixed(8)).toString()
              );
            } else {
              toast.error(res.message);
            }
            setIsLoading(false);
          }
        })
        .catch((err) => {
          toast.error("Transaction failed");
          setIsLoading(false);
        });
    } catch {
      toast.error("Transaction failed");
      setIsLoading(false);
    }
  }

  return (
    <div className="mt-10">
      {!isReview && (
        <div>
          <div className="mb-10 w-full rounded-3xl flex flex-col items-center bg-white p-5 h-full">
            <div className="w-full">
              <div className="gap-3 items-center">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-stone-500 text-sm">
                      You pay
                    </p>
                    <div className="flex items-center">
                      <p className="text-3xl md:text-4xl text-stone-600 my-4 pr-1">
                        $
                      </p>
                      <Input
                        type="number"
                        maxLength={10}
                        className="px-0 rounded-none w-28 md:w-40 bg-transparent border-0 focus:border-b border-stone-300 text-3xl md:text-4xl text-stone-600"
                        placeholder="0"
                        value={inputValue}
                        onChange={(e) => {
                          if (
                            e.target.value.length <= 10 &&
                            Number(e.target.value) <=
                              balance[crypto] * price[crypto] &&
                            Number(e.target.value) >= 0
                          ) {
                            setInputValue(e.target.value);
                          }
                        }}
                      />
                    </div>
                  </div>
                  <Select
                    defaultValue={Object.keys(cryptos).find(
                      (key) => cryptos[key] === crypto
                    )}
                    onValueChange={(value) => {
                      const foundCurrency = currencies.find(
                        (currency) => currency.abbr === value
                      );
                      if (foundCurrency) {
                        setSelectedCurrency(foundCurrency);
                        handleSetFilter(value);
                      }
                    }}
                  >
                    <SelectTrigger className="w-[120px] h-14 rounded-3xl border-none focus:ring-0 focus:ring-offset-0 bg-muted px-3">
                      <SelectValue placeholder="Select a currency" />
                    </SelectTrigger>
                    <SelectContent className="rounded-3xl border-none bg-muted">
                      <SelectGroup>
                        {currencies.map((currency, i) => (
                          <SelectItem
                            key={i}
                            value={currency.abbr}
                            className="h-14 rounded-3xl cursor-pointer w-full"
                          >
                            <div className="flex items-center justify-between w-full">
                              <currency.icon className="w-6 h-6" />
                              <p className="text-base ml-2">{currency.abbr}</p>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-stone-500 text-xs flex items-center">
                    <span className="">
                      {Number(coinValue.toFixed(6)).toString()}{" "}
                      {Object.keys(cryptos).find(
                        (key) => cryptos[key] === crypto
                      )}
                    </span>
                    <LuArrowUpDown className="inline text-strong-green ml-1" />
                  </p>
                  <p className="text-stone-500 text-sm flex items-center">
                    <IoWallet className="inline mr-2" />
                    {Number(Number(balance[crypto]).toFixed(5)).toString()} ($
                    {(balance[crypto] * price[crypto]).toLocaleString()})
                    <span
                      className="text-strong-green ml-2 cursor-pointer"
                      onClick={() =>
                        setInputValue(balance[crypto] * price[crypto])
                      }
                    >
                      Send all
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <Button
            onClick={reviewAndSend}
            disabled={inputValue <= 0.00001 || isLoading}
            className="w-full h-16 px-10"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Review and send
          </Button>
        </div>
      )}
      {isReview && (
        <div>
          <div className="mb-10 w-full rounded-3xl flex flex-col bg-white p-5 xs:p-10 h-full">
            <div className="flex my-1 items-center justify-between">
              <p className="text-lg font-semibold text-stone-500">Balance:</p>
              <p className="text-lg font-semibold">
                ${(balance[crypto] * price[crypto]).toLocaleString()}
              </p>
            </div>{" "}
            <div className="flex my-1 items-center justify-between">
              <p className="text-lg font-semibold text-stone-500">You send:</p>
              <p className="text-lg font-semibold">
                ${Number((coinValue * price[crypto]).toLocaleString())}
              </p>
            </div>
            <div className="flex my-1 items-center justify-between">
              <p className="text-lg font-semibold text-stone-500">
                Recipient receives:
              </p>
              <p className="text-lg font-semibold">
                ${Number((willReceive * price[crypto]).toLocaleString())}
              </p>
            </div>
            <hr className="my-2" />
            <div className="flex my-1 items-center justify-between">
              <p className="text-lg font-semibold text-stone-500">
                New balance:
              </p>
              <p className="text-lg font-semibold">
                $
                {(
                  (balance[crypto] - coinValue) *
                  price[crypto]
                ).toLocaleString()}
              </p>
            </div>
          </div>
          <SlideButton
            mainText="Silde to send"
            Overlay={false}
            overlayClassList="rounded-full p-2 bg-opacity-50 bg-primary-green"
            classList="border border-strong-green bg-opacity-30 bg-primary-green w-full h-16 rounded-full text-strong-green"
            caretClassList="w-full rounded-full text-2xl bg-strong-green"
            caret={
              <p
                className="mb-1 cursor-pointer items-center flex justify-center h-full w-full"
                style={{ color: "white" }}
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : ">"}
              </p>
            }
            customCaretWidth={60}
            minSlideWidth={0.7}
            minSlideVelocity={1}
            onSlideDone={slideToSend}
          />
        </div>
      )}
    </div>
  );
};

export default Payment;
