import Image from "next/image";
import avatar from "../../public/images/avatar.jpg";
import { IoImagesOutline } from "react-icons/io5";
import { LiaUserTagSolid } from "react-icons/lia";
import { ImCancelCircle } from "react-icons/im";

export default function PopupPostNew() {
  return (
    <>
      <div className="absolute w-full h-screen bg-BGRegister top-[75px] ">
        <div className="border rounded-2xl bg-white w-1/3 h-[60%] absolute top-20 left-1/3">
          <div className="border-y-2 w-full h-1/6 rounded-md flex items-center">
            <div className="w-[60%] h-full flex justify-end items-center">
              <h2 className="text-2xl font-bold">Tạo bài viết</h2>
            </div>
            <div className="w-[40%] h-full flex justify-end items-center">
              <div className="w-8 h-8 mt-2 bg-BGICon border rounded-full mr-5">
                <ImCancelCircle className="w-full h-full text-gray-400" />
              </div>
            </div>
          </div>
          <div className="px-5 pt-5 flex items-start font-semibold gap-2">
            <div className="w-12 h-12">
              <Image
                alt="avatar"
                src={avatar}
                className="w-full h-full border rounded-full"
              ></Image>
            </div>
            <div>
              <span className="block">Nguyễn Cường</span>
              <select className="text-xs border rounded-2xl bg-BGICon outline-none">
                <option className="text-xs border rounded-2xl">Bạn bè</option>
                <option className="text-xs border rounded-2xl">
                  Công khai
                </option>
                <option className="text-xs border rounded-2xl">
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
            ></div>
          </div>
          <div className="px-5 w-full h-[13%]">
            <div className="addMyNew border flex rounded-md bg-BGICon h-full items-center px-3 justify-between">
              <span>Thêm vào bài viết của bạn</span>
              <div className="w-[70px] h-[60px]">
                <div className="w-full h-full mt-1 flex gap-2">
                  <div className="w-[30px] h-full">
                    <IoImagesOutline className="w-full h-full"></IoImagesOutline>
                  </div>
                  <div className="w-[30px] h-full">
                    <LiaUserTagSolid className="w-full h-full"></LiaUserTagSolid>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="px-5 w-full h-[8%]">
            <div className="addMyNew border rounded-md bg-blue-600 h-full w-full mt-2 flex justify-center items-center p-5">
              <span className="text-xl font-semibold text-white">Đăng</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
