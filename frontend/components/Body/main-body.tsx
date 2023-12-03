"use client";
import { useState } from "react";
import PostNew from "./layout/post_new";
import PopupPostNew from "../popup/postNew";
import News from "./news";
export default function BettwenBody() {
  const [popUpPostNew, SetPopUpPostNew] = useState(false);
  return (


    <div className="
      flex 
      flex-col 
      border 
      rounded 
      w-3/5 
      p-2 
      
      h-screen 
      overflow-auto
      no-scrollbar
      ml-20
      max-lg:w-full
      max-lg:m-0
      "
    >

      <PostNew></PostNew>
      {popUpPostNew && <PopupPostNew></PopupPostNew>}
      <News></News>
      <News></News>
      <News></News>
      <News></News>
      <News></News>

    </div>


  );
}
