'use client'
import Image from "next/image";
import News from "../Body/news"
import Anh from "./anh";
import BanBe from "./banbe";

const Main = ({ news }) => {
    const setIdNews = 'faf';
    const arrImage = [
        "http://localhost:8080/pictures/news/1704892207788_1567946829866.jpg",
        "http://localhost:8080/pictures/news/1704892207788_1567946829866.jpg",
        "http://localhost:8080/pictures/news/1704892207788_1567946829866.jpg",
        "http://localhost:8080/pictures/news/1704892207788_1567946829866.jpg",
        "http://localhost:8080/pictures/news/1704892207788_1567946829866.jpg",
        "http://localhost:8080/pictures/news/1704892207788_1567946829866.jpg",
    ]
    return (<>
        <div className="border-t-2 w-[70%] max-xl:w-full max-lg:mt-10">
            {/* <div className="flex gap-7 flex-wrap">
                <div className="lg:w-[40%] mt-5 max-lg:w-full">
                    <div className="rounded-2xl bg-white p-2 max-lg:h-[60%]">
                        <div className="flex justify-between items-center">
                            <div className=" font-bold text-xl">
                                Ảnh
                            </div>
                            <div className="text-blue-500 hover:underline cursor-pointer">
                                Xem tất cả ảnh
                            </div>
                        </div>
                        <div className="flex gap-2 justify-between mt-2 flex-wrap max-lg:h-20">
                            {arrImage.map(item => (
                                <div key={item} className="relative w-[32%] h-32 max-lg:w-[30%] ">
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
                            ))}
                            {arrImage.length === 0 && <div className="h-20 w-full flex justify-center items-center font-normal text-xl text-gray-500">Không có ảnh</div>}
                        </div>
                    </div>
                    <div className="rounded-2xl bg-white p-2 mt-2  max-lg:w-full max-lg:h-[73%]" >
                        <div className="flex justify-between">
                            <div>
                                <div className=" font-bold text-xl">
                                    Bạn bè
                                </div>
                                <div className="font-normal text-sm text-gray-500">301 người bạn</div>
                            </div>

                            <div className="text-blue-500 hover:underline cursor-pointer">
                                Xem tất cả bạn bè
                            </div>
                        </div>
                        <div className="flex flex-wrap justify-between mt-2">
                            {arrImage.map(item => (
                                <div key={item} className="w-[32%] h-40 ">
                                    <div className="relative w-full h-[80%] rounded-2xl">
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
                                    <div className="text-left font-medium text-sm">Nguyễn Yến</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="w-[58%] xl:w-[57%] max-lg:w-full max-lg:mt-24">
                    <div className="w-full mt-5 rounded-2xl bg-white p-2 font-bold text-xl">
                        Bài viết
                    </div>
                    <div className="w-full rounded-2xl bg-white">
                        {news?.data?.map((item: any) => (
                            <News key={item.id} data={item} setIdNews={setIdNews} profile={true}></News>
                        ))}
                    </div>
                </div>
            </div> */}
            {/* <Anh></Anh> */}
            <BanBe></BanBe>
        </div>
    </>)
}
export default Main