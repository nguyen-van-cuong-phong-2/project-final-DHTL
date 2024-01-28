import { Carousel } from 'antd';
import ItemTin from './ItemTin';
import { useEffect, useState } from 'react';
import { callApi_GetListStories } from '../../api/callAPI';

const Tin = () => {
    const [data, setData] = useState([]);
    useEffect(() => {
        const callAPI = async () => {
            const response = await callApi_GetListStories({ page: 1 })
            setData([response.data_user, ...response.data])
        }
        callAPI();
    }, []);
    const width = data.length < 4 ? data.length * 7 : 68;
    return (<>
        <div className="w-full flex justify-center">
            <div className={`w-[68%] mt-5 max-lg:w-full
        max-lg:m-0 max-lg:mt-5 ml-3`}>
                <div className={`w-[${width}%]`}>
                    <Carousel slidesToShow={data?.length < 4 ? data?.length : 4} slidesToScroll={2} arrows={true} >
                        {data?.map((item: any, index: number) => (
                            <ItemTin key={index} index={index} item={item}></ItemTin>
                        ))}
                    </Carousel>
                </div>
            </div>
        </div>
    </>)
}
export default Tin;