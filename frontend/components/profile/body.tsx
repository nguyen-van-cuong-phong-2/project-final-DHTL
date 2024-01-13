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
import { functions } from "../../functions/functions";
import {
    callApi_MakeFriend,
    callApi_acceptMakeFriend,
    callApi_cancelMakeFriend,
    callApi_getInforUser,
    callApi_DeleteMakeFriend,
    callApi_uploadAvatar,

} from "../../api/callAPI";

interface Body {
    data: {
        id: number,
        avatar: string,
        name: string,
        makefriend: number,
        totalFriend: number
    };
    check: boolean
}

const Body: React.FC<Body> = ({ data, check }) => {
    const [menu, SetMenu] = useState(false);
    const [dataResult, SetDataResult] = useState(data);
    const [avatar, SetAvatar] = useState(dataResult?.avatar);
    const { arrMessage, updateArrMessage, SetContentNotifi, socket } = useMyContext();
    const user = new functions().getInfoFromToken();

    const handleOnClick = (data: any) => {
        updateArrMessage(data);
    };

    const them_ban_be = async (id: number) => {
        const response = await callApi_MakeFriend({ receiver_id: id });
        if (response.result === true) {
            socket.emit('sendNotification', {
                sender_id: user.id,
                receiver_id: id,
                type: 1
            })
            ReloadInfoUser();
            SetContentNotifi("Gửi lời mời thành công")
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
        SetDataResult(response?.data)
    }

    const handleAccept = async (id: number) => {
        const response = await callApi_acceptMakeFriend({ receiver_id: id });
        if (response.status) {
            socket.emit('sendNotification', {
                sender_id: user.id,
                receiver_id: id,
                type: 2
            })
            ReloadInfoUser();
            SetContentNotifi(`Từ giờ bạn và ${data.name} sẽ trở thành bạn bè của nhau!`);
        }
    }

    const handleCancel = async (id: number) => {
        const response = await callApi_DeleteMakeFriend({ receiver_id: id });
        if (response.status) {
            ReloadInfoUser();
            SetContentNotifi(`Từ chối kết bạn thành công!`);
        }
    }

    const handleChangeFile = async (e: any) => {
        const file = e.target.files[0];
        const response = await callApi_uploadAvatar({ file: e.target.files[0] })
        if (response.result == true) {
            SetContentNotifi("Cập nhật avatar thành công")
        }
        if (file) {
            const reader: any = new FileReader();
            reader.onload = () => {
                SetAvatar(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDeleteFriend = async (id: number) => {
        const response = await callApi_DeleteMakeFriend({ receiver_id: id });
        if (response.status) {
            ReloadInfoUser();
            SetContentNotifi(`Huỷ kết bạn thành công!`);
        }
    }
    return (
        <>
            <div className=" w-full absolute top-[230px] left-10 lg:top-[330px] flex justify-between items-center max-sm:flex-col xl:w-[95%] lg:w-[80%] max-sm:w-[80%] max-sm:top-[130px] md:w-[90%] md:top-[200px] z-10">
                <div className="flex justify-center items-center gap-3 max-sm:flex-col">
                    <div className="relative">
                        <Image
                            alt="avatar"
                            className="border rounded-full w-[180px] h-[180px] max-md:w-[120px] max-md:h-[120px] max-sm:w-[140px] max-sm:h-[140px] hover:bg-white"
                            src={avatar}
                            width={180}
                            height={180}
                            loading="lazy"
                            style={{ background: "none" }}
                            onError={(e: any) => {
                                e.target.onerror = null;
                                e.target.setsrc = "/images/user.png";
                            }}
                        />
                        {check && <div className="absolute right-0 top-32 p-1 border rounded-full bg-BGICon cursor-pointer">
                            <IoCamera className="w-7 h-7 cursor-pointer"></IoCamera>
                            <input type="file" className="opacity-0 w-7 h-7 absolute top-0 cursor-pointer" onChange={handleChangeFile}></input>
                        </div>}
                    </div>
                    <div className="mt-10 max-sm:mt-0">
                        <div className="font-semibold text-4xl ">{dataResult?.name}</div>
                        <div className="max-sm:hidden"><Link href={''} >{dataResult?.totalFriend} bạn bè</Link></div>
                    </div>
                </div>
                {
                    !check && dataResult?.makefriend == 0 && <div className="border rounded-xl bg-blue-600 py-2 px-5 text-white mt-10 max-sm:mt-2 cursor-pointer"
                        onClick={() => them_ban_be(dataResult?.id)}
                    >thêm bạn bè</div>
                }
                {
                    !check && dataResult?.makefriend == 1 && <div className="border rounded-xl bg-gray-600 py-2 px-5 text-white mt-10 max-sm:mt-2 cursor-pointer"
                        onClick={() => huy_loi_moi(dataResult?.id)}
                    >Huỷ lời mời</div>
                }

                {!check && dataResult?.makefriend == 3 && <div className="flex flex-col items-end">
                    <div className="flex items-center mt-10 max-sm:mt-2 gap-2">
                        <div onClick={() => handleOnClick({
                            id: dataResult.id,
                            name: dataResult?.name,
                            avatar: dataResult?.avatar,
                        })} className="flex items-center border p-2 gap-2 rounded-xl bg-BGICon cursor-pointer hover:bg-slate-300">
                            <FiMessageCircle></FiMessageCircle>
                            <div className="">Nhắn tin</div>
                        </div>
                        <div onClick={() => SetMenu(!menu)} className="flex items-center border p-3 rounded-xl bg-BGICon cursor-pointer hover:bg-slate-300">
                            <CiMenuBurger></CiMenuBurger>
                        </div>
                    </div>
                    {!check && menu && <div className="absolute border top-32 max-sm:top-60 px-3 py-1 bg-white flex justify-center items-center gap-2 mt-2 rounded-xl hover:bg-slate-100 cursor-pointer" onClick={() => handleDeleteFriend(dataResult?.id)}>
                        <div><SlUserUnfollow></SlUserUnfollow></div>
                        <div>Huỷ kết bạn</div>
                    </div>}
                </div>}
                {
                    !check && dataResult?.makefriend == 2 && <div className="flex justify-center items-center gap-2 mt-7">
                        <div className="border rounded-xl bg-blue-600 text-white px-3 py-2 cursor-pointer hover:bg-slate-300"
                            onClick={() => handleAccept(dataResult.id)}
                        >Chấp nhận lời mời</div>
                        <div className="border rounded-xl bg-BGICon px-3 py-2 cursor-pointer hover:bg-slate-300"
                            onClick={() => handleCancel(dataResult.id)}
                        >Xoá lời mời</div>
                    </div>
                }

                <div className="right-20 fixed z-50 bottom-0 flex gap-2">
                    {arrMessage.map((item) => (
                        <PopUpMessage key={item.id} item={item} />
                    ))}
                </div>
            </div >

        </>
    )
}
export default Body