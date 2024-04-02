"use client";

import { FC, InputHTMLAttributes, useState } from "react";
import { RegisterSchemaType } from "@/lib/validators/auth";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { FaRegEyeSlash, FaEye } from "react-icons/fa";
import { cn } from "@/lib/utils";

interface PasswrodInputProps extends InputHTMLAttributes<HTMLInputElement> {
  register: UseFormRegister<RegisterSchemaType>;
  label: keyof RegisterSchemaType;
  errors: FieldErrors<RegisterSchemaType>;
}

const PasswrodInput: FC<PasswrodInputProps> = ({
  errors,
  label,
  register,
  ...props
}) => {
  const [visible, setVisible] = useState<boolean>(false);
  return (
    <div
      className={cn(
        "h-12 text-base flex bg-white transition-all duration-300 rounded-2xl items-center",
        {
          "ring-red-500": errors[label],
        }
      )}
    >
      <input
        {...props}
        className="rounded-l-2xl bg-transparent w-full h-full px-5 py-2 flex border-0 focus:ring-0 focus:outline-0"
        {...register(label)}
        type={visible ? "text" : "password"}
      />
      {visible ? (
        <FaEye
          className="text-primary-green px-3"
          size={45}
          onClick={() => setVisible(false)}
        />
      ) : (
        <FaRegEyeSlash
          className="text-primary-green px-3"
          size={45}
          onClick={() => setVisible(true)}
        />
      )}
    </div>
  );
};

export default PasswrodInput;
