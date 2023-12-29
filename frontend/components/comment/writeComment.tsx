import { Button, Upload } from "antd";
import Image from "next/image"
import { useRef, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { UploadOutlined } from '@ant-design/icons';
import Cookies from "js-cookie";
import axios from "axios";
import { useMyContext } from "../context/context";
import { IoMdSend } from "react-icons/io";


type Inputs = {
    example: string
    exampleRequired: string,
    type_seen: number
}

const WriteComment = () => {
    const ref_content = useRef<any>();
    const { SetContentNotifi } = useMyContext()

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<Inputs>();
    const [file, setFile] = useState<any>();

    const handleChange = ({ fileList }) => {
        setFile(fileList);
    };


    const handleBeforeUpload = file => {
        setFile(file);
        return false;
    };
    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        if (ref_content.current && ref_content.current.innerHTML != '') {
            const formData = new FormData();
            formData.append('content', ref_content.current.innerHTML)
            formData.append('parent_id', '0')
            formData.append('news_id', '6')
            if (file) formData.append('file', file.originFileObj)
            const token = Cookies.get('token')
            const response: any = await axios({
                method: 'post',
                url: `${process.env.NEXT_PUBLIC_DOMAIN_API}/news/Comment`,
                data: formData,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            console.log("🚀 ~ file: writeComment.tsx:53 ~ constonSubmit:SubmitHandler<Inputs>= ~ response:", response)
        } else {
            SetContentNotifi("Bạn cần điền nội dung cho bài viết!")
        }
    }
    return (
        <>
            <div className="w-full h-full p-2">
                <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2 w-full">
                    <div className="w-10 h-10 relative">
                        <Image
                            alt="avatart"
                            src={'/images/avatar.jpg'}
                            className="rounded-full"
                            fill
                        ></Image>
                    </div>
                    <div className="bg-BGICon rounded-2xl w-[90%] max-w-[90%] py-1 relative">
                        <div
                            aria-label="Viết bình luận..."
                            data-text="Viết bình luận..."
                            className="w-full h-1/6 px-5  text-sm outline-none empty:before:content-[attr(data-text)] text-black "
                            autoFocus
                            contentEditable="true"
                            role="textbox"
                            data-lexical-editor="true"
                            ref={ref_content}
                        ></div>
                        <div className="px-5 w-full mt-5 flex">
                            <Upload
                                listType="picture"
                                className="w-full"
                                beforeUpload={handleBeforeUpload}
                                onChange={handleChange}
                            >
                                <Button icon={<UploadOutlined />} className="w-full"></Button>
                            </Upload>
                            <div className="flex justify-end cursor-pointer" >
                                <button type="submit"> <IoMdSend className="text-blue-600 text-2xl" /></button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

        </>
    )
}
export default WriteComment