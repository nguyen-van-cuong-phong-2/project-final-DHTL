import Header from "@/components/header/header";
import LeftBody from "@/components/navbar/navbar-left";
import RightBody from "@/components/navbar/navbar-right";
import BettwenBody from "@/components/Body/main-body";
export default function Home() {
  return (
    <div>
      <Header></Header>
      <div className="flex mt-[75px] justify-between">
        <LeftBody />
        <BettwenBody />
        <RightBody />
      </div>
    </div>
  );
}
