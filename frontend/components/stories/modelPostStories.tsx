import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Upload } from 'antd';
import { useMyContext } from '../context/context';
import FormData from 'form-data';
import Cookies from 'js-cookie';
import axios from 'axios';

interface App {
    showModal: any;
    setShowModal: any
}

const App: React.FC<App> = ({ showModal, setShowModal }) => {
    const { SetContentNotifi, setLoading } = useMyContext()
    const [fileList, setFileList] = useState<any>({});

    const handleChange = ({ file }) => {
        setFileList(file);
    };
    const handleBeforeUpload = file => {
        setFileList(file);
        return false;
    };
    const handleUpload = async () => {
        const formData = new FormData();
        formData.append('file', fileList)
        const token = Cookies.get('token')
        setLoading(true)
        const response: any = await axios({
            method: 'post',
            url: `${process.env.NEXT_PUBLIC_DOMAIN_API}/Stories/uploadStories`,
            data: formData,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        setLoading(false)
        if (response.data.result == true) {
            SetContentNotifi("Đăng storie thành công!")
            setFileList({})
            setShowModal(false)
        } else {
            SetContentNotifi("Kích thước quá lớn hoặc định dạng không cho phép!")
        }
    }

    return (
        <>
            <Modal title="Tải lên video" open={showModal} onCancel={() => { setShowModal(false) }}>
                <Upload
                    className="w-full"
                    beforeUpload={handleBeforeUpload}
                    onChange={handleChange}
                    fileList={[fileList]}
                >
                    <Button icon={<UploadOutlined />}>Nhấn để tải lên stories của bạn</Button>
                </Upload>
                <div className='p-2 rounded-2xl bg-slate-400 flex justify-center mt-2 cursor-pointer' onClick={handleUpload}>
                    <div className='rounded-2xl bg-slate-400' >
                        Upload
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default App;