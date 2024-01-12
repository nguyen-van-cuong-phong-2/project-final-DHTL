'use client';
import Image from "next/image"
import { IoCamera } from "react-icons/io5";
import { callApi_UploadFileCoverImage } from "../../api/callAPI";
import { useMyContext } from "../context/context";
import { useState } from "react";
import Body from "./body";
interface AnhBia {
    data: {
        id: number,
        avatar: string,
        name: string,
        coverImage: string,
        totalFriend: number,
        makefriend: number
    };
    check: boolean
}

const AnhBia: React.FC<AnhBia> = ({ data, check }) => {
    const { SetContentNotifi } = useMyContext();
    const [avatar, SetAvatar] = useState(data.coverImage);

    const handleChangeFile = async (e: any) => {
        const file = e.target.files[0];
        const response = await callApi_UploadFileCoverImage({ file: file })
        if (response.result == true) {
            SetContentNotifi("Cập nhật ảnh bìa thành công")
        }
        if (file) {
            const reader: any = new FileReader();
            reader.onload = () => {
                SetAvatar(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    return (
        <>
            <div className=" w-full flex justify-center items-center">
                <div className="w-[70%] h-[400px] max-sm:h-[200px] max-md:h-[250px] max-lg:h-[300px] max-xl:w-full relative mt-[75px]">
                    <Image
                        alt="anhbia"
                        className="border rounded-b-xl"
                        src={avatar ? avatar : '/images/anhbia.jpg'}
                        fill={true}
                        objectFit="cover"
                        quality={100}
                        onError={(e: any) => {
                            e.target.onerror = null;
                            e.target.setsrc = "/images/anhbia.jpg";
                        }}
                    ></Image>
                    {check && <div className="absolute right-4 bottom-2 px-4 cursor-pointer hover:bg-slate-50 py-1 border-none z-0 text-white rounded-full bg-slate-600 opacity-80 flex gap-2">
                        <IoCamera className="w-7 h-7 cursor-pointer"></IoCamera>
                        <div>Chỉnh sửa ảnh bìa</div>
                    </div>}
                    <input type="file" className="opacity-0 z-50 w-80 h-20 absolute bottom-0 right-0 cursor-pointer" onChange={handleChangeFile}></input>
                    <Body data={data} check={check}></Body>
                </div>
            </div >
        </>
    )
}
export default AnhBia