"use client";
import { useEffect, useRef, useState } from "react";
import PostNew from "./layout/post_new";
import PopupPostNew from "../popup/postNew";
import News from "./news";
import Comment from "../popup/comment";
import { useMyContext } from "../context/context";

interface BettwenBody {
  data: {
    id: number,
    avatar: string,
    name: string,
  },

  result: any
}

const BettwenBody: React.FC<BettwenBody> = ({ data, result }) => {
  const [popUpPostNew, SetPopUpPostNew] = useState(false);
  const [result_1, setResult] = useState<any>(result);
  const [idNews, setIdNews] = useState<number>(0);
  const ref = useRef<any>(null);
  const { } = useMyContext()
  // useEffect(() => {
  //   const fetchAPI = async () => {
  //     const response = await callApi_GetNews({ page: 1 });
  //     setResult(response.data)
  //   }
  //   fetchAPI()
  // }, []);
  useEffect(() => {
    if (ref.current.scrollHeight > ref.current.innerHeight) {
      console.log('2222222222')
    }
    console.log(ref?.current?.innerHeight)
  }, [ref?.current?.innerHeight])
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
      {result_1?.map((item: any) => (
        <News key={item.id} data={item} setIdNews={setIdNews}></News>
      ))}
      {idNews !== 0 && <Comment id={idNews} dataUser={data} setIdNews={setIdNews}></Comment>}
    </div>
  );
}

export default BettwenBody;