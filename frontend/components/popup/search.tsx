/* eslint-disable react/jsx-key */
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
interface PopUpSearch {
  data: [{
    id: number,
    avatar: string,
    name: string,
  }],
  tatPopup: any
}


const PopUpSearch: React.FC<PopUpSearch> = ({ data, tatPopup }) => {
  useEffect(() => {
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  const containerRef = useRef(null);

  const handleClickOutside = (event: any) => {
    if (containerRef.current && !containerRef.current.contains(event.target) && !event.target.className.includes('search')) {
      tatPopup();
    }
  };
  // console.log(data)
  return (
    <>
      <div className={`absolute border rounded-md overflow-auto bg-white h-[500px] md:w-[500px] mt-2 z-50 p-2 shadow-lg max-sm:w-[300px]`} ref={containerRef}>
        {data?.map(item => (
          <div className="pb-1">
            <div className="flex items-center justify-between cursor-pointer hover:bg-slate-300 hover:rounded-md py-3">
              <div className="flex gap-2 items-center max-w-[60%] overflow-hidden justify-end">
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
                  <div className="text-xs">Bạn bè</div>
                </div>
              </div>
              <div className="border rounded-xl bg-blue-600  px-2 text-white cursor-pointer hover:bg-slate-400">thêm bạn bè</div>
            </div>
          </div>
        ))}


      </div>
    </>
  );
}

export default PopUpSearch