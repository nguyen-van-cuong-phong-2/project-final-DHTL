'use client';
import { FaUserFriends } from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { RxVideo } from "react-icons/rx";
import { FaClockRotateLeft } from "react-icons/fa6";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { CiBookmark } from "react-icons/ci";
import { MdEventAvailable } from "react-icons/md";
import { IoLogoGameControllerB } from "react-icons/io";



interface LeftBody {
  data: {
    id: number,
    avatar: string,
    name: string,
  }
}
const LeftBody: React.FC<LeftBody> = ({ data }) => {
  const router = useRouter();
  return (
    <>
      <div className="w-1/5 h-screen mt-[75px] pl-5 box-border max-lg:hidden">
        <div className="flex gap-4 items-center mt-5  hover:bg-gray-300 p-2 box-border cursor-pointer rounded-md"
          onClick={() => router.push(`/Profile?id=${data.id}`)}
        >
          <div
            className="w-12 h-12 relative"
          ><Image
              className="border rounded-full box-border w-full h-full"
              src={data?.avatar ? data.avatar : "/images/user.png"}
              fill={true}
              objectFit="cover"
              quality={100}
              alt="avatar"
              onError={(e: any) => {
                e.target.onerror = null;
                e.target.setsrc = "/images/user.png";
              }}
            /></div>
          {" "}
          <span className="text-xl font-medium max-lg:text-sm">{data?.name}</span>
        </div>
        <div className="flex gap-4 items-center  mt-5 hover:bg-gray-300 p-2 box-border cursor-pointer rounded-md">
          <FaUserFriends className="w-[30px] h-8 text-blue-400"></FaUserFriends>
          <span className="text-base font-medium">Bạn bè</span>
        </div>
        <div className="flex gap-4 items-center  mt-5 hover:bg-gray-300 p-2 box-border cursor-pointer rounded-md"
          onClick={() => router.push('/Reels')}
        >
          <RxVideo className="w-[30px] h-8 text-red-400"></RxVideo>
          <span className="text-base font-medium">Reels</span>
        </div>
        <div className="flex gap-4 items-center  mt-5 hover:bg-gray-300 p-2 box-border cursor-pointer rounded-md"
        >
          <FaClockRotateLeft className="w-[30px] h-8 text-blue-400"></FaClockRotateLeft>
          <span className="text-base font-medium">Kỷ niệm</span>
        </div>

        <div className="flex gap-4 items-center  mt-5 hover:bg-gray-300 p-2 box-border cursor-pointer rounded-md"
        >
          <HiOutlineUserGroup className="w-[30px] h-8 text-blue-400"></HiOutlineUserGroup>
          <span className="text-base font-medium">Nhóm</span>
        </div>
        <div className="flex gap-4 items-center  mt-5 hover:bg-gray-300 p-2 box-border cursor-pointer rounded-md"
        >
          <CiBookmark className="w-[30px] h-8 text-purple-500"></CiBookmark>
          <span className="text-base font-medium">Đã lưu</span>
        </div>
        <div className="flex gap-4 items-center  mt-5 hover:bg-gray-300 p-2 box-border cursor-pointer rounded-md"
        >
          <MdEventAvailable className="w-[30px] h-8 text-red-500"></MdEventAvailable>
          <span className="text-base font-medium">Sự kiện</span>
        </div>
        <div className="flex gap-4 items-center  mt-5 hover:bg-gray-300 p-2 box-border cursor-pointer rounded-md"
        >
          <IoLogoGameControllerB className="w-[30px] h-8 text-blue-500"></IoLogoGameControllerB>
          <span className="text-base font-medium">Chơi game</span>
        </div>
      </div>
    </>
  );
}

export default LeftBody;