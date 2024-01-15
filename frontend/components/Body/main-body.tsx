"use client";
import { useEffect, useRef, useState } from "react";
import PostNew from "./layout/post_new";
import PopupPostNew from "../popup/postNew";
import News from "./news";
import Comment from "../popup/comment";
import { useMyContext } from "../context/context";
import { callApi_GetNews } from "../../api/callAPI";
import GoiYBanBe from "../goi-y-ban-be/GoiYBanBe";

interface BettwenBody {
  data: {
    id: number,
    avatar: string,
    name: string,
  },

  result: any,
  friend_goiy: any
}

const BettwenBody: React.FC<BettwenBody> = ({ data, result, friend_goiy }) => {
  const [popUpPostNew, SetPopUpPostNew] = useState(false);
  const [result_1, setResult] = useState<any>(result);
  const [idNews, setIdNews] = useState<number>(0);
  const [isEndOfScroll, setIsEndOfScroll] = useState(false);
  console.log("🚀 ~ isEndOfScroll:", isEndOfScroll)

  const ref = useRef<any>(null);
  useEffect(() => {
    const fetchAPI = async () => {
      const response = await callApi_GetNews({ page: 1 });
      setResult(response.data)
    }
    fetchAPI()
  }, [popUpPostNew]);
  useEffect(() => {
    const handleScroll = () => {
      const component = ref.current;
      if (component) {
        const isAtEnd = 2 * component.scrollTop >= component.scrollHeight;
        setIsEndOfScroll(isAtEnd);
      }
    };

    const handleApiCall = () => {
      if (isEndOfScroll) {
        // Gọi API ở đây
        setIsEndOfScroll(false)
      }
    };

    const component = ref.current;
    if (component) {
      component.addEventListener('scroll', handleScroll);
    }
    handleApiCall()
    return () => {
      if (component) {
        component.removeEventListener('scroll', handleScroll);
      }
    };
  }, [isEndOfScroll]);
  return (
    <div className="
      flex 
      flex-col 
      border 
      rounded 
      w-3/5 
      p-2 
      no-scrollbar
      h-screen
      overflow-auto
      overscroll-y-contain
      ml-20
      max-lg:w-full
      max-lg:m-0
      mt-[75px]
      max-lg:mt-[50px]
      "
      ref={ref}
    >
      <PostNew data={data} SetPopUpPostNew={SetPopUpPostNew}></PostNew>
      {popUpPostNew && <PopupPostNew data={data} SetPopUpPostNew={SetPopUpPostNew}></PopupPostNew>}
      {result_1?.map((item: any, index: number) =>
        <>
          <News key={item.id} data={item} setIdNews={setIdNews}></News>
          {index == 0 && <GoiYBanBe friend_goiy={friend_goiy}></GoiYBanBe>}
        </>
      )}
      {idNews !== 0 && <Comment id={idNews} dataUser={data} setIdNews={setIdNews}></Comment>}
    </div>
  );
}

export default BettwenBody;