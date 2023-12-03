"use client";

import Image from "next/image";
import { useMyContext } from "../context/context";

export default function rightBody() {
  const arr = [
    {
      id: 2000,
      name: "Thảo Nguyễn",
      avatar: "/images/avatarChat.jpg",
    },
    {
      id: 2,
      name: "Nam Nguyễn",
      avatar: "/images/avatarChat.jpg",
    },
    {
      id: 3,
      name: "Linh Nguyễn",
      avatar: "/images/avatarChat.jpg",
    },
    {
      id: 4,
      name: "Mai Nguyễn",
      avatar: "/images/avatarChat.jpg",
    },
    {
      id: 5,
      name: "Tuấn Nguyễn",
      avatar: "/images/avatarChat.jpg",
    },
    {
      id: 6,
      name: "Phương Nguyễn",
      avatar: "/images/avatarChat.jpg",
    },
    {
      id: 7,
      name: "Quỳnh Nguyễn",
      avatar: "/images/avatarChat.jpg",
    },
    {
      id: 8,
      name: "AN Nguyễn",
      avatar: "/images/avatarChat.jpg",
    },
    {
      id: 2000,
      name: "Thảo Nguyễn",
      avatar: "/images/avatarChat.jpg",
    },
    {
      id: 2,
      name: "Nam Nguyễn",
      avatar: "/images/avatarChat.jpg",
    },
    {
      id: 2000,
      name: "Thảo Nguyễn",
      avatar: "/images/avatarChat.jpg",
    },
    {
      id: 2,
      name: "Nam Nguyễn",
      avatar: "/images/avatarChat.jpg",
    },
    {
      id: 2000,
      name: "Thảo Nguyễn",
      avatar: "/images/avatarChat.jpg",
    },
    {
      id: 2,
      name: "Nam Nguyễn",
      avatar: "/images/avatarChat.jpg",
    },
    {
      id: 2000,
      name: "Thảo Nguyễn",
      avatar: "/images/avatarChat.jpg",
    },
    {
      id: 2,
      name: "Nam Nguyễn",
      avatar: "/images/avatarChat.jpg",
    },

  ];
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { updateArrMessage } = useMyContext();
  const handleOnClick = (e: number) => {
    const ItemFind = arr.find((item) => item.id == e);
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
      overflow-auto
      no-scrollbar
      max-lg:hidden
      sticky 
      top-[75px]
      "
      >
        <div className="block mt-[1.5rem]">
          {arr.map((item) => (
            <div
              key={item.id}
              className="flex items-center cursor-pointer hover:bg-gray-300 border rounded-2xl"
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
                  src={item.avatar}
                  className="w-full h-full border rounded-full"
                  width={20}
                  height={20}
                  alt="avatar"
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
