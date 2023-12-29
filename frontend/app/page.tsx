import Header from "../components/header/header";
import LeftBody from "../components/navbar/navbar-left";
import RightBody from "../components/navbar/navbar-right";
import BettwenBody from "../components/Body/main-body";
import ArrMessage from "../components/Body/arrMessage";
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { callApi_getInforUser } from "../api/callAPI";
import { functions } from '../functions/functions'
import { callApi_GetNews } from "../api/callAPI";

async function LoadingData(token: string): Promise<any> {
  const user = await new functions().getInfoFromTokenServerSide(token);
  const playlists = await callApi_getInforUser({ id: Number(user.id) }, token)
  return playlists
}

const GetNews = async (token: string) => {
  const response = await callApi_GetNews({ page: 1 }, token);
  return response
}


export default async function Home() {
  const cookieStore = cookies()
  const token = cookieStore.get('token')
  if (!token) redirect('/Login');
  const data_promise = LoadingData(token.value);
  const result_promise = GetNews(token.value);
  const [data, result] = await Promise.all([
    data_promise, result_promise
  ])
  return (
    <div className="w-full">
      <Header data={data?.data}></Header>
      <div className="flex justify-between w-full">
        <LeftBody data={data?.data} />
        <BettwenBody data={data?.data} result={result?.data} />
        <RightBody />
        <ArrMessage></ArrMessage>
      </div>
    </div>
  );
}
