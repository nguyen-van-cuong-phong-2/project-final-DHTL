"use client";
import Header from "@/components/header/header";
import LeftBody from "@/components/navbar/navbar-left";
import RightBody from "@/components/navbar/navbar-right";
import BettwenBody from "@/components/Body/main-body";
import { PopUpMessage } from "@/components/popup/message";
import { useMyContext } from "@/components/context/context";

export default function Home() {
  const { arrMessage } = useMyContext();
  return (
    <div>
      <Header></Header>
      <div className="flex mt-[75px] justify-between">
        <LeftBody />
        <BettwenBody />
        <RightBody />
        <div className="right-20 fixed z-50 bottom-0 flex gap-2">
          {arrMessage.map((item) => (
            <PopUpMessage key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
