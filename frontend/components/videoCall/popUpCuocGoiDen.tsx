'use client'
import Image from "next/image"
import { FaPhoneAlt } from "react-icons/fa";
import { FaPhoneSlash } from "react-icons/fa6";
import { useMyContext } from "../context/context";
import { useEffect, useState } from "react";
import { callApi_CheckUserCall } from "../../api/callAPI";
import { functions } from "../../functions/functions";

const Components = ({ setCheckCall, data }) => {
    const fnc = new functions();
    const user = fnc.getInfoFromToken()
    const showVideoCall = async (id: number) => {
        return window.open(`${process.env.NEXT_PUBLIC_DOMAIN_DOMAIN}/VideoCall?userCall=${id}&&userReceiveCall=${user.id}`, '_blank');
    }
   
    // const 
    return <>
        <div className="fixed top-1/2 left-1/2 w-56 h-56 z-[100] ">
            <div className="w-full h-full bg-white rounded-2xl border shadow-2xl flex flex-col items-center gap-3 translate-x-[-50%] translate-y-[-50%]">
                <div className="text-xl font-semibold">Cuộc gọi đến</div>
                <div className="w-20 h-20 relative">
                    <Image
                        alt="avatar"
                        src={data?.avatar}
                        fill
                        objectFit="cover"
                        className="rounded-full"
                    >
                    </Image>
                </div>
                <div className="text-base font-medium mt-[-10px]">{data?.name}</div>
                <div className="flex gap-10">
                    <div className="rounded-full p-2 bg-green-600 cursor-pointer hover:bg-slate-200"
                        onClick={() => { showVideoCall(data?.id) }}
                    >
                        <FaPhoneAlt className="text-xl text-white"></FaPhoneAlt>
                    </div>
                    <div className="rounded-full p-2 bg-red-600 cursor-pointer hover:bg-slate-200">
                        <FaPhoneSlash className="text-xl text-white"></FaPhoneSlash>
                    </div>
                </div>
            </div>
        </div>
    </>
}

const PopUpCuocGoiDen = () => {
    const { socket } = useMyContext();
    const [checkCall, setCheckCall] = useState(false);
    const [userCall, setUserCall] = useState<any>();
    const fnc = new functions();
    const user = fnc.getInfoFromToken()
    useEffect(() => {
        if (socket) {
            socket.on('notiCall', async (data: any) => {
                const response = await callApi_CheckUserCall({ id: Number(user.id) });
                if (response.data === true) {
                    socket.emit('answer_call_socket', { type: 3, userCall: data.userCall })
                } else {
                    setUserCall(data.userCall)
                    setCheckCall(true)
                    setTimeout(()=>{
                        setCheckCall(false)
                        socket.emit('answer_call_socket', { type: 4, userCall: data.userCall })
                    },30000)
                }
            })
            return () => {
                socket.off('notiCall');
                setCheckCall(false);
            }
        }
    }, [socket])
    return (checkCall && <Components setCheckCall={setCheckCall} data={userCall}></Components>)
}
export default PopUpCuocGoiDen