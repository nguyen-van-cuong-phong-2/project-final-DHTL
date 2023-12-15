'use client';
import React from 'react';
import { Spin } from 'antd';
import { useMyContext } from "../../components/context/context";
export default function App(){
    const { Loading } = useMyContext();
    return (
        <>
            {
                Loading && <div className="absolute top-0 left-0 z-[1000] bg-BGICon">
                    <div className='w-screen h-screen flex justify-center items-center'>
                        <Spin tip="Loading" size="large" />
                    </div>

                </div>
            }
        </>
    );
}
