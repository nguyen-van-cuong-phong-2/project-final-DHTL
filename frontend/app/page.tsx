import Header from "../components/header/header";
import LeftBody from "../components/navbar/navbar-left";
import RightBody from "../components/navbar/navbar-right";
import BettwenBody from "../components/Body/main-body";
import ArrMessage from "../components/Body/arrMessage";
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { callApi_getInforUser } from "../api/callAPI";
import { functions } from '../functions/functions'
import { callApi_GetNews, callApi_SuggestFriends } from "../api/callAPI";
import PopUpCuocGoiDen from "../components/videoCall/popUpCuocGoiDen";

async function LoadingData(token: string): Promise<any> {
  const user = await new functions().getInfoFromTokenServerSide(token);
  const playlists = await callApi_getInforUser({ id: Number(user.id) }, token)
  return playlists
}

const GetNews = async (token: string) => {
  const response = await callApi_GetNews({ page: 1 }, token);
  return response
}

const SuggestFriends = async (token: string) => {
  const response = await callApi_SuggestFriends(token);
  return response
}

export default async function Home() {
  const cookieStore = cookies();
  const fnc = new functions();
  const token = cookieStore.get('token')
  if (!token) redirect('/Login');
  const data_promise = LoadingData(token.value);
  const result_promise = GetNews(token.value);
  const SuggestFriend_promise = SuggestFriends(token.value)
  const user: any = await fnc.getInfoFromTokenServerSide(token.value)
  if (!user || !user.active || user.active == 0) {
    redirect('/Otp');
  } else if (!user.avatar || user.avatar == null || user.avatar == 'null' || user.avatar.includes('null')) {
    redirect('/UploadAvatar');
  }

  const [data, result, friend_goiy] = await Promise.all([
    data_promise, result_promise, SuggestFriend_promise
  ])
  return (
    <div className="w-full">
      <Header data={data?.data}></Header>
      <div className="flex justify-between w-full">
        <LeftBody data={data?.data} />
        <BettwenBody data={data?.data} result={result?.data} friend_goiy={friend_goiy?.data} />
        <RightBody />
        <ArrMessage></ArrMessage>
        <PopUpCuocGoiDen></PopUpCuocGoiDen>
      </div>
    </div>
  );
}
