"use client";
import Image from "next/image";
import { ImCancelCircle } from "react-icons/im";
import { IoImagesOutline } from "react-icons/io5";
import { AiFillLike } from "react-icons/ai";
import { useMyContext } from "@/components/context/context";
import { ChatMessage } from "@/components/chat/chat";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import JWT from "jsonwebtoken";
import { io } from "socket.io-client";
import { AnimationTyping } from "../popup/typingAnimation";

interface PopUpMessage {
  item: {
    id: number;
    name: string;
    avatar: string;
  };
}

export const PopUpMessage: React.FC<PopUpMessage> = ({ item }) => {
  const [data, setData] = useState();
  const { DeleteArrMessage } = useMyContext();
  const contentRef = useRef();
  // const router = useRouter();
  const checkToken = Cookies.get("token");
  // if (!checkToken) {
  //   router.push("/dang-nhap.html");
  // } else {
  var userID = Number(JWT.decode(checkToken));
  // }
  let socket;
  useEffect(() => {
    const content = contentRef.current;
    if (content) {
      // Cuộn xuống cuối khi component được mount
      content.scrollTop = content.scrollHeight;

      // const handleScroll = () => {
      //   // Kiểm tra nếu người dùng cuộn lên trên
      //   if (
      //     content.scrollTop <
      //     content.scrollHeight - content.clientHeight - 50
      //   ) {
      //     // Người dùng đang xem lịch sử trò chuyện cũ, tạm ngừng tự động cuộn xuống
      //     content.removeEventListener("scroll", handleScroll);
      //   }
      // };

      // content.addEventListener("scroll", handleScroll);

      // return () => {
      //   content.removeEventListener("scroll", handleScroll);
      // };
    }
    SocketConnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const SocketConnect = () => {
    socket = io("http://localhost:8080");
    socket.emit("getMessage", {
      sender_id: 1000,
      receiver_id: 2000,
    });

    socket.on("Message", (data) => {
      setData(data?.data);
    });
  };
  const content = contentRef.current;
  if (content) {
    // Cuộn xuống cuối khi component được mount
    content.scrollTop = content.scrollHeight;
  }

  return (
    <>
      <div className="block rounded-xl bg-white shadow-md">
        <div className="flex justify-between items-center w-[350px] border-b-0 border-top-1 rounded-t-xl shadow-md border-white bg-white px-1 py-1">
          <div className="flex items-center gap-1">
            <div className="w-9 h-9 relative">
              <Image
                src={item.avatar}
                alt="avatar"
                className="w-full h-full border rounded-full"
                objectFit="cover"
                width={30}
                height={30}
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
          className="max-w-[350px] h-[350px] min-w-[100px] overflow-auto"
          ref={contentRef}
        >
          {data?.map((itemMap, key) => (
            <ChatMessage
              key={key}
              index={key}
              item={item}
              own={itemMap.sender_id == userID}
              message={itemMap}
              data={data}
            ></ChatMessage>
          ))}
          <AnimationTyping></AnimationTyping>
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
          ></div>

          <div className="p-3 w-[15%]">
            <AiFillLike className="h-full w-full text-blue-500"></AiFillLike>
          </div>
        </div>
      </div>
    </>
  );
};
