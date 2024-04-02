"use client";

import { ChangeEvent, FC, useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { RegisterSchema, RegisterSchemaType } from "@/lib/validators/auth";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { Social } from "../auth/social";
import { Label } from "../ui/label";
import { Icons } from "../Icons";
import Image from "next/image";
import PasswrodInput from "./PasswrodInput";
import { Checkbox } from "../ui/checkbox";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { pinFileToIPFS } from "../../lib/pinata/uploader";
import Cookies from "js-cookie";

interface RegisterFormProps {}

const RegisterForm: FC<RegisterFormProps> = ({}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<
    string | ArrayBuffer | null
  >(null);
  const router = useRouter();
  const [image, setImage] = useState<File | null>(null);
  const [isChecked, setIsChecked] = useState(false);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files![0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        setSelectedImage((e?.target?.result as string) || null);
      };

      reader.readAsDataURL(file);
      setImage(file);
    }
  };

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<RegisterSchemaType>({
    resolver: zodResolver(RegisterSchema),
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

  const onSubmit = async (data: RegisterSchemaType) => {
    setIsLoading(true);
    if (!selectedImage) {
      toast.error("Upload profile picture");
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
        body: JSON.stringify({ username: "@" + data.username }),
      }
    );

    if (!response.ok) {
      throw response;
    }
    const responseData = await response.json();
    if (responseData.existUser) {
      toast.error("Username already exists");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    var formData: { [key: string]: any } = {
      username: "@" + data.username,
      password: data.password,
    };

    const imgRes = await fetch(selectedImage as string);
    const blob = await imgRes.blob();
    const imageFile = new File([blob], "image.png", { type: blob.type });
    const imageLink = await pinFileToIPFS(imageFile);

    formData["profileImage"] = imageLink;

    await fetch(process.env.NEXT_PUBLIC_BACKEND_API_URL as string, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
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
        Cookies.set("welcome", JSON.stringify(true));

        toast.success("Sign up successful");
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
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="w-auto">
        <div className="grid gap-3">
          <div className="">
            <input
              type="file"
              title="hoo"
              id="profileImage"
              name="image"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
            <Label
              htmlFor="profileImage"
              className="flex space-y-2 mb-2 flex-col items-center cursor-pointer"
            >
              <div className="h-20 w-20 rounded-full overflow-hidden">
                {selectedImage ? (
                  <Image
                    alt="profile image"
                    src={selectedImage as string}
                    height={500}
                    width={500}
                    className="w-full h-full"
                  />
                ) : (
                  <Icons.avatar className="h-full w-full" />
                )}
              </div>
              <span className="text-stone-600">Upload profile picture</span>
            </Label>
          </div>
          <div className="w-full">
            <div className="w-full flex items-start">
              <div className="h-12 flex bg-stone-200 items-center rounded-2xl rounded-r-none">
                <p className="mx-2">@</p>
              </div>
              <Input
                {...register("username")}
                className={cn("h-12 text-base rounded-l-none")}
                placeholder="unique username"
              />
            </div>
            <div className="w-full">
              {errors?.username && (
                <p className="text-sm mt-1 font-sans text-start text-red-500">
                  {errors.username.message}
                </p>
              )}
            </div>
          </div>
          <div className="">
            <div className=""></div>
            <PasswrodInput
              register={register}
              errors={errors}
              label="password"
              placeholder="choose a password"
            />
            {errors?.password && (
              <p className="text-sm mt-1 font-sans text-start text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>
          <div className="">
            <div className=""></div>
            <PasswrodInput
              register={register}
              label="confirm"
              errors={errors}
              placeholder="confirm password"
            />
            {errors?.confirm && (
              <p className="text-sm mt-1 font-sans text-start text-red-500">
                {errors.confirm.message}
              </p>
            )}
          </div>
          <p className="text-gray-500 text-sm text-start font-sans">
            Password has to contain <span className="text-[#48AC40]">%$</span>
          </p>
          <div className="flex gap-1 items-center">
            <Checkbox
              className="border-[#5bc051] data-[state=checked]:bg-transparent data-[state=checked]:text-[#5bc051]"
              onClick={() => setIsChecked(!isChecked)}
            />
            <p className="text-black text-sm text-start font-sans">
              I agree to PsiFi&apos;s privacy policy and terms of service
            </p>
          </div>

          <Button
            className="h-16"
            disabled={isLoading || !isChecked || Object.keys(errors).length > 0}
            type="submit"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Account
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
      <p className="text-center mt-5">
        Already have account{" "}
        <Link href={"/login"} className="text-[#48AC40] font-semibold">
          Login?
        </Link>
      </p>
    </div>
  );
};

export default RegisterForm;
