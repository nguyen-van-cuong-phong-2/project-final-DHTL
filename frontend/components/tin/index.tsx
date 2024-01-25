import { Carousel } from 'antd';
import ItemTin from './ItemTin';

const Tin = () => {
    return (<>
        <div className="w-full flex justify-center">
            <div className={`w-[68%] h-max mt-5 max-lg:w-full
        max-lg:m-0 max-lg:mt-5 ml-3`}>
                <div className="gap-2">
                    <Carousel slidesToShow={4} slidesToScroll={2} arrows={true} >
                       <ItemTin></ItemTin>
                       <ItemTin></ItemTin>
                       <ItemTin></ItemTin>
                       <ItemTin></ItemTin>
                       <ItemTin></ItemTin>
                       <ItemTin></ItemTin>
                    </Carousel>
                </div>
            </div>
        </div>
    </>)
}
export default Tin;