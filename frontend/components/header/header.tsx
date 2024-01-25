"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import PopupSearch from "../popup/search";
import { useMyContext } from "../context/context";
import React from "react";
import { useRouter } from "next/navigation";
import { callApi_SearchUser } from "../../api/callAPI";
import Noti from '../header/notification';
import Chat from "./chat";
import { IoMdSearch } from "react-icons/io";
import { GoHome } from "react-icons/go";
import { AiOutlineYoutube } from "react-icons/ai";
import { RiGroup2Line } from "react-icons/ri";
import { CgGames } from "react-icons/cg";

interface Header {
  data: {
    id: number,
    avatar: string,
    name: string,
    totalNoti: number,
    total_message: number,
  },
  reels?: boolean
}

const Header: React.FC<Header> = ({ data, reels }) => {
  const { totalNoti, SetTotalNoti, totalMessage, SetTotalMessage } = useMyContext()
  const [popUpSearch, setpopUpSearch] = useState(false);
  const [popUpNoti, setpopUpNoti] = useState(false);
  const [popUpChat, setpopUpChat] = useState(false);
  const [fetchData, SetfetchData] = useState<any>([]);
  const [pageActive, setPageActive] = useState(0)
  const router = useRouter();

  const [key, SetKey] = useState('');
  useEffect(() => {
    const fetchAPi = async () => {
      const response = await callApi_SearchUser({ key: key });
      SetfetchData(response?.data)
    }
    fetchAPi();
  }, [key]);

  const tatPopup = () => {
    setpopUpSearch(false)
  }

  const fecth_API_Search = async () => {
    const response = await callApi_SearchUser({ key: key });
    SetfetchData(response.data)
  }

  useEffect(() => {
    if (data) {
      SetTotalMessage(data.total_message)
      SetTotalNoti(data.totalNoti)
    }
  }, []);
  return (
    <>
      <div className={`fixed w-full  top-0 z-50 ${reels ? 'bg-black' : 'bg-white'}`}>
        <div className={`flex items-center shadow-md px-3 justify-between ${reels ? 'border-none' : 'border'}`}>
          <div className="flex w-max gap-3">
            <div className="border rounded-full w-[44px] h-[44px] flex justify-center items-start bg-blue-600 box-border cursor-pointer"
              onClick={() => { router.push('/') }}
            >
              <div className="text-white text-4xl font-bold">B</div>
            </div>
            <div className={`${reels ? 'hidden' : 'block'} relative`}>
              <div className="absolute top-[13px] left-2">
                <IoMdSearch className="text-gray-500 text-xl"></IoMdSearch>
              </div>
              <input
                placeholder="Tìm kiếm trên BlueBook"
                className="bg-BGICon w-[250px] max-md:w-[105px] border rounded-3xl px-10 outline-none h-[44px] placeholder:text-base placeholder:text-gray-500 "
                onClick={() => setpopUpSearch(true)}
                onChange={(e: any) => SetKey(e.target.value)}
              />
              {popUpSearch && <PopupSearch data={fetchData} tatPopup={tatPopup} fecth_API_Search={fecth_API_Search} keysearch={key}/>}
            </div>
          </div>
          <div className="flex gap-40 h-[55px] justify-start flex-1 max-lg:hidden lg:gap-5 lg:ml-10 xl:gap-16 xl:ml-24 2xl:gap-24 2xl:ml-36">
            <div className={`${pageActive == 0 && 'border-b-4 border-blue-600'} hover:rounded-2xl cursor-pointer hover:border-slate-300 hover:border h-full w-20 flex justify-center items-center box-border hover:bg-slate-300`}>
              <GoHome className={`text-3xl ${pageActive == 0 ? 'text-blue-600' : 'text-gray-500'} `}></GoHome>
            </div>
            <div className={`${pageActive == 1 && 'border-b-4 border-blue-600'} hover:rounded-2xl cursor-pointer hover:border-slate-300 hover:border h-full w-20 flex justify-center items-center box-border hover:bg-slate-300`}>
              <AiOutlineYoutube className={`text-3xl ${pageActive == 1 ? 'text-blue-600' : 'text-gray-500'} `}></AiOutlineYoutube>
            </div>
            <div className={`${pageActive == 2 && 'border-b-4 border-blue-600'} hover:rounded-2xl cursor-pointer hover:border-slate-300 hover:border h-full w-20 flex justify-center items-center box-border hover:bg-slate-300`}>
              <RiGroup2Line className={`text-3xl ${pageActive == 2 ? 'text-blue-600' : 'text-gray-500'} `}></RiGroup2Line>
            </div>
            <div className={`${pageActive == 3 && 'border-b-4 border-blue-600'} hover:rounded-2xl cursor-pointer hover:border-slate-300 hover:border h-full w-20 flex justify-center items-center box-border hover:bg-slate-300`}>
              <CgGames className={`text-3xl ${pageActive == 3 ? 'text-blue-600' : 'text-gray-500'} `}></CgGames>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <div className="border rounded-full h-max w-max p-3 bg-BGICon hover:cursor-pointer hover:bg-slate-400"
                onClick={() => {
                  setpopUpChat(!popUpChat),
                    !popUpChat && setpopUpNoti(false)
                }
                }
              >
                <svg
                  viewBox="0 0 24 24"
                  width="20px"
                  height="20px"
                  fill="currentColor"
                  className="x1lliihq x1k90msu x2h7rmj x1qfuztq x198g3q0 x1qx5ct2 xw4jnvo"
                >
                  <path d="M.5 12C.5 5.649 5.649.5 12 .5S23.5 5.649 23.5 12 18.351 23.5 12 23.5c-1.922 0-3.736-.472-5.33-1.308a.63.63 0 0 0-.447-.069l-3.4.882a1.5 1.5 0 0 1-1.828-1.829l.882-3.4a.63.63 0 0 0-.07-.445A11.454 11.454 0 0 1 .5 12zm17.56-1.43a.819.819 0 0 0-1.125-1.167L14 11.499l-3.077-2.171a1.5 1.5 0 0 0-2.052.308l-2.93 3.793a.819.819 0 0 0 1.123 1.167L10 12.5l3.076 2.172a1.5 1.5 0 0 0 2.052-.308l2.931-3.793z"></path>
                </svg>
              </div>
              {popUpChat && <Chat setpopUpChat={setpopUpChat} />}
              {totalMessage > 0 &&
                <div className="border rounded-full bg-red-700 w-6 h-6 absolute right-0 bottom-[-3px] text-white flex justify-center items-center text-sm">{totalMessage}</div>
              }
            </div>

            <div className="relative">
              <div className="border rounded-full h-max w-max p-3 bg-BGICon hover:cursor-pointer hover:bg-slate-400"
                onClick={() => {
                  setpopUpNoti(!popUpNoti), SetTotalNoti(0),
                    !popUpNoti && setpopUpChat(false)
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="20px"
                  height="20px"
                  fill="currentColor"
                  className="x1lliihq x1k90msu x2h7rmj x1qfuztq x198g3q0 x1qx5ct2 xw4jnvo"
                >
                  <path d="M3 9.5a9 9 0 1 1 18 0v2.927c0 1.69.475 3.345 1.37 4.778a1.5 1.5 0 0 1-1.272 2.295h-4.625a4.5 4.5 0 0 1-8.946 0H2.902a1.5 1.5 0 0 1-1.272-2.295A9.01 9.01 0 0 0 3 12.43V9.5zm6.55 10a2.5 2.5 0 0 0 4.9 0h-4.9z"></path>

                </svg>

              </div>
              {popUpNoti && <Noti />}
              {totalNoti > 0 &&
                <div className="border rounded-full bg-red-700 w-6 h-6 absolute right-0 bottom-[-3px] text-white flex justify-center items-center text-sm">{totalNoti}</div>
              }
            </div>
            <div className="w-[47px] h-[47px] relative">
              <Image
                className="w-full h-full border rounded-full box-border"
                src={data?.avatar ? data.avatar : "/images/user.png"}
                objectFit="cover"
                fill={true}
                quality={100}
                alt="avatar"
                onError={(e: any) => {
                  e.target.onerror = null;
                  e.target.setsrc = "/images/user.png";
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;