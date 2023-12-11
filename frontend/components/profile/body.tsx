import Image from "next/image"
export default function Body() {
    return (
        <>
            <div className="absolute 2xl:top-[400px]">
                <div className="">
                    <Image
                        alt="avatar"
                        className="border rounded-full w-[180px] h-[180px] max-md:w-[120px] max-md:h-[120px] max-sm:w-[70px] max-sm:h-[70px]"
                        src="/images/avatar.jpg"
                        width={384}
                        height={384}
                        objectFit="cover"
                        quality={100}
                        loading="lazy"
                    ></Image>
                </div>
            </div>
        </>
    )
}