"use client"
import { Image } from "antd"
import Link from "next/link";
import { FiMessageCircle } from "react-icons/fi";
import { CiMenuBurger } from "react-icons/ci";
import { SlUserUnfollow } from "react-icons/sl";
import { useState } from "react";
import { useMyContext } from "../../components/context/context";
import { PopUpMessage } from "../popup/message";
import { IoCamera } from "react-icons/io5";
import { callApi_MakeFriend, callApi_cancelMakeFriend, callApi_getInforUser } from "../../api/callAPI";

interface Body {
    data: {
        id: number,
        avatar: string,
        name: string,
        makefriend: number
    }
}

const Body: React.FC<Body> = ({ data }) => {
    const [menu, SetMenu] = useState(false);
    const [dataResult, SetDataResult] = useState(data);

    const { arrMessage, updateArrMessage, SetContentNotifi } = useMyContext();
    const handleOnClick = (data: any) => {
        updateArrMessage(data);
    };

    const them_ban_be = async (id: number) => {
        const response = await callApi_MakeFriend({ receiver_id: id });
        if (response.result === true) {
            ReloadInfoUser();
            SetContentNotifi("Thêm bạn bè thành công")
        } else {
            SetContentNotifi("Thêm bạn bè thất bại, vui lòng thử lại sau!")
        }
    }

    const huy_loi_moi = async (id: number) => {
        const response = await callApi_cancelMakeFriend({ receiver_id: id });
        if (response.result === true) {
            ReloadInfoUser();
            SetContentNotifi("Huỷ lời mời thành công")
        } else {
            SetContentNotifi("Huỷ lời mời thất bại, vui lòng thử lại sau!")
        }
    }

    const ReloadInfoUser = async () => {
        const response = await callApi_getInforUser({ id: Number(dataResult.id) });
        console.log("🚀 ~ file: body.tsx:53 ~ ReloadInfoUser ~ response:", response)
        // SetDataResult(response?.data[0])
    }

    return (
        <>
            <div className="h-screen w-full flex justify-center items-center  bg-white">
                <div className="absolute lg:top-[430px] flex justify-between items-center max-sm:flex-col xl:w-[60%] lg:w-[80%] max-sm:w-[80%] max-sm:top-[230px] md:w-[90%] md:top-[300px]">
                    <div className="flex justify-center items-center gap-3 max-sm:flex-col">
                        <div className="relative">
                            <Image
                                alt="avatar"
                                className="border rounded-full w-[180px] h-[180px] max-md:w-[120px] max-md:h-[120px] max-sm:w-[140px] max-sm:h-[140px] hover:bg-white"
                                src={dataResult?.avatar}
                                width={180}
                                height={180}
                                loading="lazy"
                                style={{ background: "none" }}
                                onError={(e: any) => {
                                    e.target.onerror = null;
                                    e.target.setsrc = "/images/user.png";
                                }}
                            />
                            <div className="absolute right-0 top-32 p-1 border rounded-full bg-BGICon cursor-pointer">
                                <IoCamera className="w-7 h-7 cursor-pointer"></IoCamera>
                                <input type="file" className="opacity-0 w-7 h-7 absolute top-0 cursor-pointer"></input>
                            </div>
                        </div>
                        <div className="mt-10 max-sm:mt-0">
                            <div className="font-semibold text-4xl ">{dataResult?.name}</div>
                            <div className="max-sm:hidden"><Link href={''} >299 bạn bè</Link></div>
                        </div>
                    </div>
                    {
                        dataResult?.makefriend == 0 && <div className="border rounded-xl bg-blue-600 py-2 px-5 text-white mt-10 max-sm:mt-2 cursor-pointer"
                            onClick={() => them_ban_be(dataResult?.id)}
                        >thêm bạn bè</div>
                    }
                    {
                        dataResult?.makefriend == 1 && <div className="border rounded-xl bg-gray-600 py-2 px-5 text-white mt-10 max-sm:mt-2 cursor-pointer"
                            onClick={() => huy_loi_moi(dataResult?.id)}
                        >Huỷ lời mời</div>
                    }

                    {/* <div className="flex flex-col items-end">
                        <div className="flex items-center mt-10 max-sm:mt-2 gap-2">
                            <div onClick={() => handleOnClick({
                                id: 2,
                                name: "Nam Nguyễn",
                                avatar: "/images/avatarChat.jpg",
                            })} className="flex items-center border p-2 gap-2 rounded-xl bg-BGICon cursor-pointer hover:bg-slate-300">
                                <FiMessageCircle></FiMessageCircle>
                                <div className="">Nhắn tin</div>
                            </div>
                            <div onClick={() => SetMenu(!menu)} className="flex items-center border p-3 rounded-xl bg-BGICon cursor-pointer hover:bg-slate-300">
                                <CiMenuBurger></CiMenuBurger>
                            </div>
                        </div>
                        {menu && <div className="absolute border top-32 max-sm:top-60 px-3 py-1 bg-white flex justify-center items-center gap-2 mt-2 rounded-xl hover:bg-slate-100 cursor-pointer">
                            <div><SlUserUnfollow></SlUserUnfollow></div>
                            <div>Huỷ kết bạn</div>
                        </div>}
                    </div> */}

                    {/* <div className="flex justify-center items-center gap-2 mt-7">
                        <div className="border rounded-xl bg-blue-600 text-white px-3 py-2 cursor-pointer hover:bg-slate-300">Chấp nhận lời mời</div>
                        <div className="border rounded-xl bg-BGICon px-3 py-2 cursor-pointer">Xoá lời mời</div>
                    </div> */}

                    <div className="right-20 fixed z-50 bottom-0 flex gap-2">
                        {arrMessage.map((item) => (
                            <PopUpMessage key={item.id} item={item} />
                        ))}
                    </div>
                </div>
            </div >

        </>
    )
}
export default Body