import Image from "next/image";
import { useEffect, useState } from "react";
import { callApi_notification } from "../../api/callAPI";
import { useRouter } from "next/navigation";

const App = () => {
    const [data, setData] = useState([]);
    const router = useRouter();
    useEffect(() => {
        const fetchAPi = async () => {
            const response = await callApi_notification({});
            setData(response.data)
        }
        fetchAPi()
    }, [])
    return (
        <div className={`absolute right-0 border rounded-md overflow-auto bg-white h-[500px] md:w-[320px] mt-2 z-50 p-2 shadow-lg max-sm:w-[360px] max-sm:right-[-50px]`} >
            <h1 className="font-bold text-2xl">Thông báo</h1>
            {data?.map(item => (
                <div className="w-full h-20  flex items-start p-2 gap-2 cursor-pointer hover:bg-slate-200" key={1}
                    onClick={() => router.push(`${item.link}`)}
                >
                    <div className="w-12 h-12">
                        <Image
                            className="w-full h-full border rounded-full box-border"
                            src={item.avatar ? item.avatar : "/images/user.png"}
                            width={50}
                            height={50}
                            quality={100}
                            alt="avatar"
                            onError={(e: any) => {
                                e.target.onerror = null;
                                e.target.setsrc = "/images/user.png";
                            }}
                        />
                    </div>
                    <div className="w-[80%]">
                        <span className="font-bold text-sm">{item.name}</span>
                        {item.type == 1 && <span> &nbsp;đã gửi cho bạn lời mời kết bạn</span>}
                        {item.type == 2 && <span> &nbsp;đã chấp nhận kết bạn</span>}
                        {item.type == 3 && <span> &nbsp;đã thích bài viết của bạn</span>}
                        {item.type == 4 && <span> &nbsp;đã bình luận về bài viết của bạn</span>}
                        {item.type == 5 && <span> &nbsp;đã trả lời bình luận của bạn trong 1 bài viết</span>}
                        {item.type == 6 && <span> &nbsp;đã thích bình luận của bạn trong 1 bài viết</span>}
                    </div>
                </div>
            ))
            }
        </div >
    )
}
export default App;