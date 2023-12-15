import Header from "../components/header/header";
import LeftBody from "../components/navbar/navbar-left";
import RightBody from "../components/navbar/navbar-right";
import BettwenBody from "../components/Body/main-body";
import ArrMessage from "../components/Body/arrMessage";
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { callApi_getInforUser } from "../api/callAPI";
import { functions } from '../functions/functions'

async function LoadingData(token: string): Promise<any> {
  const user = await new functions().getInfoFromTokenServerSide(token);
  const playlists = await callApi_getInforUser({ id: Number(user.id) })
  return playlists
}

export default async function Home() {
  const cookieStore = cookies()
  const token = cookieStore.get('token')
  if (!token) redirect('/Login');
  const data = await LoadingData(token.value);
  return (
    <div className="w-full">
      <Header data={data?.data[0]}></Header>
      <div className="flex mt-[80px] justify-between w-full">
        <LeftBody data={data?.data[0]} />
        <BettwenBody data={data?.data[0]} />
        <RightBody />
        <ArrMessage></ArrMessage>
      </div>
    </div>
  );
}
