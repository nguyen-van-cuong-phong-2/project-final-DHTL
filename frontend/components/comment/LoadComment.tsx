/* eslint-disable react/jsx-key */
import Image from "next/image"
import { functions } from "../../functions/functions";
import WriteComment from "./writeComment";
import { useMyContext } from "../context/context";
import React from "react";
import { BiSolidLike } from "react-icons/bi";
import { callApi_LikeComment } from "../../api/callAPI";

interface Comment {
    data: any,
    setCallAPI: any
}
const LoadComment: React.FC<Comment> = ({ data, setCallAPI }) => {
    const myFunction = new functions();
    const { comment, setComment } = useMyContext();
    const handleLikeComment = async (id: number) => {
        const response = await callApi_LikeComment({ news_id: data.news_id, type: 0, comment_id: id });
        if (response.result == true) {
            setCallAPI((prev: boolean) => (!prev))
        }
    }
    return (
        <>
            <div className="w-full h-full flex gap-2 items-start mt-10 flex-wrap relative">
                <div className="relative w-10 h-10">
                    <Image
                        alt="avatar"
                        src={data?.avatar ? data?.avatar : "/images/user.png"}
                        className="rounded-full"
                        fill
                        onError={(e: any) => {
                            e.target.onerror = null;
                            e.target.setsrc = "/images/user.png";
                        }}
                    ></Image>
                </div>
                <div className="bg-[#f0f2f5] p-2 rounded-2xl max-w-[90%] max-md:max-w-[80%] relative z-0">
                    <div className="text-base font-semibold">{data?.name}</div>
                    <div className="text-base w-full break-words">{data?.content}</div>
                    <div className="flex gap-2 w-60 absolute bottom-[-20px]">
                        <div className="text-sm font-semibold cursor-pointer hover:underline" onClick={() => handleLikeComment(data.id)}>
                            {data.my_like == 1 ? <span className="text-blue">Đã thích</span> : <span>Thích</span>}
                        </div>
                        <div className="text-sm font-semibold cursor-pointer hover:underline" onClick={() => setComment({
                            parent_id: data.id,
                            content: `Trả lời bình luận của ${data.name}`
                        })}>
                            Phản hồi
                        </div>
                        <div className="text-xs mt-[2px] font-normal">
                            {myFunction.TimeAgo(data?.created_at)}
                        </div>
                        {data.total_like > 0 && <div className="flex justify-center items-center gap-1">
                            <div>{data.total_like}</div>
                            <BiSolidLike className="text-blue-600"></BiSolidLike>
                        </div>}
                    </div>
                    {
                        data.image && <div>
                            <Image
                                alt="image"
                                src={data.image}
                                width={350}
                                height={350}
                            >
                            </Image>
                        </div>
                    }

                </div>

                {
                    data?.comment_child?.map((item: any) => (
                        <div className="flex gap-2 w-full max-md:w-full z-0 mt-5 ml-12  flex-wrap">
                            <div className="relative w-10 h-10">
                                <Image
                                    alt="avatar"
                                    src={item?.avatar ? item?.avatar : "/images/user.png"}
                                    className="rounded-full"
                                    fill
                                    onError={(e: any) => {
                                        e.target.onerror = null;
                                        e.target.setsrc = "/images/user.png";
                                    }}
                                ></Image>
                            </div>
                            <div className="bg-[#f0f2f5] p-2 rounded-2xl max-w-[90%] max-md:max-w-[80%] relative">
                                <div className="text-base font-semibold">{item.name}</div>
                                <div className="text-base break-words">{item.content}</div>
                                <div className="flex gap-2 w-60 absolute bottom-[-20px]">
                                    <div className="text-sm font-semibold cursor-pointer hover:underline" onClick={() => handleLikeComment(item.id)}>
                                        {item.my_like == 1 ? <span className="text-blue">Đã thích</span> : <span>Thích</span>}
                                    </div>
                                    <div className="text-sm font-semibold cursor-pointer hover:underline"
                                        onClick={() => setComment({
                                            parent_id: data.id,
                                            content: `Trả lời bình luận của ${item.name}`
                                        })}>
                                        Phản hồi
                                    </div>
                                    <div className="text-xs mt-[2px] font-normal">
                                        {myFunction.TimeAgo(item?.created_at)}
                                    </div>
                                    {item.total_like > 0 && <div className="flex justify-center items-center gap-1">
                                        <div>{item.total_like}</div>
                                        <BiSolidLike className="text-blue-600"></BiSolidLike>
                                    </div>}
                                </div>
                                {
                                    item?.images && <div>
                                        <Image
                                            alt="image"
                                            src={item?.images}
                                            width={300}
                                            height={200}
                                        >
                                        </Image>
                                    </div>
                                }
                            </div>

                        </div>
                    ))
                }
            </div>
        </>
    )
}

export default LoadComment