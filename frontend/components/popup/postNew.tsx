import Image from "next/image";
import avatar from "../../public/images/avatar.jpg";
import { ImCancelCircle } from "react-icons/im";
import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload, message } from 'antd';
import { useState } from "react";
import { callApi_PostNews } from "../../api/callAPI";
import { useForm, SubmitHandler } from "react-hook-form"
import { useRef } from "react";
import { useMyContext } from "../context/context";
import FormData from 'form-data';
import Cookies from "js-cookie";
import axios from "axios";

interface Popup {
  SetPopUpPostNew: any
}

type Inputs = {
  example: string
  exampleRequired: string,
  type_seen: number
}

const PopupPostNew: React.FC<Popup> = ({ SetPopUpPostNew }) => {
  const [fileList, setFileList] = useState([]);
  const { SetContentNotifi } = useMyContext()
  const ref_content = useRef<any>();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>()

  const handleChange = ({ fileList }) => {
    if (fileList.length < 4) {
      setFileList(fileList);
    }
  };

  const handleBeforeUpload = file => {
    if (fileList.length < 3) {
      setFileList([...fileList, file]);
    } else {
      SetContentNotifi("Tải lên tối đa không quá 5 ảnh!")
    }
    return false;
  };

  const handleRemove = file => {
    const removeFile = fileList.filter(item => item.uid !== file.uid);
    setFileList(removeFile);
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (ref_content.current && ref_content.current.innerHTML != '') {
      const formData = new FormData();
      formData.append('content', ref_content.current.innerHTML)
      formData.append('type_seen', Number(data.type_seen))
      fileList.map(item => (
        formData.append('files', item.originFileObj)
      ))

      const token = Cookies.get('token')
      const response: any = await axios({
        method: 'post',
        url: `${process.env.NEXT_PUBLIC_DOMAIN_API}/news/PostNews`,
        data: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.data.result == true) {
        SetContentNotifi("Đăng tin thành công!")
        SetPopUpPostNew(false)
      }{
        SetContentNotifi("Đăng bài thất bại, vui lòng đợi chúng tôi kiểm tra")
      }
    } else {
      SetContentNotifi("Bạn cần điền nội dung cho bài viết!")
    }
  }

  return (
    <>
      <div className="absolute w-full h-screen bg-BGRegister top-[75px] left-0 z-50  ">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full h-full flex justify-center">
          <div className="
        border
        rounded-2xl
        bg-white
        w-full
        lg:w-[40%]
        lg:h-[65%]
        lg:mt-10
        ">
            <div className="w-full text-center relative">
              <h2 className="
            text-2xl 
            font-bold 
            text-center
            ">Tạo bài viết</h2>
              <div className="
            w-8 
            h-8
             bg-BGICon 
             border 
             rounded-full 
             cursor-pointer 
             right-2 
             top-1 
             absolute" onClick={() => SetPopUpPostNew(false)}>
                <ImCancelCircle className="w-full h-full text-gray-400" />
              </div>
            </div>
            <div className="
          px-5 
          pt-5 
          flex 
          items-start 
          font-semibold 
          gap-2
          ">
              <div className="
            w-12 
            h-12
            ">
                <Image
                  alt="avatar"
                  src={avatar}
                  className="w-full h-full border rounded-full"
                ></Image>
              </div>
              <div>
                <span className="block">Nguyễn Cường</span>
                <select className="text-xs border rounded-2xl bg-BGICon outline-none" {...register("type_seen")}>
                  <option className="text-xs border rounded-2xl" value={1}>Bạn bè</option>
                  <option className="text-xs border rounded-2xl" value={2}>
                    Công khai
                  </option>
                  <option className="text-xs border rounded-2xl" value={3}>
                    Chỉ mình tôi
                  </option>
                </select>
              </div>
            </div>
            <div className="h-[40%] w-full overflow-y-auto mt-2">
              <div
                aria-label="Cường ơi, bạn đang nghĩ gì thế?"
                data-text="Cường ơi, bạn đang nghĩ gì thế?"
                className="w-full h-1/6 px-5 text-2xl outline-none empty:before:content-[attr(data-text)] text-gray-500 "
                autoFocus
                contentEditable="true"
                role="textbox"
                data-lexical-editor="true"
                ref={ref_content}
              ></div>
            </div>
            <div className="px-5 w-full h-28 overflow-auto">
              <Upload
                listType="picture"
                className="w-full"
                beforeUpload={handleBeforeUpload}
                onChange={handleChange}
                onRemove={handleRemove}
              >
                <Button icon={<UploadOutlined />} className="w-full">Tải lên ảnh cho bài viết</Button>
              </Upload>
            </div>
            <div className="px-5 w-full">
              <div className="addMyNew border rounded-md bg-blue-600 w-full mt-2 flex justify-center items-center px-5 py-2 hover:bg-blue-400 cursor-pointer">
                <button type="submit" className="text-xl w-full  font-semibold text-white">Đăng</button>
              </div>
            </div>
          </div>
        </form >
      </div>
    </>
  );
}

export default PopupPostNew