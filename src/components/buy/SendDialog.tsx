"use client";

import { FC, useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "react-toastify";
// @ts-ignore
import CreatableSelect from "react-select/creatable";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface SendDialogProps {
  currency: string;
  contacts: any[];
  self: string;
}

const SendDialog: FC<SendDialogProps> = ({ currency, contacts, self }) => {
  // Initialize the drawer to be open by default
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const options = contacts.map((contact) => ({
    value: contact,
    label: contact,
  }));
  const [selectedOption, setSelectedOption]: any = useState(null);

  return (
    <Dialog>
      <DialogTrigger className="w-full" asChild>
        <Button className="h-12 xs:h-16">
          Send
          <span className="xs:inline hidden mx-1">
            {currency.charAt(0).toUpperCase() + currency.slice(1)}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="md:max-w-md mx-auto h-[250px] p-0">
        <DialogHeader className="items-center mt-8">
          <DialogTitle className="text-2xl text-stone-500">
            Send to who?
          </DialogTitle>
        </DialogHeader>
        <div className="w-full items-center px-12 mb-4">
          <form
            onSubmit={async (event) => {
              setIsLoading(true);
              event.preventDefault();
              if (!selectedOption) {
                toast.error("Enter a username");
                setIsLoading(false);
                return;
              }
              const receiver = selectedOption.value;
              if (receiver === self) {
                toast.error("Invalid username");
                setIsLoading(false);
                return;
              }
              const response = await fetch(
                process.env.NEXT_PUBLIC_BACKEND_API_URL + "/checkExistUser",
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
              if (responseData.existUser) {
                router.push(`/send?currency=${currency}&receiver=${receiver}`);
                return;
              } else {
                toast.error("Invalid username");
                setIsLoading(false);
                return;
              }
            }}
          >
            <CreatableSelect
              id="name"
              options={options}
              className="w-full text-2xl text-center h-16"
              placeholder="@receiver"
              isClearable
              onChange={setSelectedOption}
              value={selectedOption}
            />
            <div className="w-full px-14 xs:px-20 mt-2">
              <Button
                className="w-full h-12 justify-center items-center"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Next
              </Button>
            </div>
            <input type="submit" style={{ display: "none" }} />
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SendDialog;
