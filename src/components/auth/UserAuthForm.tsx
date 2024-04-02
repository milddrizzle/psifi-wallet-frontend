"use client";

import { cn } from "@/lib/utils";
import * as React from "react";
import { FC } from "react";
import { Button } from "./../ui/button";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Social } from "./social";
import { useForm } from "react-hook-form";
import { LoginSchema, LoginSchemaType } from "@/lib/validators/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Input } from "./../ui/input";
import { Icons } from "../Icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const UserAuthForm: FC<UserAuthFormProps> = ({ ...props }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const loginWithGoogle = async () => {
    setIsLoading(true);

    try {
      // await signIn('google')
    } catch (error) {
      toast.error("Error logging in with Google");
    } finally {
      setIsLoading(false);
    }
  };
  const onSubmit = async (data: LoginSchemaType) => {
    setIsLoading(true);

    data.username = "@" + data.username;

    await fetch(process.env.NEXT_PUBLIC_BACKEND_API_URL + "/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw response;
        }
        return response.json();
      })
      .then((data) => {
        // Set cookies
        Cookies.set(
          "user",
          JSON.stringify({
            username: data.username,
            profileImage: data.profileImage,
            address: data.address,
            encryptedSeed: data.encryptedSeed,
            salt: data.salt,
            iv: data.iv,
          }),
          { expires: 1 }
        );

        toast.success("Log in successful");
        router.push("/");
      })
      .catch((err) => {
        err.json().then((errm: { message: string }) => {
          setIsLoading(false);
          toast.error(errm.message);
        });
      });
  };
  return (
    <div {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <div className="">
            <div className="w-full flex items-start">
              <div className="h-12 flex bg-stone-200 items-center rounded-2xl rounded-r-none">
                <p className="mx-2">@</p>
              </div>
              <Input
                {...register("username")}
                className={cn("h-12 text-base rounded-l-none", {
                  "focus-visible:ring-red-500": errors.username,
                })}
                placeholder="Username"
              />
            </div>
            {errors?.username && (
              <p className="text-sm mt-1 font-sans text-start text-red-500">
                {errors.username.message}
              </p>
            )}
          </div>

          <div className="">
            <Input
              {...register("password")}
              type="password"
              className={cn("h-12 text-base px-5", {
                "focus-visible:ring-red-500": errors.password,
              })}
              placeholder="Password"
            />
            {errors?.password && (
              <p className="text-sm mt-1 font-sans text-start text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button className="h-16 mt-3" disabled={isLoading} type="submit">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Log in
          </Button>
        </div>
      </form>
      <div className="relative my-5">
        <div
          className="
                absolute 
                inset-0 
                flex 
                items-center
              "
        >
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-main-bg px-2 text-gray-500">
            Or continue with
          </span>
        </div>
      </div>
      <Social />
      <p className="text-center my-5">
        Don&apos;t have an account?{" "}
        <Link href={"/register"} className="text-[#48AC40] font-semibold">
          Register
        </Link>
      </p>
      <Icons.auth.faceid className="mx-auto" />
      <p className="text-center text-[0.5rem] mt-2">Face ID</p>
    </div>
  );
};

export default UserAuthForm;
