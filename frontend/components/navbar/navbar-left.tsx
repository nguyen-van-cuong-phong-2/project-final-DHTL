import avatar from "@/public/images/avatar.jpg";
import { FaUserFriends } from "react-icons/fa";
import Image from "next/image";
export default function leftBody() {
  return (
    <>
      <div className="w-1/5 h-screen sticky top-[75px] pl-5 box-border">
        <div className="flex gap-4 items-center mt-5  hover:bg-gray-300 p-2 box-border cursor-pointer rounded-md">
          <Image
            className="border rounded-full box-border"
            src={avatar}
            width={40}
            height={30}
            objectFit="cover"
            quality={100}
            alt="avatar"
          />{" "}
          <span className="text-xl font-medium">Nguyễn Cường</span>
        </div>
        <div className="flex gap-4 items-center  mt-5 hover:bg-gray-300 p-2 box-border cursor-pointer rounded-md">
          <FaUserFriends className="w-[40px] h-8 text-blue-400"></FaUserFriends>
          <span className="text-xl font-medium">Bạn bè</span>
        </div>
      </div>
    </>
  );
}
