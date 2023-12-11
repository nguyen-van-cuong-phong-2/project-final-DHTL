"use client";
import Image from 'next/image';
import { BsCloudUpload } from "react-icons/bs";
import { useState } from 'react';
import { Button } from 'antd';
import { callApi_uploadAvatar } from '../../api/callAPI';
import { useMyContext } from '../../components/context/context';
import { useRouter } from 'next/navigation';

export default function UploadAvatar() {
    const [avatar, SetAvatar] = useState();
    const { SetContentNotifi, setLoading } = useMyContext();
    const router = useRouter()
    const [fileAvatar, setfileAvatar] = useState();
    const handleChangeFile = (e) => {
        const file = e.target.files[0];
        setfileAvatar(file);
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                SetAvatar(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        const response = await callApi_uploadAvatar({ file: fileAvatar })
        if (response.status == 200) {
            setLoading(true);
            router.push('/')
        }
    }
    return (
        <div className="w-full h-screen text-center flex justify-center items-center flex-col gap-10">
            <h1 className="text-2xl font-medium">Cập nhật avatar cho tài khoản của bạn</h1>
            <div className='w-40 h-40 border rounded-full '>
                <Image alt="avatar" src={avatar ? avatar : "/images/user.png"} width={300} height={300} objectFit='contain' className='w-full h-full border rounded-full'></Image>
            </div>
            <div className='w-48 h-8 bg-slate-100 relative cursor-pointer border rounded-xl px-20'>
                <input type='file' className='opacity-0 w-full h-full z-50 absolute left-0 cursor-pointer' onChange={handleChangeFile}>
                </input>
                <div className='absolute top-1 left-4 flex cursor-pointer '>
                    <BsCloudUpload className='mt-[7px]'></BsCloudUpload>
                    <p >Tải lên avatar của bạn</p>
                </div>
            </div>
            <Button className={`px-5 py-5 flex justify-center items-center text-xl font-semibold  ${avatar ? "bg-green-500 text-white" : "hidden"}`}
                onClick={() => handleSubmit()}
            >Xác Nhận</Button>
        </div >
    )
}
