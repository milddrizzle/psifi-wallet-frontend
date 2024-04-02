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
import CopyToClipboard from "react-copy-to-clipboard";
import QRCode from "qrcode.react";
import { RiFileCopyLine } from "react-icons/ri";
let SlideButton: any = "";

interface DepositModalProps {
  address: string;
  currency: string;
}

const DepositModal: FC<DepositModalProps> = ({ address, currency }) => {
  // Initialize the drawer to be open by default
  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isClient, setIsClient] = useState(false);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const handleOpenChange = (value: boolean) => {
    setIsOpen(value);
  };

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
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
        <Button className="w-24 h-12 xs:h-16">Deposit</Button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay
          className="fixed inset-0 bg-black/15"
          style={{
            backdropFilter: "blur(1px)",
          }}
        />
        <Drawer.Content
          className="bg-white focus-visible:outline-none flex md:max-w-md mx-auto flex-col rounded-t-[50px] h-[100%] xs:h-[95%] mt-24 fixed bottom-0 left-0 right-0"
          style={{
            boxShadow: "0px -10px 100px 0px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div className="py-4 bg-transparent rounded-t-[10px] flex-1">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-400 mb-6" />
            <div className="md:max-w-md flex flex-col items-center mx-auto">
              <Tabs defaultValue="crypto" className="w-full px-5 md:px-10">
                <TabsList className="w-full h-12 rounded-full">
                  <TabsTrigger
                    value="crypto"
                    className="w-full h-full rounded-full text-black text-base"
                  >
                    Crypto
                  </TabsTrigger>
                  <TabsTrigger
                    value="fiat"
                    className="w-full h-full rounded-full text-black text-base"
                  >
                    Fiat
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="crypto">
                  <p className="w-full text-center my-5 text-stone-500">
                    Check your{" "}
                    <span className="text-strong-green">
                      {currency.charAt(0).toUpperCase() + currency.slice(1)}
                    </span>{" "}
                    address carefully!
                  </p>
                  <div className="flex w-full items-center">
                    <QRCode
                      className="flex-shrink-0 w-24 h-24 mr-2 xs:mr-4"
                      value={address}
                    />
                    <div className="flex-grow min-w-0">
                      <p className="text-base xs:text-ls my-1">Deposit to</p>
                      <span className="gap-2">
                        <p className="break-words text-base xs:text-ls font-semibold whitespace-normal">
                          {address}
                        </p>
                      </span>
                    </div>
                    <div className="flex flex-col flex-shrink-0 mt-4 items-center">
                      <CopyToClipboard text={address} onCopy={handleCopy}>
                        <button title="Copy">
                          <RiFileCopyLine className="text-strong-green h-6 w-6" />
                        </button>
                      </CopyToClipboard>
                      <p
                        className="text-xs text-strong-green"
                        style={{ visibility: copied ? "visible" : "hidden" }}
                      >
                        Copied
                      </p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="fiat">
                  Customize my Fiat page here.
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default DepositModal;
