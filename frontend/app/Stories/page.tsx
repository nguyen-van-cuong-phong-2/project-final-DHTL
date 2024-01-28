'use client'
import { IoCloseCircleSharp } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";
import AllStories from "../../components/stories/allStories";
import Clip from "../../components/stories/clip";
import { useEffect, useState } from "react";
import ModelPostStories from '../../components/stories/modelPostStories'
import { useRouter } from "next/navigation";
import { callApi_GetListStories } from "../../api/callAPI";

export default function Stories() {
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();
    const [page, setPage] = useState(1);
    const [data, setData] = useState([]);
    const [storie, setStorie] = useState<any>([]);
    const [choose, setChoose] = useState(0);
    const [result, setResult] = useState<any>(0);
    useEffect(() => {
        const ga = storie.findIndex((item: any) => item.user_id == choose)
        setResult(ga)
    }, [choose])


    useEffect(() => {
        const callAPI = async () => {
            const response = await callApi_GetListStories({ page: page })
            setData(response.data);
            setStorie(vonglap(response.data))
        }
        callAPI()
    }, [page])

    const vonglap = (data: any) => {
        const arr = [];
        for (let i = 0; i < data.length; i++) {
            const element = data[i];
            element.data.map((item: any) => arr.push(item))
        }
        return arr;
    }
    return (<>
        <div className="w-screen h-screen flex">
            <div className="w-[25%] h-full bg-white overflow-y-auto">
                <div className="flex gap-1 border-b-2 p-1" onClick={() => router.push('/')}>
                    <div className="w-[50px] h-[50px] cursor-pointer" >
                        <IoCloseCircleSharp className="w-full h-full text-gray-400"></IoCloseCircleSharp>
                    </div>
                    <div>
                        <div className="border rounded-full mt-1 w-[44px] h-[44px] flex justify-center items-start bg-blue-600 box-border cursor-pointer"
                        >
                            <div className="text-white text-4xl font-bold">B</div>
                        </div>
                    </div>
                </div>
                <div className="w-full p-2">
                    <div className="text-3xl font-semibold">Tin</div>
                    <div className="text-base font-semibold ml-1 mt-3">Tin của bạn</div>
                    <div className="flex mt-3 gap-2 items-center cursor-pointer " onClick={() => setShowModal(true)}>
                        <div className="p-5 bg-slate-100 rounded-full">
                            <FaPlus className="text-blue-600"></FaPlus>
                        </div>
                        <div>
                            <div className="text-base font-semibold">Tạo tin</div>
                            <div className="text-sm font-normal">Bạn có thể chia sẻ video hoặc ảnh</div>
                        </div>
                    </div>
                    <div className="text-base font-semibold ml-1 mt-5">Tất cả tin</div>
                    {
                        data.map((item, index) => (
                            <AllStories key={index} item={item?.data[0]} index={index} data={data} setChoose={setChoose}></AllStories>
                        ))
                    }
                </div>
                <ModelPostStories showModal={showModal} setShowModal={setShowModal}></ModelPostStories>
            </div>
            <div className="w-[75%] h-full flex justify-center bg-black">
                <Clip data={storie[result || 0]} setResult={setResult} result={result} storie={storie}></Clip>
            </div>
        </div>
    </>)
}