"use client";
import { PopUpMessage } from "../../components/popup/message";
import { useMyContext } from "../../components/context/context";
import { useEffect, useState } from "react";
import { callApi_getInforUser } from "../../api/callAPI";
import { functions } from "../../functions/functions";
export default function ArrMessage() {
    const { arrMessage, socket, updateArrMessage } = useMyContext();
    const [user, setUser] = useState<any>()
    const func = new functions();
    const userr = func.getInfoFromToken();
    useEffect(() => {
        if (socket) {
            socket.on("Message", async (data: any) => {
                setUser(data)
            })
            return () => socket.off("Message")
        }
    }, [])

    useEffect(() => {
        if (user) {
            const call = async () => {
                const find = arrMessage.find(item => item.id == user?.sender_id)
                if (!find && userr.id !== user?.sender_id) {
                    const response = await callApi_getInforUser({ id: user.sender_id })
                    if (response?.data) {
                        updateArrMessage({
                            id: user?.sender_id,
                            name: response.data.name,
                            avatar: response.data.avatar,
                        })
                    }
                }
            }
            call()
        }
    }, [user])
    return (
        <>
            <div className="right-20 fixed z-50 bottom-0 flex gap-2 max-sm:right-0">
                {arrMessage.map((item) => (
                    <PopUpMessage key={item.id} item={item} />
                ))}
            </div>
        </>
    );
}
