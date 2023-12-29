import Image from "next/image"
const LoadComment = () => {
    return (
        <>
            <div className="w-full h-full flex gap-2 items-start mt-10 flex-wrap relative">
                <div className="relative w-10 h-10">
                    <Image
                        alt="avatar"
                        src={'/images/avatar.jpg'}
                        className="rounded-full"
                        fill
                    ></Image>
                </div>
                <div className="bg-[#f0f2f5] p-2 rounded-2xl max-w-[90%] max-md:max-w-[80%] relative z-0">
                    <div className="text-base font-semibold">Nguyễn Cường</div>
                    <div className="text-base ">Lúc về mới biết chị nhân viên là nyc của anh đó
                    </div>
                    <div className="flex gap-2 w-full absolute bottom-[-20px]">
                        <div className="text-sm font-semibold cursor-pointer hover:underline">
                            Thích
                        </div>
                        <div className="text-sm font-semibold cursor-pointer hover:underline">
                            Phản hồi
                        </div>

                    </div>
                </div>
                <div className="flex gap-2 w-full max-md:w-full z-0 mt-5 ml-12">
                    <div className="relative w-10 h-10">
                        <Image
                            alt="avatar"
                            src={'/images/avatar.jpg'}
                            className="rounded-full"
                            fill
                        ></Image>
                    </div>
                    <div className="bg-[#f0f2f5] p-2 rounded-2xl max-w-[90%] max-md:max-w-[80%] relative">
                        <div className="text-base font-semibold">Nguyễn Cường</div>
                        <div className="text-base ">Lúc về mới biết chị nhân viên là nyc của anh đó
                            Lúc về mới biết chị nhân viên là nyc của anh đó
                            Lúc về mới biết chị nhân viên là nyc của anh đó
                            Lúc về mới biết chị nhân viên là nyc của anh đó
             
                        </div>
                        <div className="flex gap-2 w-full absolute bottom-[-20px]">
                            <div className="text-sm font-semibold cursor-pointer hover:underline">
                                Thích
                            </div>
                            <div className="text-sm font-semibold cursor-pointer hover:underline">
                                Phản hồi
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default LoadComment