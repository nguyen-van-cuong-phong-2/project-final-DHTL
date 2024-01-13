import Image from "next/image";

const BanBe = () => {
    const arrImage = [
        "http://localhost:8080/pictures/news/1704892207788_1567946829866.jpg",
        "http://localhost:8080/pictures/news/1704892207788_1567946829866.jpg",
        "http://localhost:8080/pictures/news/1704892207788_1567946829866.jpg",
        "http://localhost:8080/pictures/news/1704892207788_1567946829866.jpg",
        "http://localhost:8080/pictures/news/1704892207788_1567946829866.jpg",
        "http://localhost:8080/pictures/news/1704892207788_1567946829866.jpg",
    ]
    return (<>
        <div className="w-full bg-white rounded-2xl p-5 mt-10 flex-grow mb-10">
            <div className=" font-bold text-xl">Bạn bè</div>
            <div className="flex flex-wrap w-full mt-4 justify-between gap-4">
                {arrImage.map(item => (
                    <div key={item} className="w-[49%] border rounded-2xl border-gray-200 p-3">
                        <div className="flex items-center gap-2">
                            <div className="w-20 h-20 relative">
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
                            <div>
                                <div className="text-lg font-medium">Tiền nguyễn</div>
                                <div className="text-sm font-normal">103 bạn chung</div>
                            </div>
                        </div>
                    </div>
                ))}

            </div>
        </div>
    </>)
}
export default BanBe