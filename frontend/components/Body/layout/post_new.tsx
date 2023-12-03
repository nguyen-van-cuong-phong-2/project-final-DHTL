import avatar from "../../../public/images/avatar.jpg";
import Image from "next/image";
export default function bettwenBody() {
  return (
    <>
      <div className="w-4/5 h-24 bg-white flex p-3 items-center border rounded-xl mt-5  max-lg:w-full
      max-lg:mr-0">
        <div className="flex items-center">
          <Image
            className="border rounded-full box-border items-center"
            src={avatar}
            width={50}
            height={40}
            objectFit="cover"
            quality={100}
            alt="avatar"
          />
        </div>{" "}
        <input
          placeholder="Cường ơi, bạn đang nghĩ gì thế?"
          className="flex-1 h-4/5 ml-2 border rounded-3xl outline-none pl-5 bg-BGICon font-semibold text-black-800"
        />
      </div>
    </>
  );
}
