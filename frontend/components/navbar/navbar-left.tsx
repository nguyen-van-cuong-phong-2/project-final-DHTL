import avatar from "../../public/images/avatar.jpg";
import { FaUserFriends } from "react-icons/fa";
import Image from "next/image";
import { useMyContext } from "../context/context";
import { functions } from "../../functions/functions";
import { callApi_getInforUser } from "../../api/callAPI";

export default function LeftBody() {
  const { user, SetUser } = useMyContext();
  return (
    <>
      <div className="w-1/5 h-screen sticky top-[75px] pl-5 box-border max-lg:hidden">
        <div className="flex gap-4 items-center mt-5  hover:bg-gray-300 p-2 box-border cursor-pointer rounded-md">
          <div
            className="w-12 h-12"
          ><Image
            className="border rounded-full box-border w-full h-full"
            src={user?.avatar ? user.avatar : "/images/user.png"}
            width={40}
            height={20}
            objectFit="contain"
            quality={100}
            alt="avatar"
            onError={(e) => {
              e.target.onerror = null;
              e.target.setsrc = "/images/user.png";
            }}
          /></div>
          {" "}
          <span className="text-xl font-medium">{user?.name}</span>
        </div>
        <div className="flex gap-4 items-center  mt-5 hover:bg-gray-300 p-2 box-border cursor-pointer rounded-md">
          <FaUserFriends className="w-[40px] h-8 text-blue-400"></FaUserFriends>
          <span className="text-xl font-medium">Bạn bè</span>
        </div>
      </div>
    </>
  );
}
