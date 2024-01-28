import Image from "next/image";

const Anh = ({ response }) => {
    return (<>
        <div className="w-full bg-white rounded-2xl p-5 font-bold text-xl flex-grow mb-10">
            <div>Ảnh</div>
            <div className="flex flex-wrap w-full gap-4 mt-5">
                {
                    response?.image?.map(item => (
                        <div key={item} className="relative h-60 w-60 max-sm:w-20 max-sm:h-20 max-md:w-32 max-md:h-32 max-lg:w-40 max-lg:h-40 lg:h-48 lg:w-48">
                            <Image
                                className="w-full h-full rounded-xl"
                                src={item}
                                objectFit="cover"
                                fill={true}
                                quality={100}
                                alt="avatar"
                                onError={(e: any) => {
                                    e.target.onerror = null;
                                    e.target.setsrc = "/images/user.png";
                                }}></Image>

                        </div>
                    ))
                }
                {
                    response?.image?.length == 0 && <div className="text-center font-normal text-base flex justify-center">
                        <div>
                            Chưa có ảnh nào
                        </div>
                    </div>
                }
            </div>
        </div>
    </>)
}
export default Anh