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

interface Header {
  data: {
    id: number,
    avatar: string,
    name: string,
  },
  reels?: boolean
}

const Header: React.FC<Header> = ({ data, reels }) => {
  const { setLoading, totalNoti, SetTotalNoti, socket } = useMyContext()
  const [popUpSearch, setpopUpSearch] = useState(false);
  const [popUpNoti, setpopUpNoti] = useState(false);
  const [popUpChat, setpopUpChat] = useState(false);
  const [fetchData, SetfetchData] = useState<any>([]);
  const router = useRouter();

  const [key, SetKey] = useState('');
  useEffect(() => {
    const fetchAPi = async () => {
      const response = await callApi_SearchUser({ key: key });
      SetfetchData(response.data)
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

  return (
    <>
      <div className={`fixed w-full  top-0 z-50 ${reels ? 'bg-black' : 'bg-white'}`}>
        <div className={`flex  shadow-md p-3 justify-between ${reels ? 'border-none' : 'border'}`}>
          <div className="flex w-max gap-3">
            <div className="border rounded-full h-max w-max px-5 py-3 bg-blue-600 box-border cursor-pointer"
              onClick={() => { router.push('/') }}
            >
              <p className="text-white text-1xl font-bold">B</p>
            </div>
            <div className={`${reels ? 'hidden' : 'block'}`}>
              <input
                placeholder="Tìm kiếm trên BlueBook"
                className="bg-BGICon w-[500px] max-md:w-[105px] border rounded-3xl px-5 outline-none h-[48px] search"
                onClick={() => setpopUpSearch(true)}
                onChange={(e: any) => SetKey(e.target.value)}
              />
              {popUpSearch && <PopupSearch data={fetchData} tatPopup={tatPopup} fecth_API_Search={fecth_API_Search} />}
            </div>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <div className="border rounded-full h-max w-max p-3 bg-BGICon hover:cursor-pointer hover:bg-slate-400"
                onClick={() => {
                  setpopUpChat(!popUpChat),
                    !popUpChat && setpopUpNoti(false)
                }}
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
              {totalNoti > 0 &&
                <div className="border rounded-full bg-red-700 w-6 h-6 absolute right-0 bottom-[-3px] text-white flex justify-center items-center text-sm">{totalNoti}</div>
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