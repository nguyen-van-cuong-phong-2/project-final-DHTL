'use client'
import dynamic from "next/dynamic";
import { useState } from "react"
const DynamicReactPlayer = dynamic(() => import('react-player'), { ssr: false });
import { SlArrowLeft } from "react-icons/sl";
import { SlArrowRight } from "react-icons/sl";
const Clip = () => {
    const [mute, setMute] = useState(true)
    return (
        <>
            {/* <div className=' cursor-pointer w-20 h-20 border ' onClick={() => setMute(false)}>bat loa</div> */}
            <div className='w-full h-full relative mt-2 flex items-center gap-10 '>
                {/* <DynamicReactPlayer
                    url='http://104.199.238.144/pictures/video/d97ffa6ff0cb6030afc1134f137fd86a.mp4'
                    controls={false}
                    playing={true}
                    loop={true}
                    width="100%"
                    height="100%"
                    style={{ position: 'absolute', top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }}
                    muted={mute}
                /> */}
                <SlArrowLeft className=' mb-20 rounded-full p-5 bg-white'></SlArrowLeft>
                <div className="w-[450px]">
                    <video className="w-full object-cover" autoPlay muted>
                        <source src="http://104.199.238.144/pictures/video/1a6a1c5274e747404a9712bfd7ec2544.mp4" type="video/mp4" />
                    </video>
                </div>
                <SlArrowRight className='text-white mb-20'></SlArrowRight>

            </div>


        </>
    )
}

export default Clip