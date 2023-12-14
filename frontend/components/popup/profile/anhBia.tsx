import Image from "next/image"
import { IoCamera } from "react-icons/io5";

export default function AnhBia() {
    return (
        <>
            <div className=" w-full flex justify-center items-center">
                <div className="w-[70%] h-[400px] max-sm:h-[200px] max-md:h-[250px] max-lg:h-[300px] max-xl:w-full absolute top-[75px]">
                    <Image
                        alt="anhbia"
                        className="border rounded-b-xl"
                        src="/images/bia.jpg"
                        fill={true}
                        objectFit="cover"
                        quality={100}
                    ></Image>
                    <div className="absolute right-4 bottom-2 px-4 cursor-pointer hover:bg-slate-50 py-1 border-none z-0 text-white rounded-full bg-slate-600 opacity-80 flex gap-2">
                        <IoCamera className="w-7 h-7 cursor-pointer"></IoCamera>
                        <div>Chỉnh sửa ảnh bìa</div>
                    </div>
                    <input type="file" className="opacity-0 z-50 w-80 h-20 absolute bottom-0 right-0 cursor-pointer"></input>
                </div>
            </div>
        </>
    )
}