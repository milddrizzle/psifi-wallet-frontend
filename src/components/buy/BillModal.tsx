"use client";

import { Drawer } from "vaul";
import { FC } from "react";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Payment from "@/components/buy/Payment";
import Paidment from "@/components/buy/Paidment";
let SlideButton: any = "";

interface BillModalProps {
  currency: string;
}

const BillModal: FC<BillModalProps> = ({ currency }) => {
  // Initialize the drawer to be open by default
  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  const handleOpenChange = (value: boolean) => {
    setIsOpen(value);
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (isClient) {
    SlideButton = require("react-slide-button").default;
  }

  return (
    <Drawer.Root
      onOpenChange={handleOpenChange}
      fixed={false}
      snapPoints={[0.4]}
      closeThreshold={0.2}
    >
      <Drawer.Trigger asChild className="w-full">
        <Button className="w-full h-12 xs:h-16">
          Buy
          <span className="xs:inline hidden mx-1">
            {currency.charAt(0).toUpperCase() + currency.slice(1)}
          </span>
        </Button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay
          className="fixed inset-0 bg-black/15"
          style={{
            backdropFilter: "blur(1px)",
          }}
        />
        <Drawer.Content
          className="bg-white focus-visible:outline-none flex md:max-w-md mx-auto flex-col rounded-t-[50px] h-[125%] ls:h-[110%] xl:h-[120%] mt-24 fixed bottom-0 left-0 right-0"
          style={{
            boxShadow: "0px -10px 100px 0px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div className="py-4 bg-transparent rounded-t-[10px] flex-1">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-400 mb-6" />
            <div className="md:max-w-md flex flex-col items-center mx-auto">
              <Tabs defaultValue="buy" className="w-full px-5 md:px-10">
                <TabsList className="w-full h-12 rounded-full">
                  <TabsTrigger
                    value="buy"
                    className="w-full h-full rounded-full text-black text-base"
                  >
                    Buy
                  </TabsTrigger>
                  <TabsTrigger
                    value="sell"
                    className="w-full h-full rounded-full text-black text-base"
                  >
                    Sell
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="buy">
                  <Payment />
                  <Paidment currency={currency} />
                  <div className="flex w-full my-2">
                    <p className="text-base w-full">Total:</p>
                    <p className="text-base font-semibold">$0</p>
                  </div>
                  <div className="flex w-full my-2">
                    <p className="text-base w-full">Fee:</p>
                    <p className="text-base font-semibold">$0</p>
                  </div>
                  <div className="flex w-full my-2 mb-5">
                    <p className="text-base w-full">Net amount:</p>
                    <p className="text-base font-semibold">$0</p>
                  </div>
                  <SlideButton
                    mainText="Silde to buy"
                    Overlay={false}
                    overlayClassList="rounded-full p-2 bg-opacity-50 bg-primary-green"
                    classList="border border-strong-green bg-opacity-30 bg-primary-green w-full h-16 rounded-full text-strong-green"
                    caretClassList="w-full rounded-full text-2xl bg-strong-green"
                    caret={
                      <p
                        className="mb-1 cursor-pointer items-center flex justify-center h-full w-full"
                        style={{ color: "white" }}
                      >
                        {isLoading ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          ">"
                        )}
                      </p>
                    }
                    customCaretWidth={60}
                    minSlideWidth={0.7}
                    minSlideVelocity={1}
                    onSlideDone={() => {
                      setIsLoading(true);
                      router.push("/buy/success/");
                      setIsLoading(false);
                    }}
                  />
                </TabsContent>
                <TabsContent value="sell">
                  Customize my sell page here.
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default BillModal;
