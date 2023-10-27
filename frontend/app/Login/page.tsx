"use client";
import Link from "next/link";
// import Header from "../../components/header/header";
import Register from "../../components/popup/register.tsx";
import { useState } from "react";
export default function Login() {
  const [popUpRegister, setpopUpRegister] = useState(false);


  return (
    <div className="w-full h-full relative ">
      <div className="w-full flex items-center h-screen bg-gray-100 gap-10 ">
        <div className="ml-60 w-2/5 h-2/3 pt-32 flex-row">
          <span className="text-6xl text-blue-600 font-bold">bluebook</span>
          <div>
            <span className="text-3xl font-normal">
              {" "}
              Bluebook giúp bạn kết nối và chia sẻ
            </span>
            <br></br>
            <span className="text-3xl font-normal">
              với mọi người trong cuộc sống của bạn.
            </span>
          </div>
        </div>
        <div className=" w-1/3 h-max rounded pt-5 flex-row justify-center bg-white shadow-2xl">
          <input
            placeholder="Email hoặc số điện thoại"
            className="w-11/12 h-16 rounded border-2 ml-6 focus:ring-blue-500 focus:border-blue-500 p-6"
            required
          ></input>
          <input
            type="password"
            placeholder="Mật khẩu"
            className="w-11/12 h-16 rounded border-2 ml-6 mt-5 focus:ring-blue-500 focus:border-blue-500 p-6"
            required
          ></input>
          <button className="bg-blue-600 w-11/12 ml-6 mt-5 h-16 rounded border-2 text-2xl font-bold text-white mb-5">
            Đăng nhập
          </button>
          <Link
            href={""}
            className="text-blue-500 w-10/12 ml-[200px] mt-60 h-16"
          >
            Quên mật khẩu?
          </Link>
          <button
            className="bg-green-600 w-11/12 ml-6 mt-5 h-16 rounded border-2 text-2xl font-bold text-white mb-5"
            onClick={() => {
              setpopUpRegister(true);
            }}
          >
            Tạo tài khoản mới
          </button>
        </div>
      </div>
      {popUpRegister && <Register tatPopup = {setpopUpRegister}></Register>}
    </div>
  );
}
