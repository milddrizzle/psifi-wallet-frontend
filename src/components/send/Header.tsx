"use client";
import { FC } from "react";
import { FaAngleLeft } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface HeaderProps {
  isReview: boolean;
  setIsReview: (isReview: boolean) => void;
}

const Header: FC<HeaderProps> = ({ isReview, setIsReview }) => {
  const router = useRouter();
  const returnPage = () => {
    setIsReview(false);
  };

  return (
    <div className="flex my-14 justify-between">
      {isReview ? (
        <div
          onClick={returnPage}
          className="h-12 w-12 flex items-center justify-center text-stone-600 bg-white rounded-full cursor-pointer"
        >
          <FaAngleLeft className="h-6 w-6" />
        </div>
      ) : (
        <Link href={"/"}>
          <div className="h-12 w-12 flex items-center justify-center text-stone-600 bg-white rounded-full cursor-pointer">
            <FaAngleLeft className="h-6 w-6" />
          </div>
        </Link>
      )}
      <div className="rounded-full flex items-center gap-2 py-2 mr-12">
        <span className="text-lg font-semibold text-stone-700">Send to</span>
      </div>
      <div className=""></div>
    </div>
  );
};

export default Header;
