'use client'
import Image from "next/image";
import News from "../Body/news"
import Anh from "./anh";
import BanBe from "./banbe";
import { useMyContext } from "../context/context";
import Comment from "../popup/comment";
import { useEffect, useState } from "react";
import { callApi_GetDataProfile } from "../../api/callAPI";
const Main = ({ news, data, id }) => {
    const { profileChoose, setProfileChoose } = useMyContext()
    const [idNews, setIdNews] = useState<number>(0);
    const [response, setReponse] = useState<any>([]);
    useEffect(() => {
        const callAPI = async () => {
            const data = await callApi_GetDataProfile({ id: id })
            setReponse(data.data)
        }
        callAPI()
    }, [])

    if (response.image && response.image.length > 0) {
        var image = response.image.slice(0, 6)
    }
    if (response.list_friends && response.list_friends.length > 0) {
        var list_friends = response.list_friends.slice(0, 6)
    }
    return (<>
        <div className="border-t-2 w-[70%] max-xl:w-full max-lg:mt-10 ">
            {profileChoose == 1 && <div className="flex gap-7 flex-wrap">
                <div className="lg:w-[40%]  max-lg:w-full">
                    <div className="rounded-2xl bg-white p-2 max-lg:h-[60%]">
                        <div className="flex justify-between items-center">
                            <div className=" font-bold text-xl">
                                Ảnh
                            </div>
                            <div className="text-blue-500 hover:underline cursor-pointer" onClick={() => setProfileChoose(3)}>
                                Xem tất cả ảnh
                            </div>
                        </div>
                        <div className="flex gap-2 justify-between mt-2 flex-wrap max-lg:h-20">
                            {image?.map((item: any, index: number) => (
                                <div key={item} className="relative w-[32%] h-32 max-lg:w-[30%] ">
                                    <Image
                                        className="w-full h-full rounded-xl"
                                        src={item}
                                        objectFit="cover"
                                        fill={true}
                                        quality={100}
                                        alt="avatar"
                                        onError={(e: any) => {
                                            e.target.onerror = null;
                                            e.target.setsrc = "/images/user.png";
                                        }}></Image>
                                </div>
                            ))}
                            {image?.length === 0 && <div className="h-20 w-full flex justify-center items-center font-normal text-xl text-gray-500">Không có ảnh</div>}
                        </div>
                    </div>
                    <div className="rounded-2xl bg-white p-2 mt-2  max-lg:w-full max-lg:h-[73%]" >
                        <div className="flex justify-between">
                            <div>
                                <div className=" font-bold text-xl">
                                    Bạn bè
                                </div>
                                <div className="font-normal text-sm text-gray-500">{response?.list_friends ? response?.list_friends.length : 0} người bạn</div>
                            </div>

                            <div className="text-blue-500 hover:underline cursor-pointer" onClick={() => setProfileChoose(2)}>
                                Xem tất cả bạn bè
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {list_friends?.map((item: any, index: number) => (
                                <div key={item} className="w-[32%] h-40 ">
                                    <div className="relative w-full h-[80%] rounded-2xl">
                                        <Image
                                            className="w-full h-full rounded-xl"
                                            src={item.avatar ? item.avatar : "/images/user.png"}
                                            objectFit="cover"
                                            fill={true}
                                            quality={100}
                                            alt="avatar"
                                            onError={(e: any) => {
                                                e.target.onerror = null;
                                                e.target.setsrc = "/images/user.png";
                                            }}></Image>
                                    </div>
                                    <div className="text-left font-medium text-sm">{item.name}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="w-[58%] xl:w-[57%] max-lg:w-full max-lg:mt-24">
                    <div className="w-full  rounded-2xl bg-white p-2 font-bold text-xl">
                        Bài viết
                    </div>
                    <div className="w-full rounded-2xl bg-white relative">
                        {response?.news?.map((item: any) => (
                            <News key={item.id} data={item} setIdNews={setIdNews} profile={true}></News>
                        ))}

                        {response?.news?.length == 0 && <div className="h-20 w-full mt-2 flex justify-center items-center font-normal text-xl text-gray-500">Chưa đăng bài viết nào</div>}

                    </div>
                </div>
            </div>}
            {profileChoose == 2 && <BanBe response={response}></BanBe>}
            {profileChoose == 3 && <Anh response={response}></Anh>}
            {idNews !== 0 && <Comment id={idNews} dataUser={data} setIdNews={setIdNews}></Comment>}
        </div>
    </>)
}
export default Main