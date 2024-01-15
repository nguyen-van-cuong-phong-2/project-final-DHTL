import Image from "next/image"
import { useEffect, useState } from "react";
import { useMyContext } from "../context/context";
import {
    callApi_MakeFriend,
    callApi_acceptMakeFriend,
    callApi_cancelMakeFriend,
    callApi_getInforUser,
    callApi_DeleteMakeFriend,
    callApi_uploadAvatar,

} from "../../api/callAPI";
import { functions } from "../../functions/functions";

const Index = ({ item }) => {
    const user = new functions().getInfoFromToken();
    const { SetContentNotifi, socket } = useMyContext();
    const [themBanBe, setThemBanBe] = useState(item.check_send_make_friend || 0)
    const them_ban_be = async (id: number) => {
        const response = await callApi_MakeFriend({ receiver_id: id });
        if (response.result === true) {
            socket.emit('sendNotification', {
                sender_id: user.id,
                receiver_id: id,
                type: 1
            })
            SetContentNotifi("Gửi lời mời thành công")
        } else {
            SetContentNotifi("Thêm bạn bè thất bại, vui lòng thử lại sau!")
        }
    }

    const huy_loi_moi = async (id: number) => {
        const response = await callApi_cancelMakeFriend({ receiver_id: id });
        if (response.result === true) {
            SetContentNotifi("Huỷ lời mời thành công")
        } else {
            SetContentNotifi("Huỷ lời mời thất bại, vui lòng thử lại sau!")
        }
    }
    const handleAccept = async (id: number) => {
        const response = await callApi_acceptMakeFriend({ receiver_id: id });
        if (response.status) {
            socket.emit('sendNotification', {
                sender_id: user.id,
                receiver_id: id,
                type: 2
            })
            SetContentNotifi(`Từ giờ bạn và ${item.name} sẽ trở thành bạn bè của nhau!`);
        }
    }
    return (<>
        <div className="rounded-2xl shadow-xl p-2">
            <div className="w-full h-48 relative">
                <Image
                    alt='avatar'
                    src={item.avatar ? item.avatar : "/images/emgai.jpg"}
                    fill
                    className="rounded-xl"
                    onError={(e: any) => {
                        e.target.onerror = null;
                        e.target.setsrc = "/images/emgai.jpg";
                    }}
                >

                </Image>
            </div>
            <div className="text-lg font-semibold ml-2">{item.name}</div>
            <div className="flex gap-1 ml-2">
                {item?.avatar2?.map((itemm: any) => (
                    <div key={itemm} className="w-5 h-5 relative">
                        <Image
                            alt="avatar"
                            src={itemm}
                            fill
                            className="rounded-xl"
                        >
                        </Image>
                    </div>
                ))}

                <div className="text-sm text-gray-600 font-semibold">{item?.total} bạn chung</div>
            </div>
            {
                themBanBe == 0 && <div className="flex justify-center rounded-2xl mt-2 p-2 bg-blue-50 text-blue-600 font-semibold cursor-pointer hover:bg-slate-200"
                    onClick={() => { them_ban_be(item.id), setThemBanBe(3) }}
                >Gửi lời mời</div>
            }
            {
                themBanBe == 3 && <div className="flex justify-center rounded-2xl mt-2 p-2 bg-blue-50 text-blue-600 font-semibold cursor-pointer hover:bg-slate-200"
                    onClick={() => { huy_loi_moi(item.id), setThemBanBe(0) }}
                >Xoá lời mời</div>
            }
            {
                themBanBe == 2 && <div className="flex justify-center rounded-2xl mt-2 p-2 bg-blue-50 text-blue-600 font-semibold cursor-pointer hover:bg-slate-200"
                    onClick={() => { handleAccept(item.id), setThemBanBe(4) }}
                >Chấp nhận lời mời</div>
            }
            {
                themBanBe == 4 && <div className="flex justify-center rounded-2xl mt-2 p-2 bg-blue-50 text-blue-600 font-semibold cursor-pointer hover:bg-slate-200"
                >Bạn bè</div>
            }
        </div>
    </>)
}
export default Index