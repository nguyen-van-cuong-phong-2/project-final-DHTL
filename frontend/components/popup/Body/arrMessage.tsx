"use client";
import { PopUpMessage } from "../../components/popup/message";
import { useMyContext } from "../../components/context/context";
export default function ArrMessage() {
    const { arrMessage } = useMyContext();
    return (
        <>
            <div className="right-20 fixed z-50 bottom-0 flex gap-2">
                {arrMessage.map((item) => (
                    <PopUpMessage key={item.id} item={item} />
                ))}
            </div>
        </>
    );
}
