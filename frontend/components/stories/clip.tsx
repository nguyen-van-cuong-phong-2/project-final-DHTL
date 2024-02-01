import dynamic from "next/dynamic";
import Image from "next/image";
import { SlArrowLeft } from "react-icons/sl";
import { SlArrowRight } from "react-icons/sl";
const DynamicReactPlayer = dynamic(() => import('react-player'), { ssr: false });
import { IoSendSharp } from "react-icons/io5";
import { GoUnmute } from "react-icons/go";
import { GoMute } from "react-icons/go";
import { useEffect, useState } from "react";
import { functions } from "../../functions/functions";
import { callApi_updateSeen } from "../../api/callAPI";
import { useMyContext } from "../context/context";

const Clip = ({ data, setResult, result, storie }) => {
    const [mute, setMute] = useState(true);
    const myFunction = new functions();
    const user = myFunction.getInfoFromToken();
    const { socket, SetContentNotifi } = useMyContext();
    const [comment, setComment] = useState('');
    const phai = () => {
        const key = result + 1;
        if (key < storie.length) {
            setResult(key)
        }
    }

    const trai = () => {
        const key = result - 1;
        if (key >= 0) {
            setResult(key)
        }
    }

    useEffect(() => {
        if (data) {
            const callAPI = async () => {
                await callApi_updateSeen({ id: data.id })
            }
            callAPI();
        }
    }, [data?.id])

    const repStories = async () => {
        if (socket) {
            socket.emit('sendMessage', {
                sender_id: user.id,
                receiver_id: data.user_id,
                content: comment,
                image: data && data.image != null ? data.image : null,
                video: data && data.video != null ? data.video : null,
                id_story: data.id
            });
            setComment('')
            SetContentNotifi('Gửi trả lời tin thành công')
        }
    }

    const repEmoji = async (emoji: any) => {
        if (socket) {
            socket.emit('sendMessage', {
                sender_id: user.id,
                receiver_id: data?.user_id,
                content: emoji,
                image: data && data.image != null ? data.image : null,
                video: data && data.video != null ? data.video : null,
                id_story: data.id
            });
            setComment('')
            SetContentNotifi('Thả cảm xúc thành công')
        }
    }

    return (<>
        <div className='h-full w-full flex flex-col justify-center items-center relative'>
            <div className="flex h-full gap-5 max-md:gap-1 items-center">
                <div className="border rounded-full p-2 w-max h-max cursor-pointer" onClick={() => trai()}>
                    <SlArrowLeft className='max-md:text-base text-4xl text-white'></SlArrowLeft>
                </div>
                <div className="w-[450px] h-[90%] mt-5 max-lg:w-[80%] rounded-2xl overflow-hidden self-start relative">
                    {
                        data && data?.video != null ? <video
                            src={data.video}
                            controls={false}
                            loop={true}
                            width="100%"
                            height="100%"
                            muted={mute}
                            // playing={true}
                            autoPlay={true}
                            className="rounded-2xl"
                            style={{ height: "100%", borderRadius: "16px", objectFit: "cover", border: "1px" }}
                        /> : <>
                            <Image
                                alt="image"
                                src={data?.image}
                                fill
                                objectFit="cover"
                            ></Image>
                        </>
                    }
                    <div className="absolute top-5 gap-2 left-5 flex justify-center items-start">
                        <div className="w-10 h-10 relative">
                            <Image
                                alt="avatar"
                                fill
                                src={data?.avatar}
                                className="rounded-full"
                            ></Image>
                        </div>
                        <div className="text-base font-semibold text-white">
                            <div>{data?.name}</div>
                            <div className="text-xs font-normal">{myFunction.TimeAgo(data?.created_at, 1)}</div>
                        </div>
                    </div>
                    <div className="absolute top-7 right-8 cursor-pointer">
                        <div className="w-6 h-6" onClick={() => setMute((prev) => !prev)}>
                            {!mute ? <GoUnmute className='w-full h-full text-white'></GoUnmute> : <GoMute className='w-full h-full text-white'></GoMute>}
                        </div>
                    </div>
                    {
                        user?.id == data?.user_id && <div className="text-base font-semibold text-white absolute bottom-4 left-3">{data?.user_seen.length} người xem</div>
                    }
                </div>
                <div className="border rounded-full p-2 w-max h-max cursor-pointer" onClick={() => phai()}>
                    <SlArrowRight className='max-md:text-base text-white text-4xl'></SlArrowRight>
                </div>
            </div>
            {user?.id != data?.user_id && <div className="w-full h-10 flex absolute bottom-3 justify-center">
                <div className=" border rounded-3xl p-2 mt-2 h-10 relative w-72">
                    <input type="text" name="" id="" placeholder="Trả lời..." className="bg-black px-2 placeholder:text-white w-60  boder-none text-white outline-none" onChange={(e) => setComment(e.target.value)} value={comment} />
                    <div className="absolute right-2 bottom-3 cursor-pointer" onClick={() => repStories()}>
                        <IoSendSharp className="text-white text-lg"></IoSendSharp>
                    </div>
                </div>
                <div className="relative w-14 h-14 rounded-full border-0 hover:w-20 hover:h-20 hover:duration-300 hover:translate-y-[-20px] cursor-pointer" onClick={() => repEmoji("👍")}>
                    <Image
                        alt="emotion"
                        src={'/images/2.gif'}
                        fill
                        objectFit="cover"
                    ></Image>
                </div>

                <div className="relative w-14 h-14 rounded-full border-0 hover:w-20 hover:h-20 hover:duration-300 hover:translate-y-[-20px] cursor-pointer" onClick={() => repEmoji("❤️")}>
                    <Image
                        alt="emotion"
                        src={'/images/3.gif'}
                        fill
                        objectFit="cover"
                    ></Image>
                </div>

                <div className="relative w-14 h-14 rounded-full border-0 hover:w-20 hover:h-20 hover:duration-300 hover:translate-y-[-20px] cursor-pointer" onClick={() => repEmoji("😂")}>
                    <Image
                        alt="emotion"
                        src={'/images/4.gif'}
                        fill
                        objectFit="cover"
                    ></Image>
                </div>

                <div className="relative w-14 h-14 rounded-full border-0 hover:w-20 hover:h-20 hover:duration-300 hover:translate-y-[-20px] cursor-pointer" onClick={() => repEmoji("😭")}>
                    <Image
                        alt="emotion"
                        src={'/images/5.gif'}
                        fill
                        objectFit="cover"
                    ></Image>
                </div>

                <div className="relative w-14 h-14 rounded-full border-0 hover:w-20 hover:h-20 hover:duration-300 hover:translate-y-[-20px] cursor-pointer" onClick={() => repEmoji("😲")}>
                    <Image
                        alt="emotion"
                        src={'/images/6.gif'}
                        fill
                        objectFit="cover"
                    ></Image>
                </div>

                <div className="relative w-14 h-14 rounded-full border-0 hover:w-20 hover:h-20 hover:duration-300 hover:translate-y-[-20px] cursor-pointer" onClick={() => repEmoji("😡")}>
                    <Image
                        alt="emotion"
                        src={'/images/7.gif'}
                        fill
                        objectFit="cover"
                    ></Image>
                </div>
            </div>}
        </div >
    </>)
}
export default Clip