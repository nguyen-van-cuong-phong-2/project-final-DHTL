import Image from "next/image";
export default function rightBody() {
  const arr = [
    {
      id: 1,
      name: "Yến Nguyễn",
      avatar: "/images/avatarChat.jpg",
    },
    {
      id: 1,
      name: "Yến Nguyễn",
      avatar: "/images/avatarChat.jpg",
    },
    {
      id: 1,
      name: "Yến Nguyễn",
      avatar: "/images/avatarChat.jpg",
    },
    {
      id: 1,
      name: "Yến Nguyễn",
      avatar: "/images/avatarChat.jpg",
    },
    {
      id: 1,
      name: "Yến Nguyễn",
      avatar: "/images/avatarChat.jpg",
    },
    {
      id: 1,
      name: "Yến Nguyễn",
      avatar: "/images/avatarChat.jpg",
    },
    {
      id: 1,
      name: "Yến Nguyễn",
      avatar: "/images/avatarChat.jpg",
    },
    {
      id: 1,
      name: "Yến Nguyễn",
      avatar: "/images/avatarChat.jpg",
    },
    {
      id: 1,
      name: "Yến Nguyễn",
      avatar: "/images/avatarChat.jpg",
    },
    {
      id: 1,
      name: "Yến Nguyễn",
      avatar: "/images/avatarChat.jpg",
    },
    {
      id: 1,
      name: "Yến Nguyễn",
      avatar: "/images/avatarChat.jpg",
    },
    {
      id: 1,
      name: "Yến Nguyễn",
      avatar: "/images/avatarChat.jpg",
    },
    {
      id: 1,
      name: "Yến Nguyễn",
      avatar: "/images/avatarChat.jpg",
    },
    {
      id: 1,
      name: "Yến Nguyễn",
      avatar: "/images/avatarChat.jpg",
    },
    {
      id: 1,
      name: "Yến Nguyễn",
      avatar: "/images/avatarChat.jpg",
    },
    {
      id: 1,
      name: "Yến Nguyễn",
      avatar: "/images/avatarChat.jpg",
    },
    {
      id: 1,
      name: "Yến Nguyễn",
      avatar: "/images/avatarChat.jpg",
    },
    {
      id: 1,
      name: "Yến Nguyễn",
      avatar: "/images/avatarChat.jpg",
    },
    {
      id: 1,
      name: "Yến Nguyễn",
      avatar: "/images/avatarChat.jpg",
    },
    {
      id: 1,
      name: "Yến Nguyễn",
      avatar: "/images/avatarChat.jpg",
    },
    {
      id: 1,
      name: "Yến Nguyễn",
      avatar: "/images/avatarChat.jpg",
    },
  ];

  return (
    <>
      <div
        className="
      w-1/5 
      h-screen 
      overflow-auto
      no-scrollbar
      "
      >
        <div className="block mt-[1.5rem]">
          {arr.map((item) => (
            <div
              key={item.id}
              className="flex items-center cursor-pointer hover:bg-gray-300 border rounded-2xl"
            >
              <div
                className="
              p-2 
              w-[18%] 
              h-[18%] 
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
