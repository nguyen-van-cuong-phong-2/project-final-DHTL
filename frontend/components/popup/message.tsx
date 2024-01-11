/* eslint-disable react-hooks/exhaustive-deps */
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
import { callApi_GetOfflineUser } from "../../api/callAPI";
import { CiFaceSmile } from "react-icons/ci";
import EmojiPicker from 'emoji-picker-react';
import { EmojiClickData } from "emoji-picker-react";

interface PopUpMessage {
  item: {
    id: number;
    name: string;
    avatar: string;
  };
}

export const PopUpMessage: React.FC<PopUpMessage> = ({ item }) => {

  const func = new functions();
  const user = func.getInfoFromToken();
  const [data, setData] = useState<any>([]);
  // console.log("🚀 ~ data:", data)
  const [Typing, SetTyping] = useState(0);
  const [checkTyping, setCheckTyping] = useState(0);
  const { DeleteArrMessage, socket } = useMyContext();
  const [arrOnline, setArrOnline] = useState([]);
  const [timeOffline, setTimeOffline] = useState();
  const contentRef = useRef<any>();
  const DivRef = useRef<any>();
  const [showEmoji, setShowEmoji] = useState(false)

  const handleUserOffLine = async () => {
    const response = await callApi_GetOfflineUser({ id: item.id })
    setTimeOffline(response.data)
  }

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSendMessage()
    }
  };

  const handleSendMessage = () => {
    if (DivRef.current && DivRef.current.innerHTML != "") {
      socket.emit("sendMessage", {
        sender_id: user.id,
        receiver_id: item.id,
        content: DivRef.current.innerHTML.trim(),
      });
      handleChange(0)
      setTimeout(() => {
        socket.emit("getMessage", {
          sender_id: user.id,
          receiver_id: item.id,
        });

        socket.on("PushMessage", (data: any) => {
          setData(data?.data);
        });

      }, 2000);
      setShowEmoji(false)
      DivRef.current.innerHTML = "";
      return socket.off("PushMessage");
    }
  }

  const handleChange = (type: number) => {
    if (type === 1 && checkTyping != 1) {
      socket.emit("typingMessage", {
        sender_id: user.id,
        receiver_id: item.id,
        type: 1
      })
      setCheckTyping(1)
    } else if (type === 0) {
      socket.emit("typingMessage", {
        sender_id: user.id,
        receiver_id: item.id,
        type: 0
      })
      setCheckTyping(0)
    }
  };

  useEffect(() => {
    const content = contentRef.current;
    if (content) {
      content.scrollTop = content.scrollHeight;
    }
    SocketConnect();
    handleUserOffLine();
    return () => {
      socket.off("PushMessage");
      handleChange(0)
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
      setData((prevData: any) => [
        ...prevData,
        {
          ...item.result,
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
    socket.on("typing", (data: any) => {
      if (item.id == data.sender_id) {
        SetTyping(data.type)
      }
    });
    socket.emit('getOnline');
    socket.on('listOnline', (data: any) => {
      setArrOnline(data)
    })
    socket.on('userOffline', (data: any) => {
      if (data.id == item.id) {
        handleUserOffLine()
      }
    })
    // Hủy đăng ký sự kiện khi component bị unmount
    return () => {
      socket.off("Message", handleNewMessage);
      socket.off("typing");
      socket.off("listOnline");
      socket.off("userOffline");
    };
  }, [socket]);

  useEffect(() => {
    const content = contentRef.current;
    if (content) {
      // Cuộn xuống cuối khi component được mount
      content.scrollTop = content.scrollHeight;
    }
  }, [data, Typing]);

  const onEmojiClick = (emojiData: EmojiClickData, event: MouseEvent) => {
    DivRef.current.innerHTML += emojiData.emoji
  };
  return (
    <>
      <div className="block rounded-xl bg-white shadow-md">
        <div className="flex justify-between items-center w-[350px] border-b-0 border-top-1 rounded-t-xl shadow-md border-white bg-white px-1 py-1 max-sm:w-screen">
          <div className="flex items-center gap-1">
            <div className="w-9 h-9 relative">
              <Image
                src={item.avatar ? item.avatar : "/images/user.png"}
                alt="avatar"
                className="w-full h-full border rounded-full"
                objectFit="cover"
                fill
                onError={(e: any) => {
                  e.target.onerror = null;
                  e.target.setsrc = "/images/user.png";
                }}
              ></Image>

              {arrOnline.includes(item.id) && <div className="bg-green-600 absolute right-0 bottom-0 p-1 border rounded-full"></div>}
            </div>
            <div className="name">
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm mt-[-5px]">{arrOnline.includes(item.id) ? "Đang hoạt động" : func.TimeAgo(timeOffline)}</p>
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
          className="w-[350px] h-[350px] min-w-[100px] overflow-auto no-scrollbar  max-sm:w-screen max-sm:h-[480px]"
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
          {Typing == 1 && (
            <div className="flex gap-2 mt-2 ml-1">
              <div className="w-10 h-10 relative">
                <Image
                  src={item.avatar}
                  alt="avatar"
                  className="w-full h-full border rounded-full"
                  objectFit="cover"
                  fill
                ></Image>
              </div>
              <AnimationTyping></AnimationTyping>
            </div>
          )}
        </div>
        <div className="w-[350px] h-max flex justify-between items-center max-sm:w-screen relative">
          <div className="p-3 w-[15%]">
            {showEmoji && <EmojiPicker onEmojiClick={onEmojiClick} searchDisabled={true} style={{ position: "absolute", bottom: "50px", height: "400px", right: "50px" }} />}

            <CiFaceSmile className="h-full w-full text-blue-500 cursor-pointer" onClick={() => setShowEmoji((prev) => (!prev))}></CiFaceSmile>
          </div>
          <div
            autoFocus
            contentEditable="true"
            role="textbox"
            data-lexical-editor="true"
            className="w-[70%] outline-none bg-BGICon p-1 border rounded-2xl max-h-20 overflow-auto pl-3 whitespace-pre-wrap"
            onKeyDown={handleKeyDown}
            tabIndex={0}
            ref={DivRef}
            onInput={() => handleChange(1)}
          ></div>

          <div className="p-3 w-[15%]">
            <AiFillLike className="h-full w-full text-blue-500"></AiFillLike>
          </div>
        </div>
      </div>
    </>
  );
};
