
import Header from '../../components/header/header';
import { functions } from '../../functions/functions'
import { callApi_getInforUser } from "../../api/callAPI";
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Clip from '../../components/reels/Clip';
import Image from 'next/image';


async function LoadingData(token: string): Promise<any> {
    const user = await new functions().getInfoFromTokenServerSide(token);
    const playlists = await callApi_getInforUser({ id: Number(user.id) }, token)
    return playlists
}

export default async function Index() {
    const cookieStore = cookies()
    const token = cookieStore.get('token')
    if (!token) redirect('/Login');
    const data = await LoadingData(token.value);


    return (<>
        <div className='flex w-screen h-screen justify-center m-0 gap-8 bg-black relative'>
            <Header data={data?.data} reels={true}></Header>
            <div className='absolute top-0  h-screen z-[9999] left-[33%] w-full'>
                <div className='flex w-full justify-start items-center gap-2 mt-5'>
                    <div className='w-10 h-10 relative ml-[55px]'>
                        <Image
                            className="border rounded-full box-border"
                            src={"/images/user.png"}
                            objectFit="cover"
                            fill={true}
                            quality={100}
                            alt="avatar"
                        />
                    </div>
                    <div className='text-white'>Nguyễn Cường</div>
                </div>
                <div className='flex items-center justify-start'>
                    <Clip></Clip>
                </div>

            </div>
        </div>
    </>)
}
