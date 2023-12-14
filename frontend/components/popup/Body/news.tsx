"use client";
import { useState } from "react";
import Image from "next/image";
import { FcLike } from "react-icons/fc";
import { AiOutlineLike } from "react-icons/ai";
import { AiFillLike } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { CiShare2 } from "react-icons/ci";

export default function News() {
    return (
        <div className="w-4/5 border rounded-xl h-max bg-white mt-5 p-5  max-lg:w-full
        max-lg:m-0  max-lg:mt-5">
            <div className="flex gap-2">
                <div className="w-10 h-10">
                    <Image
                        alt="avatar"
                        src={'/images/avatarChat.jpg'}
                        width={50}
                        height={40}
                        objectFit="cover"
                        quality={100}
                        className="w-full h-full border rounded-full"
                    ></Image>
                </div>
                <div>
                    <div className="font-medium">Nguyễn ngọc huyền</div>
                    <div className="text-xs mt-[-2px]">1 ngày</div>
                </div>
            </div>
            <div className="content mt-2">
                Xin chào mọi người ạ, em newbie về AWS, ôi.bie về AWS, mấy anh chị có thể cho em biết là lấy chứng chỉ AWS về Devops thì em nên lấy Devops Engineer cert hay solution architecture association cert ạ. Tại em không có tiền nhiều nên đủ tiền thi 1 trong 2 cert đó thôi.
            </div>
            <div
                className="
                w-full
                h-[300px]
                relative
            "> <Image
                    alt="avatar"
                    src={'/images/sogoku.jpg'}
                    fill={true}
                    // layout="fill"
                    object-fit="cover"
                    quality={100}
                    className="w-full h-full"
                >
                </Image>
            </div>
            <div className="flex justify-start items-center mt-2">
                <div>20</div>
                <FcLike className="h-5 w-5"></FcLike>
                <AiFillLike className="h-5 w-5 text-blue-500"></AiFillLike>
            </div>

            <div className="flex border-t-2 mt-2 justify-between px-10 max-lg:px-0">
                <div className="flex justify-center min-w-max items-center mt-2 hover:bg-slate-200 w-1/3 border-0 rounded-xl py-2 cursor-pointer">
                    <AiOutlineLike className="h-6 w-6"></AiOutlineLike>
                    <div className="text-lg min-w-max">Thích</div>
                </div>
                <div className="flex justify-center min-w-max items-center mt-2 hover:bg-slate-200 w-1/3 border-0 rounded-xl py-2 cursor-pointer">
                    <FaRegComment className="h-6 w-6"></FaRegComment>
                    <div className="text-lg min-w-max">Bình luận</div>
                </div>
                <div className="flex justify-center min-w-max items-center mt-2 hover:bg-slate-200 w-1/3 border-0 rounded-xl py-2 cursor-pointer">
                    <CiShare2 className="h-6 w-6"></CiShare2>
                    <div className="text-lg min-w-max">Chia sẻ</div>
                </div>
            </div>

        </div>
    );
}
