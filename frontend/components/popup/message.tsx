"use client";
import Image from "next/image";
import { ImCancelCircle } from "react-icons/im";
import { IoImagesOutline } from "react-icons/io5";
import { AiFillLike } from "react-icons/ai";
import { useMyContext } from "../context/context";
import { ChatMessage } from "../chat/chat";
import { useEffect, useRef, useState } from "react";
import { AnimationTyping } from "../popup/typingAnimation";
import { functions } from "../../functions/functions";

interface PopUpMessage {
  item: {
    id: number;
    name: string;
    avatar: string;
  };
}

export const PopUpMessage: React.FC<PopUpMessage> = ({ item }) => {

  const func = new functions();

  const [data, setData] = useState<any>([]);
  const [Typing, SetTyping] = useState(false);

  const { DeleteArrMessage, socket } = useMyContext();
  const contentRef = useRef<any>();
  const DivRef = useRef<any>();

  const user = func.getInfoFromToken();
  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      event.preventDefault();

      if (DivRef.current && DivRef.current.innerHTML != "") {
        socket.emit("sendMessage", {
          sender_id: user.id,
          receiver_id: item.id,
          content: DivRef.current.innerHTML.trim(),
        });
        setTimeout(() => {
          socket.emit("getMessage", {
            sender_id: user.id,
            receiver_id: item.id,
          });

          socket.on("PushMessage", (data: any) => {
            setData(data?.data);
          });

        }, 2000);
        DivRef.current.innerHTML = "";
        return socket.off("PushMessage");
      }
    }
  };
  const handleChange = () => { };
  useEffect(() => {
    const content = contentRef.current;
    if (content) {
      content.scrollTop = content.scrollHeight;
    }
    SocketConnect();
    return () => {
      socket.off("PushMessage");
    };
  }, []);
  const SocketConnect = () => {
    socket.emit("getMessage", {
      sender_id: user.id,
      receiver_id: item.id,
    });

    socket.on("PushMessage", (data: any) => {
      setData(data?.data);
    });

  };
  useEffect(() => {
    const handleNewMessage = (item: any) => {
      setData((prevData) => [
        ...prevData,
        {
          ...item,
          id: item.id,
          seen: 0,
          _id: "6566f58cb341441c876c6031",
          __v: 0,
          created_at: item.created_at,
        },
      ]);
    };

    // Đăng ký sự kiện "Message" khi component được mount
    socket.on("Message", handleNewMessage);

    // Hủy đăng ký sự kiện khi component bị unmount
    return () => {
      socket.off("Message", handleNewMessage);
    };
  }, [socket]);
  useEffect(() => {
    const content = contentRef.current;
    if (content) {
      // Cuộn xuống cuối khi component được mount
      content.scrollTop = content.scrollHeight;
    }
  }, [data]);
  return (
    <>
      <div className="block rounded-xl bg-white shadow-md">
        <div className="flex justify-between items-center w-[350px] border-b-0 border-top-1 rounded-t-xl shadow-md border-white bg-white px-1 py-1">
          <div className="flex items-center gap-1">
            <div className="w-9 h-9 relative">
              <Image
                src={item.avatar ? item.avatar : "/images/user.png"}
                alt="avatar"
                className="w-full h-full border rounded-full"
                objectFit="cover"
                width={30}
                height={30}
                onError={(e: any) => {
                  e.target.onerror = null;
                  e.target.setsrc = "/images/user.png";
                }}
              ></Image>

              <div className="bg-green-600 absolute right-0 bottom-0 p-1 border rounded-full"></div>
            </div>
            <div className="name">
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm mt-[-5px]">Đang hoạt động</p>
            </div>
          </div>
          <div className="h-6 w-6 flex justify-center items-center">
            <ImCancelCircle
              className="w-full h-full text-blue-500 cursor-pointer hover:opacity-70"
              onClick={() => DeleteArrMessage(item.id)}
            ></ImCancelCircle>
          </div>
        </div>

        <div
          className="max-w-[350px] h-[350px] min-w-[100px] overflow-auto no-scrollbar"
          ref={contentRef}
        >
          {data?.map((itemMap, key) => (
            <ChatMessage
              key={key}
              index={key}
              item={item}
              own={itemMap.sender_id != user.id}
              message={itemMap}
              data={data}
              show={itemMap.receiver_id == item.id || itemMap.sender_id == item.id}
            ></ChatMessage>
          ))}
          {Typing && (
            <div className="flex w-9 h-9 ml-1 gap-2">
              <Image
                src={item.avatar}
                alt="avatar"
                className="w-full h-full border rounded-full"
                objectFit="cover"
                width={30}
                height={30}
              ></Image>
              <AnimationTyping></AnimationTyping>
            </div>
          )}
        </div>
        <div className="w-[350px] h-max flex justify-between items-center">
          <div className="p-3 w-[15%]">
            <IoImagesOutline className="h-full w-full text-blue-500"></IoImagesOutline>
          </div>
          <div
            autoFocus
            contentEditable="true"
            role="textbox"
            data-lexical-editor="true"
            className="w-[70%] outline-none bg-BGICon p-1 border rounded-2xl max-h-20 overflow-auto "
            onKeyDown={handleKeyDown}
            tabIndex={0}
            ref={DivRef}
            onInput={handleChange}
          ></div>

          <div className="p-3 w-[15%]">
            <AiFillLike className="h-full w-full text-blue-500"></AiFillLike>
          </div>
        </div>
      </div>
    </>
  );
};
