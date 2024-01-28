import Image from "next/image"
import { functions } from "../../functions/functions";

const AllStories = ({ item, index, data, setChoose }) => {
    const myFunction = new functions();
    return (<>
        <div className="w-full mt-2 rounded-2xl hover:bg-slate-200 cursor-pointer flex gap-2 items-center" onClick={() => setChoose(item.user_id)}>
            <div className={`border-[3px] rounded-full ${item.seen ? 'border-gray-600' : 'border-blue-600'} p-[2px] w-max mt-2`}>
                <div className="w-[46px] h-[46px] relative">
                    <Image
                        alt="avatar"
                        fill
                        src={item.avatar}
                        objectFit="cover"
                        className="rounded-full"
                    >
                    </Image>
                </div>
            </div>
            <div>
                <div className="font-semibold">
                    {item.name}
                </div>
                <div className="font-normal text-sm text-gray-600">{myFunction.TimeAgo(item?.created_at)}</div>
            </div>
        </div>
    </>)
}
export default AllStories