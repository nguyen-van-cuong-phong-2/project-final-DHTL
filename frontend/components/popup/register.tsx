/* eslint-disable react-hooks/rules-of-hooks */

import { MdOutlineCancel } from "react-icons/md";
import React, { useState } from 'react';
import { Button, Form, Input, DatePicker } from 'antd';
import { callApi_Register } from "../../api/callAPI";
import { useMyContext } from "../context/context";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";


const Register = ({ tatPopup }) => {
  const router = useRouter();

  const validateUserName = (rule: any, value: any, callback: any) => {
    const phoneNumberRegex = /^(?:\+84|0|\+1)?([1-9][0-9]{8,9})$/;
    if (value == '' || !value) {
      callback('Vui lòng nhập vào trường này!');
    } if (!phoneNumberRegex.test(value)) {
      callback('Nhập số điện thoại không hợp lệ!');
    } else {
      callback();
    }
  }
  const { setLoading, SetContentNotifi, SetUser, socket } = useMyContext();
  const onFinish = async (values: any) => {
    setLoading(true);
    const response = await callApi_Register({
      userName: values.phone,
      name: `${values.ten} ${values.ho}`,
      password: values.password,
      birthDay: values.birthday
    });
    setTimeout(() => {
      if (response.result === true) {
        Cookies.set('token', response.data.token);
        SetUser({
          id: response.data.id,
          userName: values.phone,
          name: `${values.ten} ${values.ho}`,
          password: values.password,
          birthDay: values.birthday
        });
        socket.emit("login", { id: response.data.id })
        SetContentNotifi('Tạo tài khoản thành công!')
        router.push('/Otp')
      } else {
        setLoading(false);
        SetContentNotifi('Email hoặc số điện thoại đã được sử dụng!')
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
            <div onClick={() => tatPopup(false)}>
              <MdOutlineCancel
                className="mt-2 text-3xl hover:cursor-pointer"
              ></MdOutlineCancel>
            </div>

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
              placeholder="Nhập vào số điện thoại"
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

          <Form.Item
            className=""
            name="birthday" label="Ngày sinh:" rules={[
              {
                required: true,
                message: 'Hãy nhập vào ngày sinh của bạn!',
              },
            ]}>
            <DatePicker className=' bg-slate-100 ml-2 ' />
          </Form.Item>
          <Form.Item className="flex justify-center items-center">
            <Button type="primary" htmlType="submit" className="bg-green-700 text-white text-xl px-6 py-5 text-center flex justify-center items-center mt-2">
              Đăng ký
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
export default Register;

