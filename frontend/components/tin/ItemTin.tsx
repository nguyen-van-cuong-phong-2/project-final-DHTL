import Image from "next/image";
import { FaCirclePlus } from "react-icons/fa6";

const ItemTin = () => {
    return (<>
        <div className="xl:w-36 h-56 rounded-2xl lg:w-24 md:w-[185px] max-md:w-[91px] bg-white ">
            <div className="w-full h-3/4 relative">
                <Image
                    alt="avatar"
                    src={'/images/avatar.jpg'}
                    fill
                    objectFit="cover"
                    className="rounded-t-2xl "
                ></Image>
                <div className="absolute left-1/2 translate-x-[-50%] translate-y-[-50%] bottom-[-40px] w-10 h-10 p-1 bg-white rounded-full">
                    <FaCirclePlus className="text-3xl text-blue-600"></FaCirclePlus>
                </div>
            </div>
            <div className="flex justify-center items-centern mt-5">
                <div className="text-base font-semibold">Tạo tin</div>
            </div>
        </div>
    </>)    
}
export default ItemTin;