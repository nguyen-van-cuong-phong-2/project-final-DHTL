import Header from "@/components/header/header";
import LeftBody from "@/components/Body/left";
import RightBody from "@/components/Body/right";
import BettwenBody from "@/components/Body/bettwen";
export default function Home() {
  return (
    <>
      <Header></Header>
      <div className="flex">
        <LeftBody />
        <BettwenBody />
        <RightBody />
      </div>
    </>
  );
}
