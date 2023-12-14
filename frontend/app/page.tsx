import Header from "../components/header/header";
import LeftBody from "../components/navbar/navbar-left";
import RightBody from "../components/navbar/navbar-right";
import BettwenBody from "../components/Body/main-body";
import ArrMessage from "../components/Body/arrMessage";
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers'
export default async function Home() {
  const cookieStore = cookies()
  const token = cookieStore.get('token')
  if (!token) redirect('/Login')
  return (
    <div className="w-full">
      <Header></Header>
      <div className="flex mt-[80px] justify-between w-full">
        <LeftBody />
        <BettwenBody />
        <RightBody />
        <ArrMessage></ArrMessage>
      </div>
    </div>
  );
}
