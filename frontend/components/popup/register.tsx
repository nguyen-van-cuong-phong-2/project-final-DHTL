/* eslint-disable react/jsx-key */
const arrDate = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24, 25, 26, 27, 28, 29, 30, 31,
];
const arrMonth = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
let arrYear: number[] = [];
for (
  let i = new Date().getFullYear();
  i > new Date().getFullYear() - 100;
  i--
) {
  arrYear.push(i);
}

interface registerPopup {
  tatPopup: any;
}
import { AiFillQuestionCircle } from "react-icons/ai";
import { MdOutlineCancel } from "react-icons/md";
const registerPopup: React.FC<registerPopup> = ({tatPopup}) => {
  
  return (
    <>
      <div className="w-full h-full z-40  bg-BGRegister absolute top-0">
        <div className="w-4/12 z-50 h-max absolute bg-white shadow-md top-12 left-1/3 border rounded px-5 pt-3 pb-5">
          <div className="border-b-2 pb-5 border-gray-500 relative">
            <div className="flex items-center justify-between">
              <span className="text-4xl font-bold">Đăng ký</span>
              <MdOutlineCancel className="mt-2 text-3xl hover:cursor-pointer" onClick={()=>{tatPopup(false)}}></MdOutlineCancel>
            </div>
            <br />
            <span className="text-slate-500 absolute top-12">
              Nhanh chóng và dễ dàng.
            </span>
          </div>

          <div className="mt-5 flex flex-wrap w-full gap-2 ">
            <input
              className="h-[50px] border-2 rounded w-[230px] pl-5 bg-slate-100"
              type="text"
              placeholder="Họ"
            />
            <input
              className="h-[50px] border-2 rounded w-[231px] pl-5 bg-slate-100"
              type="text"
              placeholder="Tên"
            />
            <input
              className="h-[50px] border-2 rounded w-full pl-5 bg-slate-100"
              type="text"
              placeholder="Số di động hoặc email"
            />
            <input
              className=" h-[50px] border-2 rounded w-full pl-5 bg-slate-100"
              type="password"
              placeholder="Mật khẩu mới"
            />
            <div className="w-full flex">
              {" "}
              <label>Ngày sinh</label>
              &nbsp;
              <AiFillQuestionCircle className="mt-[5px]"></AiFillQuestionCircle>
            </div>

            <select className=" border-2 rounded w-[149px] h-[50px]">
              {arrDate.map((item) => (
                <option value={item}>{item}</option>
              ))}
            </select>

            <select className="border-2 rounded w-[149px] h-[50px]">
              {arrMonth.map((item) => (
                <option value={item}>Tháng {item} </option>
              ))}
            </select>
            <select className="border-2 rounded w-[150px] h-[50px]">
              {arrYear.map((item) => (
                <option value={item}> {item} </option>
              ))}
            </select>
            <div className="w-full flex">
              {" "}
              <label>Giới tính</label>
              &nbsp;
              <AiFillQuestionCircle className="mt-[5px]"></AiFillQuestionCircle>
            </div>
            <span className="border-2 rounded w-[228px] h-[50px] flex justify-between items-center p-5">
              <label>Nữ</label>
              <input type="radio" className="text-8xl" name="sex" />
            </span>
            <div className="border-2 rounded w-[228px] h-[50px] flex justify-between items-center p-5">
              <label>Nam</label>
              <input type="radio" className="text-8xl" name="sex" />
            </div>
            <button className="w-full border rounded text-4xl p-3 bg-green-700 text-white mt-2">
              Đăng ký
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default registerPopup