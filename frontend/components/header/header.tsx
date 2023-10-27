"use client";
import { AiOutlineMessage, AiOutlineLogout } from "react-icons/ai";
import { IoMdNotificationsOutline } from "react-icons/io";
import { FiSettings } from "react-icons/fi";
import { BiSearchAlt2 } from "react-icons/bi";
import { PopUpSearch } from "@/components/popup/search";
import { useState } from "react";
export default function Header() {
  const [popUp, setpopUp] = useState(false);
  return (
    <>
      <div className="w-full h-24 flex items-center pl-32 justify-between border-2 py-5 pr-5">
        <span className=" text-5xl font-bold text-blue-500 hover:cursor-pointer">
          BlueBook
        </span>
        <div className="w-1/2 relative">
          <input
            placeholder="Tìm kiếm trên bluebook"
            className=" text-2xl w-full mt-1 border rounded-3xl py-2.5 bg-gray-100 pl-12 outline-none focus:border-2 h-14"
            onClick={() => setpopUp(true)}
          ></input>
          <BiSearchAlt2 className="absolute top-[22px] left-4 text-2xl text-gray-500"></BiSearchAlt2>
        </div>

        <AiOutlineMessage className="text-4xl mt-3 ml-3 text-slate-500 hover:cursor-pointer"></AiOutlineMessage>
        <IoMdNotificationsOutline className="text-4xl mt-3 ml-3 text-slate-500 hover:cursor-pointer"></IoMdNotificationsOutline>
        <FiSettings className="text-4xl mt-3 ml-3 text-slate-500 hover:cursor-pointer"></FiSettings>
        <div className="text-4xl mt-3 ml-3 text-slate-500 hover:cursor-pointer border rounded-full p-5 bg-red-400"></div>
      </div>
      {/* {popUp && <PopUpSearch></PopUpSearch>} */}

    </>
  );
}
