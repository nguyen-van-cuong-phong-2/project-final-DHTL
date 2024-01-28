import Image from "next/image";

const BanBe = ({ response }) => {
    return (<>
        <div className="w-full bg-white rounded-2xl p-5 flex-grow mb-10">
            <div className=" font-bold text-xl">Bạn bè</div>
            <div className="flex flex-wrap w-full mt-4 justify-between gap-4">
                {response?.list_friends?.map((item: any) => (
                    <div key={item} className="w-[49%] border rounded-2xl border-gray-200 p-3">
                        <div className="flex items-center gap-2">
                            <div className="w-20 h-20 relative">
                                <Image
                                    className="w-full h-full rounded-xl"
                                    src={item.avatar ? item.avatar : "/images/user.png"}
                                    objectFit="cover"
                                    fill={true}
                                    quality={100}
                                    alt="avatar"
                                    onError={(e: any) => {
                                        e.target.onerror = null;
                                        e.target.setsrc = "/images/user.png";
                                    }}></Image>
                            </div>
                            <div>
                                <div className="text-lg font-medium">{item.name}</div>
                                <div className="text-sm font-normal">{item.total_friend_Mutual} bạn chung</div>
                            </div>
                        </div>
                    </div>
                ))}

            </div>
        </div>
    </>)
}
export default BanBe