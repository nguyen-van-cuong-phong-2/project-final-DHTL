/* eslint-disable react/jsx-key */
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { callApi_MakeFriend, callApi_cancelMakeFriend } from "../../api/callAPI";
import { useMyContext } from "../context/context";
import { functions } from "../../functions/functions";

interface PopUpSearch {
  data: [{
    id: number,
    avatar: string,
    name: string,
    makefriend: number
  }],
  tatPopup: any,
  fecth_API_Search: any
}


const PopUpSearch: React.FC<PopUpSearch> = ({ data, tatPopup, fecth_API_Search }) => {

  const { SetContentNotifi, setLoading, socket } = useMyContext();

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  const containerRef = useRef(null);

  const handleClickOutside = (event: any) => {
    if (containerRef.current && !containerRef.current.contains(event.target) && !event?.target?.className?.includes('search')) {
      tatPopup();
    }
  };

  const them_ban_be = async (id: number) => {
    const response = await callApi_MakeFriend({ receiver_id: id });
    if (response.result === true) {
      fecth_API_Search();
      SetContentNotifi("Gửi yêu cầu thành công");
      const user = new functions().getInfoFromToken();
      socket.emit('sendNotification', {
        sender_id: user.id,
        receiver_id: id,
        type: 1
      })
    } else {
      SetContentNotifi("Thêm bạn bè thất bại, vui lòng thử lại sau!")
    }
  }

  const huy_loi_moi = async (id: number) => {
    const response = await callApi_cancelMakeFriend({ receiver_id: id });
    if (response.result === true) {
      fecth_API_Search();
      SetContentNotifi("Huỷ lời mời thành công")
    } else {
      SetContentNotifi("Huỷ lời mời thất bại, vui lòng thử lại sau!")
    }
  }

  const router = useRouter();
  return (
    <>
      <div className={`absolute border rounded-md overflow-auto bg-white h-[500px] md:w-[500px] mt-2 z-50 p-2 shadow-lg max-sm:w-[300px]`} ref={containerRef}>
        {data?.map(item => (
          <div className="pb-1">
            <div className="flex items-center justify-between cursor-pointer hover:bg-slate-300 hover:rounded-md py-3"

            >
              <div className="flex gap-2 items-center max-w-[60%] overflow-hidden justify-end"
                onClick={() => router.push(`/Profile?id=${item.id}`)}
              >
                <div className="w-10 h-10">
                  <Image
                    className="w-full h-full border rounded-full box-border"
                    src={item?.avatar ? item?.avatar : "/images/user.png"}
                    width={300}
                    height={300}
                    quality={100}
                    alt="avatar"
                    onError={(e: any) => {
                      e.target.onerror = null;
                      e.target.setsrc = "/images/user.png";
                    }}
                  ></Image>
                </div>
                <div>
                  <div className="font-semibold max-w-[200px]">{item.name}</div>
                  {item.makefriend == 2 && <div className="text-xs">Bạn bè</div>}
                </div>
              </div>
              {
                item.makefriend == 0 && <div className="border rounded-xl bg-blue-600  px-2 text-white cursor-pointer hover:bg-slate-400"
                  onClick={() => them_ban_be(item.id)}
                >thêm bạn bè</div>
              }
              {
                item.makefriend == 1 && <div className="border rounded-xl bg-gray-600  px-2 text-white cursor-pointer hover:bg-slate-400"

                  onClick={() => huy_loi_moi(item.id)}
                >Huỷ lời mời</div>
              }
            </div>
          </div>
        ))}


      </div>
    </>
  );
}

export default PopUpSearch