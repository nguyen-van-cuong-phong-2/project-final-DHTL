/* eslint-disable react/jsx-key */
import Image from "next/image"
import { useMyContext } from "../context/context"
import { useEffect, useState } from "react"
import { callApi_GetMessage } from "../../api/callAPI"
import { functions } from "../../functions/functions"
const Chat = () => {
    const [data, setData] = useState([]);
    const myFunction = new functions();
    const [arrOnline, setArrOnline] = useState([]);
    const { updateArrMessage, socket } = useMyContext()

    useEffect(() => {
        const callAPI = async () => {
            const response = await callApi_GetMessage();
            setData(response.data)
        }
        callAPI()

    }, [])
    useEffect(() => {
        if (socket) {
            socket.emit('getOnline');
            socket.on('listOnline', (data: any) => {
                setArrOnline(data)
            })
            return () => {
                socket.off("listOnline");
              };
        }
    }, [socket])

    return (
        <>
            <div className="w-[320px] absolute h-screen right-1 top-[52px] border rounded-md max-sm:right-[-120px]">
                <div className="bg-white w-full h-[80%] rounded-md shadow-2xl z-50 overflow-auto ">
                    <div className="font-bold text-2xl ml-2 mt-2"> Đoạn chat</div>
                    {data?.map(item => (
                        <div className="flex gap-2 items-center mt-2 cursor-pointer hover:bg-slate-100 hover:rounded-2xl p-2"
                            onClick={() => updateArrMessage({
                                id: item.userId,
                                avatar: item.avatar,
                                name: item.name
                            })}
                        >
                            <div className="relative">
                                <div className="relative w-12 h-12">
                                    <Image
                                        alt="avatar"
                                        src={item?.avatar ? item?.avatar : "/images/user.png"}
                                        className="rounded-full"
                                        fill
                                        onError={(e: any) => {
                                            e.target.onerror = null;
                                            e.target.setsrc = "/images/user.png";
                                        }}
                                    ></Image>
                                </div>
                                {arrOnline.includes(item.userId) && <div className="absolute right-0 bottom-0 rounded-full w-4 h-4 bg-green-600">
                                </div>}

                            </div>
                            <div>
                                <div className="text-base font-medium">{item.name}</div>
                                <div className="text-xs font-normal text-gray-600 max-w-[300px] overflow-ellipsis">
                                    {item.myMessage == 1 ? "Bạn:" : `${item.name}:`}
                                    &nbsp;
                                    {item.content}
                                    &nbsp; &nbsp;&nbsp;&nbsp; {myFunction.TimeAgo(item.created_at, 1)}</div>
                            </div>
                        </div>
                    ))}


                </div>
            </div >
        </>
    )
}
export default Chat