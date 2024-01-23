'use client'
import { functions } from '../../functions/functions'
import ModelPostReels from '../../components/popup/ModelPostReels'
import Clip from '../../components/reels/Clip';
import Image from 'next/image';
import { MdCancel } from "react-icons/md";
import Link from 'next/link';
import { RiVideoUploadLine } from "react-icons/ri";
import { useState } from 'react';
import { GoUnmute } from "react-icons/go";
import { GoMute } from "react-icons/go";

const Componentt = ({ name, avatar, created_at, setMute, mute }) => {
    const fnc = new functions();
    return (
        <div className='flex gap-2 ml-10 max-md:ml-[-15px]'>
            <div className='w-10 h-10 relative ml-[55px]'>
                <Image
                    className="border rounded-full box-border"
                    src={avatar ? avatar : "/images/user.png"}
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
            <div className='text-white relative'>
                <div>
                    {name}
                </div>
                <div className='text-xs'>
                    {fnc.TimeAgo(created_at)}
                </div>
            </div>
            <div className='absolute text-white right-28 cursor-pointer z-[9999] max-sm:right-12' onClick={() => setMute(prev => !prev)}>
                {mute ? <GoUnmute className='text-2xl mt-2'></GoUnmute> : <GoMute className='text-2xl mt-2'></GoMute>}
            </div>
        </div>
    )
}

export default function Index() {
    const [dataUser, setDataUser] = useState<any>();
    const [showModal, setShowModal] = useState(false);
    const [mute, setMute] = useState(true);

    return (<>
        <div className='flex w-screen h-screen m-0 gap-8 bg-black flex-col relative '>
            <div className='absolute left-[30%] max-lg:left-[5%]  max-lg:top-16 max-sm:top-[0px]'>
                <Componentt mute={mute} name={dataUser?.name} avatar={dataUser?.avatar} created_at={dataUser?.created_at} setMute={setMute}></Componentt>
                <Clip setDataUser={setDataUser} mute={mute}></Clip>
            </div>

            <div className='absolute top-0 left-32 max-lg:right-0 flex gap-2 items-center mt-2 max-lg:left-[0] max-sm:mt-[-5px]'>
                <Link href={'/'} className='flex gap-2 items-center'>
                    <MdCancel className='text-white text-5xl'></MdCancel>
                    <div className="border rounded-full h-max w-max px-5 py-3 bg-blue-600 box-border cursor-pointer  max-sm:hidden">
                        <p className="text-white text-1xl font-bold">B</p>
                    </div>
                </Link>
                <div className='text-white text-3xl font-bold  max-sm:hidden'>Reels</div>
            </div>
            <div className='absolute top-0 right-10 bg-[#e4e6eb] max-sm:hidden flex items-center gap-1 mt-2 rounded-2xl p-2 font-medium cursor-pointer' onClick={() => setShowModal(true)}>
                <RiVideoUploadLine></RiVideoUploadLine>
                Tạo thước phim
            </div>
            <ModelPostReels showModal={showModal} setShowModal={setShowModal}></ModelPostReels>
        </div>
    </>)
}


