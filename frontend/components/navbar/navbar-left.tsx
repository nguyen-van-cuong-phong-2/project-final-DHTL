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
import { MdVideoLibrary } from "react-icons/md";



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
      <div className="w-1/5 h-screen mt-[50px] pl-2 box-border max-lg:hidden">
        <div className="flex gap-2 items-center mt-5 py-2 hover:bg-gray-300 px-2 box-border cursor-pointer rounded-md"
          onClick={() => router.push(`/Profile?id=${data.id}`)}
        >
          <div
            className="w-9 h-9 relative"
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
          <span className="text-base font-medium max-lg:text-sm">{data?.name}</span>
        </div>
        <div className="flex gap-2 items-center py-2 mt-[12px] hover:bg-gray-300 px-2 box-border cursor-pointer rounded-md ml-1">
          <FaUserFriends className="w-[36px] h-8 text-blue-400"></FaUserFriends>
          <span className="text-base w-full h-full font-medium">Bạn bè</span>
        </div>
        <div className="flex gap-2 items-center py-2 mt-[12px] hover:bg-gray-300 px-2 box-border cursor-pointer rounded-md ml-1"
          onClick={() => router.push('/Reels')}
        >
          <MdVideoLibrary className="w-[36px] h-8 text-[#2795e2]"></MdVideoLibrary>
          <span className="text-base w-full h-full  font-medium">Reels</span>
        </div>
        <div className="flex gap-2 items-center py-2 mt-[12px] hover:bg-gray-300 px-2 box-border cursor-pointer rounded-md ml-1"
        >
          <FaClockRotateLeft className="w-[30px] h-8 text-blue-400 ml-1"></FaClockRotateLeft>
          <span className="text-base w-full h-full font-medium">Kỷ niệm</span>
        </div>

        <div className="flex gap-2 items-center py-2 mt-[12px] hover:bg-gray-300 px-2 box-border cursor-pointer rounded-md ml-1"
        >
          <HiOutlineUserGroup className="w-[36px] h-8 text-blue-400"></HiOutlineUserGroup>
          <span className="text-base w-full h-full font-medium">Nhóm</span>
        </div>
        <div className="flex gap-2 items-center py-2 mt-[12px] hover:bg-gray-300 px-2 box-border cursor-pointer rounded-md ml-1"
        >
          <CiBookmark className="w-[36px] h-8 text-purple-500"></CiBookmark>
          <span className="text-base w-full h-full font-medium">Đã lưu</span>
        </div>
        <div className="flex gap-2 items-center py-2 mt-[12px] hover:bg-gray-300 px-2 box-border cursor-pointer rounded-md ml-1"
        >
          <MdEventAvailable className="w-[36px] h-8 text-red-500"></MdEventAvailable>
          <span className="text-base w-full h-full font-medium">Sự kiện</span>
        </div>
        <div className="flex gap-2 items-center  mt-5 hover:bg-gray-300 px-2 box-border cursor-pointer rounded-md"
        >
          <IoLogoGameControllerB className="w-[36px] h-8 text-blue-500 ml-1"></IoLogoGameControllerB>
          <span className="text-base w-full h-full font-medium">Chơi game</span>
        </div>
      </div>
    </>
  );
}

export default LeftBody;