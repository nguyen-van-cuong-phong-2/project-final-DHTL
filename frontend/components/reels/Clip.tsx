/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import dynamic from "next/dynamic";
import { useEffect, useState } from "react"
const DynamicReactPlayer = dynamic(() => import('react-player'), { ssr: false });
import { SlArrowLeft } from "react-icons/sl";
import { SlArrowRight } from "react-icons/sl";
import { callApi_GetReels } from "../../api/callAPI";

const Clip = ({ setDataUser, mute }) => {
    const [video, setVideo] = useState<any>({ key: 0 });
    const [page, setPage] = useState(1);
    const [data, setData] = useState<any>([]);
    useEffect(() => {
        const callAPI = async () => {
            const response = await callApi_GetReels({ page });
            if (data) {
                if (page == 0) setData(response.data)
                else setData((prev: any) => [...prev, ...response.data])
            }
            if (video.key == 0) {
                setVideo({ key: 0, video: response.data[0].video })
                setDataUser({
                    name: response.data[0].name,
                    avatar: response.data[0].avatar,
                    created_at: response.data[0].created_at
                })
            }
        }
        callAPI();
    }, [page])
    const handleNextClick = () => {
        const key = video.key + 1;
        if (key < data.length) {
            setVideo({ key, video: data[key]?.video })
            setDataUser({
                name: data[key].name,
                avatar: data[key].avatar,
                created_at: data[key].created_at
            })
        } else if (key + 10 == data.length) {
            setPage(prev => prev + 1)
        }
    }

    const handlePreviousClick = () => {
        const key = video.key - 1;
        if (key >= 0) {
            setVideo({ key, video: data[key]?.video })
            setDataUser({
                name: data[key].name,
                avatar: data[key].avatar,
                created_at: data[key].created_at
            })
        }
    }
    return (
        <>
            <div className='w-full lg:h-[700px] mt-2 flex items-center gap-10 max-md:gap-1'>
                <div className="border rounded-full p-2 mb-32 cursor-pointer" onClick={handlePreviousClick}>
                    <SlArrowLeft className='max-md:text-base text-4xl text-white'></SlArrowLeft>
                </div>
                <div className="w-[450px] max-lg:w-[80%] rounded-2xl overflow-hidden">
                    <DynamicReactPlayer
                        url={video?.video}
                        controls={false}
                        loop={true}
                        width="100%"
                        height="100%"
                        muted={mute}
                        playing={true}
                        autoPlay={true}

                    />
                </div>
                <div className="border rounded-full p-2 mb-32 cursor-pointer" onClick={handleNextClick}>
                    <SlArrowRight className='max-md:text-base text-white text-4xl'></SlArrowRight>
                </div>
            </div>
        </>
    )
}

export default Clip