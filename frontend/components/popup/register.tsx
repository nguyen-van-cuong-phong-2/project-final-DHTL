/* eslint-disable react-hooks/rules-of-hooks */

import { MdOutlineCancel } from "react-icons/md";
import React, { useState } from 'react';
import { Button, Form, Input, DatePicker } from 'antd';
import Notification from '../popup/notification';
import { callApiRegister } from "../../api/callAPI";
import { useMyContext } from "../context/context";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface Register {
  tatPopup: () => {};
}

const Register = ({ tatPopup }: Register) => {
  const router = useRouter();

  const validateUserName = (rule: any, value: any, callback: any) => {
    const gmailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const phoneNumberRegex = /^(?:\+84|0|\+1)?([1-9][0-9]{8,9})$/;
    if (value == '' || !value) {
      callback('Vui lòng nhập vào trường này!');
    } else if (value.includes('@') && !gmailRegex.test(value)) {
      callback('Nhập email không hợp lệ!');
    } else if (!value.includes('@') && !phoneNumberRegex.test(value)) {
      callback('Nhập số điện thoại không hợp lệ!');
    } else {
      callback();
    }
  }
  const [showNoti, SetShowNoti] = useState(false);
  const [contentNoti, SetContentNoti] = useState<string>();
  const { setLoading } = useMyContext();
  const onFinish = async (values: any) => {
    setLoading(true);
    const response = await callApiRegister({
      userName: values.phone,
      name: `${values.ten} ${values.ho}`,
      password: values.password,
      birthDay: values.birthday
    });
    setTimeout(() => {
      setLoading(false);
      if (response.result === true) {
        SetContentNoti('Đăng kí tài khoản thành công!');
        SetShowNoti(true);
        Cookies.set('token', response.data.token)
        setTimeout(() => SetShowNoti(false), 3000);
        router.push('/')
      } else {
        SetContentNoti('Tài khoản này đã được sử dụng!');
        SetShowNoti(true);
        setTimeout(() => SetShowNoti(false), 3000);
      }
    }, 2000)
  };
  return (
    <div className='w-full h-full z-40 bg-BGRegister absolute top-0 max-sm:bg-white'>
      <div className='w-full h-full flex justify-center items-center'>
        <Form
          name="normal_login"
          className="login-form bg-white shadow-md  pt-3 px-5 max-sm:border-none"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          <div className="flex justify-between items-center">
            <span className='text-4xl font-bold'>Đăng ký</span>
            <MdOutlineCancel
              className="mt-2 text-3xl hover:cursor-pointer"
              onClick={tatPopup()}
            ></MdOutlineCancel>
          </div>

          <div className='flex gap-3 mt-2 justify-center'>
            <Form.Item
              name="ho"
              rules={[
                {
                  required: true,
                  message: 'Nhập vào họ của bạn!',
                },
              ]}

            >
              <Input className='w-[195px] h-[50px] bg-slate-100 max-sm:w-[150px]' placeholder="Họ" />
            </Form.Item>
            <Form.Item
              name="ten"
              rules={[
                {
                  required: true,
                  message: 'Nhập vào tên của bạn!',
                },
              ]}
            >
              <Input
                placeholder="Tên"
                className='w-[194px] h-[50px] bg-slate-100 max-sm:w-[150px]'
              />
            </Form.Item>
          </div>

          <Form.Item
            name="phone"
            rules={[{ validator: validateUserName }]}
          >
            <Input
              placeholder="Số di động hoặc email"
              className='w-[400px] h-[50px] bg-slate-100 max-sm:w-[335px]'
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Hãy nhập vào password!',
              },
            ]}
          >
            <Input
              type="password"
              placeholder="Mật khẩu mới"
              className='w-[400px] h-[50px] bg-slate-100 max-sm:w-[335px]'
            />
          </Form.Item>

          <Form.Item name="birthday" label="Ngày sinh" rules={[
            {
              required: true,
              message: 'Hãy nhập vào ngày sinh của bạn!',
            },
          ]}>
            <DatePicker className=' bg-slate-100' />
          </Form.Item>

          <Form.Item className="flex justify-center items-center">
            <Button type="primary" htmlType="submit" className="bg-green-700 text-white text-xl px-6 py-5 text-center flex justify-center items-center">
              Đăng ký
            </Button>
          </Form.Item>
        </Form>
      </div>
      {showNoti && <Notification content={contentNoti}></Notification>}
    </div>

  );
};
export default Register;

