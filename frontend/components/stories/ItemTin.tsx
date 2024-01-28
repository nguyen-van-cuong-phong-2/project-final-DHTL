import Image from "next/image";
import { FaCirclePlus } from "react-icons/fa6";
import { functions } from "../../functions/functions";
import { useRouter } from "next/navigation";

const ItemTin = ({ index, item }) => {
    const fnc = new functions();
    const user = fnc.getInfoFromToken();
    const router = useRouter()
    return (<>
        <div className="xl:w-[135px] 2xl:w-[150px] h-64 rounded-xl lg:w-24 md:w-[185px] max-md:w-[91px] bg-white border-2 cursor-pointer" onClick={() => router.push('/Stories')}>
            {index == 0 ? <><div className="w-full h-3/4 relative">
                <Image
                    alt="avatar"
                    src={item?.avatar}
                    fill
                    objectFit="cover"
                    className="rounded-t-xl "
                ></Image>
                <div className="absolute left-1/2 translate-x-[-50%] translate-y-[-50%] bottom-[-40px] w-10 h-10 p-1 bg-white rounded-full">
                    <FaCirclePlus className="text-3xl text-blue-600"></FaCirclePlus>
                </div>
            </div>
                <div className="flex justify-center items-centern mt-5">
                    <div className="text-base font-semibold">Tạo tin</div>
                </div></> : <div className="w-full h-full relative">
                {item?.data && item?.data[0]?.video != null && <video
                    src={item?.data[0]?.video}
                    style={{ borderRadius: "12px", width: "100%", height: "100%", objectFit: "cover", border: "1px" }}
                > </video>}
                {item?.data && item?.data[0]?.image != null && <Image
                    src={item?.data[0]?.image}
                    alt="imagedes"
                    fill
                    objectFit="cover"
                    style={{ borderRadius: "12px", width: "100%", height: "100%", objectFit: "cover", border: "1px" }}
                ></Image>}
                <div className={`w-10 h-10 absolute top-2 left-3 z-50 ${user.id != item.user_id && !item.seen ? 'border-blue-600' : "border-gray-300"} border-[4px] rounded-full`}>
                  {item?.data &&   <Image
                        alt="avatar"
                        fill
                        objectFit="cover"
                        src={item?.data[0]?.avatar}
                        className="rounded-full"
                    ></Image>}
                  
                </div>
                <div className="absolute bottom-2 left-3 z-50 text-white w-3/4 font-semibold text-xs break-words">{item.name}</div>
            </div>}
        </div>
    </>)
}
export default ItemTin;