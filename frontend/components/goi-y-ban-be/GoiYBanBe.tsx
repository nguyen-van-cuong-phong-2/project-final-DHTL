import { Carousel } from 'antd';
import Body from './component';
const GoiYBanBe = ({ friend_goiy }) => {
    return (<>
        <div className="w-full flex justify-center">
            <div className={`w-[68%] mt-5 border rounded-xl h-max bg-white pt-5 px-5 max-lg:w-full
        max-lg:m-0 max-lg:mt-5`}>
                <div className="text-base font-semibold text-gray-600">Gợi ý bạn bè</div>
                <div className="mt-2 mb-5 gap-2">
                    <Carousel slidesToShow={2} slidesToScroll={2} arrows={true} >
                        {friend_goiy?.map((item: any) => (
                            <Body key={item.id} item={item}></Body>
                        ))}
                    </Carousel>
                </div>
            </div>
        </div>
    </>)
}
export default GoiYBanBe