import Image from "next/image"
import { Carousel } from 'antd';
import { useEffect } from "react";

const GoiYBanBe = ({ friend_goiy }) => {
    console.log("🚀 ~ GoiYBanBe ~ friend_goiy:", friend_goiy)

    return (<>
        <div className={`w-4/5 mt-5 border rounded-xl h-max bg-white pt-5 px-5 max-lg:w-full
        max-lg:m-0 max-lg:mt-5`}>
            <div className="text-xl font-semibold text-gray-600">Gợi ý bạn bè</div>
            <div className="mt-2 mb-5 gap-2">
                <Carousel slidesToShow={3} slidesToScroll={2} arrows={true} >
                    {friend_goiy?.map((item: any) => (
                        <>
                            <div className="rounded-2xl shadow-xl p-2">
                                <div className="w-full h-48 relative">
                                    <Image
                                        alt='avatar'
                                        src={item.avatar ? item.avatar : "/images/emgai.jpg"}
                                        fill
                                        className="rounded-xl"
                                        onError={(e: any) => {
                                            e.target.onerror = null;
                                            e.target.setsrc = "/images/emgai.jpg";
                                        }}
                                    >

                                    </Image>
                                </div>
                                <div className="text-lg font-semibold ml-2">{item.name}</div>
                                <div className="flex gap-1 ml-2">
                                    {friend_goiy.avatar.map((item: any) => (
                                        <div key={item} className="w-5 h-5 relative">
                                            <Image
                                                alt="avatar"
                                                src={item}
                                                fill
                                                className="rounded-xl"
                                            >
                                            </Image>
                                        </div>
                                    ))}

                                    <div className="text-sm text-gray-600 font-semibold">{item.total} bạn chung</div>
                                </div>
                                <div className="flex justify-center rounded-2xl mt-2 p-2 bg-blue-50 text-blue-600 font-semibold cursor-pointer hover:bg-slate-200">Gửi lời mời</div>
                            </div>
                        </>
                    ))}
                </Carousel>
            </div>
        </div>
    </>)
}
export default GoiYBanBe