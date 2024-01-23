import avatar from "../../../public/images/avatar.jpg";
import Image from "next/image";
import { useMyContext } from "../../context/context";
import { MdVideoCameraFront } from "react-icons/md";
import { IoIosImages } from "react-icons/io";
import { SlEmotsmile } from "react-icons/sl";

interface BettwenBody {
  data: {
    id: number,
    avatar: string,
    name: string,
  },
  SetPopUpPostNew: any
}

const PostNew: React.FC<BettwenBody> = ({ data, SetPopUpPostNew }) => {
  const name = data?.name.split(' ')[0]
  return (
    <div className="w-full flex justify-center ">
      <div className="w-[68%] bg-white flex p-3 items-center border rounded-xl mt-5  max-lg:w-full
      max-lg:mr-0 flex-wrap" onClick={() => SetPopUpPostNew(true)}>
        <div className="relative w-10 h-10">
          <Image
            className="border rounded-full box-border items-center w-full h-full"
            src={data?.avatar ? data.avatar : "/images/user.png"}
            fill
            objectFit="cover"
            quality={100}
            alt="avatar"
          />

        </div>{" "}
        <input
          placeholder={`${name} ơi, bạn đang nghĩ gì thế?`}
          className="w-[85%] h-10 ml-2 border rounded-3xl outline-none pl-5 bg-BGICon font-semibold text-black-800 py-4"
        />
        <div className="w-full flex border-t-[1px] mt-3 py-2 px-5 justify-between cursor-pointer max-md:px-0">
          <div className="flex gap-2 mt-2 justify-center items-center">
            <MdVideoCameraFront className="text-3xl text-red-600 max-md:text-2xl"></MdVideoCameraFront>
            <div className="text-base font-medium text-gray-500">Video trực tiếp</div>
          </div>
          <div className="flex gap-2 mt-2 justify-center items-center">
            <IoIosImages className="text-3xl max-md:text-2xl text-green-600"></IoIosImages>
            <div className="text-base font-medium text-gray-500">Ảnh/video</div>
          </div>
          <div className="flex gap-2 mt-2 justify-center items-center">
            <SlEmotsmile className="text-3xl text-yellow-500 max-md:text-2xl"></SlEmotsmile>
            <div className="text-base font-medium text-gray-500">Cảm xúc</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostNew;