"use client";
import { useState } from "react";
import Image from "next/image";
import { FcLike } from "react-icons/fc";
import { AiOutlineLike } from "react-icons/ai";
import { AiFillLike } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { CiShare2 } from "react-icons/ci";
import { functions } from "../../functions/functions";
import { Images } from "../Image/Images";
import { useRouter } from "next/navigation";
import { FaEarthAsia } from "react-icons/fa6";
import { IoMdLock } from "react-icons/io";
import { FaUserFriends } from "react-icons/fa";
import { callApi_LikeNews } from "../../api/callAPI";

interface News {
    data: {
        id: number;
        userId: number;
        content: string;
        image: Array<string>;
        type_seen: number;
        avatar: string;
        name: string;
        updated_at: number;
        type_like: number;
        total_like: number;
        total_comment: number;
    },
    setIdNews: any;

}


const News: React.FC<News> = ({ data, setIdNews }) => {
    const myFunction = new functions();
    const router = useRouter();
    const [type_like, setType_like] = useState(data?.type_like);
    const [total_like, setTotal_like] = useState(data?.total_like);
    const handleLikeNews = async (id: number, type: number) => {
        if (type_like != 10 && type == 0) {
            setType_like(10)
            setTotal_like(prev => prev - 1)
        } else {
            setType_like(type + 2)
            setTotal_like(data?.total_like + 1)
        }
        await callApi_LikeNews({ news_id: id, type });
    }
    return (
        <div className="w-4/5 border rounded-xl h-max bg-white mt-5 pt-5 px-5 max-lg:w-full
        max-lg:m-0  max-lg:mt-5">
            <div className="flex gap-2">
                <div className="w-12 h-12 relative">
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
                <div>
                    <div onClick={() => router.push(`/Profile?id=${data.id}`)} className="font-medium hover:underline cursor-pointer">
                        {data.name}
                    </div>
                    <div className="text-xs mt-[-2px] text-[#8f8a8a] flex  items-center gap-2">{myFunction.TimeAgo(data?.updated_at)}
                        {data.type_seen == 1 && <FaEarthAsia className="w-3 h-3"></FaEarthAsia>}
                        {data.type_seen == 3 && <IoMdLock className="w-3 h-3"></IoMdLock>}
                        {data.type_seen == 2 && <FaUserFriends className="w-3 h-3"></FaUserFriends>}
                    </div>
                </div>
            </div>
            <div className="content mt-2">
                {data.content}
            </div>
            {
                data.image && data.image.length == 1 && <div
                    className="
                w-full
                h-[300px]
                relative
            ">
                    <Images link={data.image[0]}></Images>
                </div>
            }
            {
                data.image && data.image.length == 2 && <div className="flex">
                    <div className="w-1/2 h-[300px] relative">
                        <Images link={data.image[0]}></Images>
                    </div>
                    <div className="w-1/2 h-[300px] relative">
                        <Images link={data.image[1]}></Images>
                    </div>
                </div>
            }
            {
                data.image && data.image.length == 3 && <div className="flex flex-wrap">
                    <div className="w-1/2 h-[300px] relative">
                        <Images link={data.image[0]}></Images>
                    </div>
                    <div className="w-1/2 h-[300px] relative">
                        <Images link={data.image[1]}></Images>
                    </div>
                    <div className="w-full h-[300px] relative">
                        <Images link={data.image[2]}></Images>
                    </div>
                </div>
            }
            <div className="flex justify-between items-center">
                <div className="flex justify-start items-center mt-2">
                    {total_like > 0 && <>
                        <div>{total_like}</div>
                        <FcLike className="h-5 w-5"></FcLike>
                        <AiFillLike className="h-5 w-5 text-blue-500"></AiFillLike>
                    </>}
                </div>
                {data?.total_comment && <div className="text-gray-600 font-medium text-base">
                    {data.total_comment} bình luận
                </div>}
            </div>


            <div className="flex w-full border-t-2 justify-between px-10 max-lg:px-0">
                <div className="w-1/3 group relative">
                    <div className="flex group-hover:opacity-100 delay-500 opacity-0 z-50 absolute rounded-3xl max-w-[350px] bg-white border shadow-lg duration-200 ease-in-out translate-y-[0px] group-hover:translate-y-[-50px] max-h-12 items-center">
                        <div onClick={() => { handleLikeNews(data.id, 0) }} className="relative w-14 h-14 rounded-full border-0 hover:w-20 hover:h-20 hover:duration-300 hover:translate-y-[-20px] cursor-pointer">
                            <Image
                                alt="emotion"
                                src={'/images/2.gif'}
                                fill
                            ></Image>
                        </div>

                        <div onClick={() => { handleLikeNews(data.id, 1) }} className="relative w-14 h-14 rounded-full border-0 hover:w-20 hover:h-20 hover:duration-300 hover:translate-y-[-20px] cursor-pointer">
                            <Image
                                alt="emotion"
                                src={'/images/3.gif'}
                                fill
                            ></Image>
                        </div>

                        <div onClick={() => { handleLikeNews(data.id, 2) }} className="relative w-14 h-14 rounded-full border-0 hover:w-20 hover:h-20 hover:duration-300 hover:translate-y-[-20px] cursor-pointer">
                            <Image
                                alt="emotion"
                                src={'/images/4.gif'}
                                fill
                            ></Image>
                        </div>

                        <div onClick={() => { handleLikeNews(data.id, 3) }} className="relative w-14 h-14 rounded-full border-0 hover:w-20 hover:h-20 hover:duration-300 hover:translate-y-[-20px] cursor-pointer">
                            <Image
                                alt="emotion"
                                src={'/images/5.gif'}
                                fill
                            ></Image>
                        </div>

                        <div onClick={() => { handleLikeNews(data.id, 4) }} className="relative w-14 h-14 rounded-full border-0 hover:w-20 hover:h-20 hover:duration-300 hover:translate-y-[-20px] cursor-pointer">
                            <Image
                                alt="emotion"
                                src={'/images/6.gif'}
                                fill
                            ></Image>
                        </div>

                        <div onClick={() => { handleLikeNews(data.id, 5) }} className="relative w-14 h-14 rounded-full border-0 hover:w-20 hover:h-20 hover:duration-300 hover:translate-y-[-20px] cursor-pointer">
                            <Image
                                alt="emotion"
                                src={'/images/7.gif'}
                                fill
                            ></Image>
                        </div>

                    </div>
                    <div onClick={() => { handleLikeNews(data.id, 0) }} className="flex h-10 hover:bg-slate-200 border-0 rounded-xl py-2 cursor-pointer w-full min-w-max justify-center items-center gap-2 text-[#6a7079] relative z-[20]">
                        {
                            type_like == 10 && <>
                                <AiOutlineLike className="h-6 w-6 text-[#6a7079]"></AiOutlineLike>
                                <div className="text-lg min-w-max">Thích</div>
                            </>
                        }
                        {
                            type_like != 10 && <div className="flex justify-center items-center">
                                <div className="relative w-10 h-10">
                                    <Image
                                        alt="emotion"
                                        src={`/images/${type_like}.gif`}
                                        fill
                                    ></Image>

                                </div>
                                {type_like == 2 && <div className="font-semibold text-blue">Thích</div>}
                                {type_like == 3 && <div className="font-semibold text-pink-700">Yêu thích</div>}
                                {type_like == 4 && <div className="font-semibold text-yellow-400">Ha ha</div>}
                                {type_like == 5 && <div className="font-semibold text-yellow-400">Buồn</div>}
                                {type_like == 6 && <div className="font-semibold text-yellow-400">Ngạc nhiên</div>}
                                {type_like == 7 && <div className="font-semibold text-red-900">Phẫn nộ</div>}
                            </div>
                        }
                    </div>
                </div>
                <div className="relative z-20 flex justify-center min-w-max items-center hover:bg-slate-200 w-1/3 border-0 rounded-xl py-2 cursor-pointer gap-2 text-[#6a7079]"
                    onClick={() => setIdNews(data.id)}
                >
                    <FaRegComment className="h-6 w-6 text-[#6a7079]"></FaRegComment>
                    <div className="text-lg min-w-max">Bình luận</div>
                </div>
                <div className="flex justify-center min-w-max items-center hover:bg-slate-200 w-1/3 border-0 rounded-xl py-2 cursor-pointer gap-2 text-[#6a7079]">
                    <CiShare2 className="h-6 w-6"></CiShare2>
                    <div className="text-lg min-w-max">Chia sẻ</div>
                </div>
            </div>

        </div>
    );
}

export default News;