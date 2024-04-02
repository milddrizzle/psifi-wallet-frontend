"use client";

import { FC, useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { FaSignOutAlt } from "react-icons/fa";
import { toast } from "react-toastify";

import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

interface HeaderProps {}

const Header: FC<HeaderProps> = ({}) => {
  const [profileImage, setProfileImage] = useState("");
  const [username, setName] = useState("");
  const router = useRouter();
  useEffect(() => {
    const user = Cookies.get("user");
    if (user) {
      setProfileImage(JSON.parse(user).profileImage || "");
      setName(JSON.parse(user).username || "");
    }
  }, []);
  const onLogout = async () => {
    Cookies.remove("user");
    toast.success("Log out successful");
    router.push("/login");
  };
  return (
    <div className="flex my-14 items-center justify-between">
      <div className="flex gap-5 items-center">
        <Avatar className="h-16 w-16">
          <AvatarImage src={profileImage} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-base text-stone-500">Hi 👋🏼</p>
          <h3 className="text-2xl text-neutral-600 font-medium">{username}</h3>
        </div>
      </div>
      <div
        title="Log out"
        className="h-12 w-12 bg-white rounded-full flex items-center justify-center cursor-pointer"
        onClick={onLogout}
      >
        <FaSignOutAlt color="#5D5D5D" size={25} />
      </div>
    </div>
  );
};

export default Header;
