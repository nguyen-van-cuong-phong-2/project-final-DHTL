import avatar from "../../../public/images/avatar.jpg";
import Image from "next/image";
import { useMyContext } from "../../context/context";
export default function BettwenBody() {
  const { user } = useMyContext();
  const name = user?.name.split(' ')[0]
  return (
    <>
      <div className="w-4/5 h-24 bg-white flex p-3 items-center border rounded-xl mt-5  max-lg:w-full
      max-lg:mr-0">
        <div className="flex items-center w-10 h-10">
          <Image
            className="border rounded-full box-border items-center w-full h-full"
            src={user?.avatar ? user.avatar : "/images/user.png"}
            width={50}
            height={40}
            objectFit="cover"
            quality={100}
            alt="avatar"
          />
        </div>{" "}
        <input
          placeholder={`${name} ơi, bạn đang nghĩ gì thế?`}
          className="flex-1 h-4/5 ml-2 border rounded-3xl outline-none pl-5 bg-BGICon font-semibold text-black-800 py-4"
        />
      </div>
    </>
  );
}
