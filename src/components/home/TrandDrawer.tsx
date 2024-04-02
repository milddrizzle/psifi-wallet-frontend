"use client";

import { Drawer } from "vaul";
import { Button } from "../ui/button";
import Paragraph from "../ui/Paragraph";
import { Icons } from "../Icons";
import { useState } from "react";
import Link from "next/link";

export default function TrandDrawer() {
  // Initialize the drawer to be open by default
  const [isOpen, setIsOpen] = useState(true);

  const handleOpenChange = (value: boolean) => {
    setIsOpen(value);
  };

  return (
    <Drawer.Root
      open={isOpen}
      onOpenChange={handleOpenChange}
      fixed={false}
      snapPoints={[0.4]}
      closeThreshold={0.2}
    >
      <Drawer.Portal>
        <Drawer.Content
          className="bg-white/45 focus-visible:outline-none flex md:max-w-md mx-auto flex-col rounded-t-[50px] h-[85%] mt-24 fixed bottom-0 left-0 right-0"
          style={{
            backdropFilter: "blur(12px)",
            boxShadow: "0px -10px 20px 0px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div className="py-4 bg-transparent rounded-t-[10px] flex-1">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-400 mb-5" />
            <div className="max-w-md flex flex-col items-center mx-auto">
              <Drawer.Title className="font-medium text-2xl text-center mt-0 mb-4">
                Bitcoin is up <span className="text-strong-green">12%</span> 🔥
              </Drawer.Title>
              <Paragraph className="text-base sm:text-base">
                People are buying a lot of Bitcoin recently.
              </Paragraph>
              <Link href="/buy">
                <Button className="text-center my-4 gap-3 py-8 mx-auto border">
                  <Icons.currencies.bitcoin />
                  Buy Bitcoin
                </Button>
              </Link>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
