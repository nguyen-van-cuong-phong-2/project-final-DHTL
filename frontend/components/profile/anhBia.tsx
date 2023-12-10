import Image from "next/image"
export default function AnhBia() {
    return (
        <>
            <div className=" w-full flex justify-center items-center">
                <div className="w-[70%] h-[400px] max-sm:h-[200px] max-md:h-[250px] max-lg:h-[300px] max-xl:w-full absolute top-[75px]">
                    <Image
                        alt="anhbia"
                        className="border rounded-b-xl"
                        src="/images/bia.jpg"
                        fill={true}
                        objectFit="cover"
                        quality={100}
                    ></Image>
                </div>
            </div>
        </>
    )
}