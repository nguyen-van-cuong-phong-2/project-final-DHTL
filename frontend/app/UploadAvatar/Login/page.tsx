/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import Link from "next/link";
import { Button, Form, Input } from 'antd';
import Register from "../../components/popup/register";
import { useState } from "react";
import { callApi_Login } from "../../api/callAPI";
import { useMyContext } from '../../components/context/context';
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function Login() {
  const [popUpRegister, setpopUpRegister] = useState(false);
  const { SetContentNotifi, setLoading, socket } = useMyContext();
  const router = useRouter();
  const tatPopUpRegister = () => {
    setpopUpRegister(false)
  }

  const validateUserName = (rule: any, value: any, callback: any) => {
    const gmailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const phoneNumberRegex = /^(?:\+84|0|\+1)?([1-9][0-9]{8,9})$/;
    if (value == '' || !value) {
      callback('Vui lòng nhập trường này!');
    } else if (value.includes('@') && !gmailRegex.test(value)) {
      callback('Nhập email không hợp lệ!');
    } else if (!value.includes('@') && !phoneNumberRegex.test(value)) {
      callback('Nhập số điện thoại không hợp lệ!');
    } else {
      callback();
    }
  }

  const onFinish = async (e: any) => {
    const response = await callApi_Login({
      userName: e.username,
      password: e.password
    });
    if (response.statusCode === 404) {
      SetContentNotifi('Tài khoản hoặc mật khẩu không chính xác');
    } else if (response.result === true) {
      SetContentNotifi('Đăng nhập thành công');
      Cookies.set('token', response.data.token);
      // setLoading(true);
      router.push('/')
    }
  }
  return (

    <div className="w-full h-screen">
      <div className="flex w-full h-screen justify-center items-center gap-5">
        <div className="
                  flex
                  justify-center
                  items-center
                  max-lg:hidden
        ">
          <div>
            <span className="text-6xl text-blue-600 font-bold">Bluebook</span>
            <br></br>
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
        <div className="body-right">

          <div className="rounded bg-white shadow-2xl flex-row px-5 pt-5 pb-1">
            <Form
              name="normal_login"
              className="login-form "
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
            >
              <Form.Item
                name="username"
                rules={[{ validator: validateUserName }]}
              >
                <Input placeholder="Email hoặc số điện thoại" className="
                w-96 h-16
                max-sm:w-60
                max-sm:h-10
                " />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: 'Please input your Password!',
                  },
                ]}
              >
                <Input
                  type="password"
                  placeholder="Password"
                  className="w-96 h-16
                  max-sm:w-60
                max-sm:h-10"
                />
              </Form.Item>

              <Form.Item>
                <div className="flex flex-col justify-center items-center">
                  <Button type="primary" htmlType="submit"
                    className=" 
                  w-96 
                  h-16
                 bg-blue-600 
                 text-xl 
                 font-bold
                 max-sm:w-60
                max-sm:h-10
                  text-white">
                    Đăng nhập
                  </Button>
                  <Link href={"#"} className="mt-2">Quên mật khẩu</Link>
                </div>
              </Form.Item>

              <Form.Item>
                <Button
                  onClick={() => setpopUpRegister(true)}
                  className=" 
                  w-96 
                  h-16
                  bg-green-600
                 text-xl 
                 font-bold
                 max-sm:w-60
                max-sm:h-10
                  text-white">
                  Tạo tài khoản mới
                </Button>
              </Form.Item>
            </Form>

          </div>

        </div>
      </div>
      {popUpRegister && <Register tatPopup={() => tatPopUpRegister}></Register>}
    </div>
  );
}
