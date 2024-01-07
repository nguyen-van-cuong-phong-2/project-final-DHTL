import AnhBia from "../../components/profile/anhBia";
import Header from "../../components/header/header";
import Body from "../../components/profile/body";
import { callApi_getInforUser } from '../../api/callAPI';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { functions } from '../../functions/functions';

async function LoadingData(id: number, token: string): Promise<any> {
    const data = await callApi_getInforUser({ id: Number(id) }, token)
    return data
}

async function LoadingDataToken(token: string): Promise<any> {
    const user = await new functions().getInfoFromTokenServerSide(token);
    const playlists = await callApi_getInforUser({ id: Number(user.id) }, token)
    return playlists
}

export default async function Profile({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {

    const cookieStore = cookies()
    const token = cookieStore.get('token')
    if (!token) redirect('/Login');
    const data_promise = LoadingData(Number(searchParams.id), token.value);
    const data_infoSelf_promise = LoadingDataToken(token.value);
    const [data, data_infoSelf] = await Promise.all([data_promise, data_infoSelf_promise]);

    if (!data?.data) {
        return redirect('/');
    }

    return (
        <>
            <Header data={data_infoSelf.data}></Header>
            <div className="block border">
                <AnhBia data={data.data}></AnhBia>
                <Body data={data.data}></Body>
            </div>

        </>
    )
}