"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import PopupSearch from "../popup/search";
import { useMyContext } from "../context/context";
import React from "react";
import { useRouter } from "next/navigation";
import { callApi_SearchUser } from "../../api/callAPI";

interface Header {
  data: {
    id: number,
    avatar: string,
    name: string,
  }
}

const Header: React.FC<Header> = ({ data }) => {
  const { setLoading } = useMyContext()
  const [popUpSearch, setpopUpSearch] = useState(false);
  const [fetchData, SetfetchData] = useState<any>([]);
  const router = useRouter();
  useEffect(() => {
    setLoading(false)

  }, []);
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
  return (
    <>
      <div className="fixed w-full bg-white top-0 z-50">
        <div className="flex border shadow-md p-3 justify-between">
          <div className="flex w-max gap-3">
            <div className="border rounded-full h-max w-max px-5 py-3 bg-blue-600 box-border cursor-pointer"
              onClick={() => { router.push('/') }}
            >
              <p className="text-white text-1xl font-bold">B</p>
            </div>
            <div className="block">
              <input
                placeholder="Tìm kiếm trên BlueBook"
                className="bg-BGICon w-[500px] max-md:w-[105px] border rounded-3xl px-5 outline-none h-[48px] search"
                onClick={() => setpopUpSearch(true)}
                onChange={(e: any) => SetKey(e.target.value)}
              />
              {popUpSearch && <PopupSearch data={fetchData} tatPopup={tatPopup} />}
            </div>
          </div>
          <div className="flex gap-3">
            <div className="border rounded-full h-max w-max p-3 bg-BGICon hover:cursor-pointer hover:bg-slate-400">
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
            <div className="border rounded-full h-max w-max p-3 bg-BGICon hover:cursor-pointer hover:bg-slate-400">
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
            <div className="w-[47px] h-[47px]">
              <Image
                className="w-full h-full border rounded-full box-border"
                src={data?.avatar ? data.avatar : "/images/user.png"}
                width={50}
                height={40}
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