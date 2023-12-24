'use client';
import { FaUserFriends } from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/navigation";



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
          <FaUserFriends className="w-[40px] h-8 text-blue-400"></FaUserFriends>
          <span className="text-xl font-medium">Bạn bè</span>
        </div>
      </div>
    </>
  );
}

export default LeftBody;