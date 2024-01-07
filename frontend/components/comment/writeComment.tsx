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

interface Comment {
    setCallAPI: any;
    id: number;
    data: any;
}


const WriteComment: React.FC<Comment> = ({ setCallAPI, id, data }) => {
    const ref_content = useRef<any>();

    const { SetContentNotifi, comment } = useMyContext()

    const { register, handleSubmit, watch, formState: { errors }, } = useForm<Inputs>();

    const [file, setFile] = useState<any>([]);

    const handleChange = ({ fileList }) => {
        if (fileList.length < 2) {
            setFile([...fileList]);
        }
    };

    const handleBeforeUpload = file => {
        setFile([...file]);
        return false;
    };
    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        if (ref_content.current && ref_content.current.innerHTML != '') {
            const formData = new FormData();
            formData.append('content', ref_content.current.innerHTML)
            formData.append('parent_id', comment.parent_id)
            formData.append('news_id', id.toString())
            if (file[0]) formData.append('file', file[0].originFileObj)
            const token = Cookies.get('token')
            await axios({
                method: 'post',
                url: `${process.env.NEXT_PUBLIC_DOMAIN_API}/news/Comment`,
                data: formData,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            setCallAPI((prev: boolean) => (!prev))
            ref_content.current.innerHTML = "";
            setFile([])
        } else {
            SetContentNotifi("Bạn cần điền nội dung cho bình luận!")
        }
    }
    return (
        <>
            <div className="w-full h-full p-2">
                <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2 w-full">
                    <div className="w-10 h-10 relative">
                        <Image
                            alt="avatart"
                            src={data?.avatar ? data?.avatar : "/images/user.png"}
                            objectFit="cover"
                            className="rounded-full"
                            fill
                            onError={(e: any) => {
                                e.target.onerror = null;
                                e.target.setsrc = "/images/user.png";
                            }}
                        ></Image>
                    </div>
                    <div className="bg-BGICon rounded-2xl w-[90%] max-w-[90%] py-1 relative ">
                        <div
                            aria-label={comment.content}
                            data-text={comment.content}
                            className={`w-full  px-5 text-sm outline-none empty:before:content-[attr(data-text)]  empty:before:text-gray-400 `}
                            autoFocus
                            contentEditable="true"
                            role="textbox"
                            data-lexical-editor="true"
                            ref={ref_content}
                        ></div>
                        <div className="px-5 w-full flex">
                            <Upload
                                listType="picture"
                                className="w-full"
                                beforeUpload={handleBeforeUpload}
                                onChange={handleChange}
                                fileList={file}
                            >
                                <Button icon={<UploadOutlined />} className="w-full"></Button>
                            </Upload>
                            <div className="flex justify-center items-center cursor-pointer" >
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