import avatar from "@/public/images/avatar.jpg";
import Image from "next/image";
export default function leftBody() {
  return (
    <>
      <div className="w-1/5 h-screen fixed bg-fuchsia-500">
        <div className="flex gap-2 items-center mt-5 ml-2">
        <Image
            className="border rounded-full box-border"
            src={avatar}
            width={30}
            height={20}
            objectFit="cover"
            quality={100}
            alt="avatar"
          /> <p className="text-xl font-medium">Nguyễn Cường</p>
        </div>
      </div>
    </>
  );
}
