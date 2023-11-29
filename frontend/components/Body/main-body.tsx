"use client";
import { useState } from "react";
import PostNew from "./layout/post_new";
import PopupPostNew from "@/components/popup/postNew";

export default function BettwenBody() {
  const [popUpPostNew, SetPopUpPostNew] = useState(false);
  return (
    <>
      <div className="flex border rounded w-3/5 h-max justify-center p-2">
        <PostNew></PostNew>
        {popUpPostNew && <PopupPostNew></PopupPostNew>}
       
      </div>
    </>
  );
}
