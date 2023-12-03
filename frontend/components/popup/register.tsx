
import { MdOutlineCancel } from "react-icons/md";
import React from 'react';
import { Button, Form, Input, DatePicker } from 'antd';

interface Register {
  tatPopup: () => {};
}

const Register = ({ tatPopup }: Register) => {
  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
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
              onClick={
                tatPopup()
              }
            ></MdOutlineCancel>
          </div>

          <div className='flex gap-3 mt-2 justify-center'>
            <Form.Item
              name="ho"
              rules={[
                {
                  required: true,
                  message: 'Please input your Username!',
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
                  message: 'Please input your Password!',
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
            rules={[
              {
                required: true,
                message: 'Please input your Password!',
              },
            ]}
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
                message: 'Please input your Password!',
              },
            ]}
          >
            <Input
              type="password"
              placeholder="Mật khẩu mới"
              className='w-[400px] h-[50px] bg-slate-100 max-sm:w-[335px]'
            />
          </Form.Item>

          <Form.Item name="date-picker" label="Ngày sinh">
            <DatePicker className=' bg-slate-100' />
          </Form.Item>

          <Form.Item className="flex justify-center items-center">
            <Button type="primary" htmlType="submit" className="bg-green-700 text-white text-xl px-6 py-5 text-center flex justify-center items-center">
              Đăng ký
            </Button>
          </Form.Item>
        </Form>
      </div>

    </div>

  );
};
export default Register;

