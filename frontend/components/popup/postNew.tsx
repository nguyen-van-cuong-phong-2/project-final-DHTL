import Image from "next/image";
import avatar from "../../public/images/avatar.jpg";
import { IoImagesOutline } from "react-icons/io5";
import { LiaUserTagSolid } from "react-icons/lia";
import { ImCancelCircle } from "react-icons/im";

interface Popup {
  SetPopUpPostNew: any
}

const PopupPostNew: React.FC<Popup> = ({ SetPopUpPostNew }) => {
  return (
    <>
      <div className="absolute w-full h-screen bg-BGRegister top-[75px] left-0 z-50">
        <div className="border rounded-2xl bg-white max-md:w-[80%] h-[60%] absolute lg:top-20 lg:left-[25%] max-sm:w-full max-sm:left-0 max-sm:h-full max-sm:top-0 sm:w-[80%] sm:left-20 sm:h-[60%] lg:w-[50%] xl:w-[30%] xl:left-[35%] max-sm:overflow-hidden">
          <div className="border-y-2 w-full h-1/6 rounded-md flex items-center max-sm:h-[10%] md:h-[10%]">
            <div className="w-[60%] h-full flex justify-end items-center max-sm:w-[70%] ">
              <h2 className="text-2xl font-bold">Tạo bài viết</h2>
            </div>
            <div className="w-[40%] h-full flex justify-end items-center">
              <div className="w-8 h-8 mt-2 bg-BGICon border rounded-full mr-5 cursor-pointer" onClick={() => SetPopUpPostNew(false)}>
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
                  <div className="w-[30px] h-full relative cursor-pointer">
                    <IoImagesOutline className="w-full h-full cursor-pointer"></IoImagesOutline>
                    <input type="file" className="absolute top-3 z-50 opacity-0" />
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

export default PopupPostNew