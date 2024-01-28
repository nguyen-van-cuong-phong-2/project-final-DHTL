"use client";
import Image from "next/image";
import { useMyContext } from "../context/context";
import { useEffect, useState } from "react";
import { callApi_GetListFriendOnline } from '../../api/callAPI';

export default function RightBody() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { updateArrMessage, socket } = useMyContext();
  const [userOnline, setUserOnline] = useState([]);
  const [arrFriend, setArrFriend] = useState([]);
  useEffect(() => {
    if (socket) {
      const getUserOnline = () => {
        socket.emit("getOnline");
        socket.on("listOnline", (data: Array<number>) => {
          console.log("🚀 ~ socket.on ~ data:", data)
          setUserOnline(data);
        });
      }
      getUserOnline();
      return () => socket.off("listOnline");
    }
  }, [socket]);

  useEffect(() => {
    const fecthAPI = async () => {
      const response = await callApi_GetListFriendOnline({ arr: userOnline });
      setArrFriend(response.data)
    }
    fecthAPI();
  }, [userOnline]);

  const handleOnClick = (e: number) => {
    const ItemFind = arrFriend.find((item) => item.id == e);
    if (ItemFind) {
      updateArrMessage(ItemFind);
    }
  };
 
  return (
    <>
      <div
        className="
      w-1/5 
      h-screen 
      max-lg:hidden
      relative 
      top-[50px]
      "
      >
        <div className="block mt-[1.5rem] overflow-auto no-scrollbar">
          <div className="text-xl font-semibold text-gray-600">Người liên hệ</div>
          {arrFriend?.map((item) => (
            <div
              key={item.id}
              className="flex items-center cursor-pointer hover:bg-gray-300 hover:border rounded-2xl box-border"
              onClick={() => handleOnClick(item.id)}
            >
              <div
                className="
              p-2 
              w-14
              h-14
              relative 
              cursor-pointer"
              >
                <Image
                  src={item.avatar ? item.avatar : "/images/user.png"}
                  className="w-full h-full border rounded-full"
                  width={20}
                  height={20}
                  alt="avatar"
                  onError={(e: any) => {
                    e.target.onerror = null;
                    e.target.setsrc = "/images/user.png";
                  }}
                />
                <div className="absolute w-3 h-3 right-2 top-9 border rounded-full bg-green-600"></div>
              </div>
              <p className="font-semibold">{item.name}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
