'use client'
import { useEffect, useState } from "react";
import { MdKeyboardBackspace } from "react-icons/md";
import { app } from '../../components/firebase/firebaseConfig'
import { getAuth, signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useMyContext } from "../../components/context/context";
import { callApi_AuthenticationAccount } from "../../api/callAPI";
import { functions } from "../../functions/functions";
import Cookies from "js-cookie";
export default function Index() {
    const [otp, setOTP] = useState<object>({});
    const [result, setResult] = useState<any>();
    const router = useRouter();
    const { SetContentNotifi, setLoading } = useMyContext();

    const fnc = new functions();
    useEffect(() => {
        setLoading(false);
    }, [])
    const signin = async () => {
        const token = Cookies.get('token');
        const user: any = await fnc.getInfoFromTokenServerSide(token)
        const auth = getAuth(app);
        let verify = new RecaptchaVerifier(auth, 'sign-in-button', {
            'size': 'invisible',
        });
        const phone = user.userName.replace('0', '+84')
        signInWithPhoneNumber(auth, phone, verify)
            .then((confirmationResult) => {
                setResult(confirmationResult)
            }).catch((error) => {
            });
        setLoading(false)
    }
    const ValidateOtp = async () => {
        if (JSON.stringify(otp) == '{}') {
            SetContentNotifi('Nhập vào mã OTP')
            return
        }
        setLoading(true)
        let OTP = '';
        Object.keys(otp).forEach(key => {
            OTP += otp[key]
        });

        result.confirm(Number(OTP)).then(async (result: any) => {
            const response = await callApi_AuthenticationAccount();
            Cookies.set('token', response?.data?.token);
            setLoading(false)
            SetContentNotifi('Xác thực thành công')
            router.push('/')
        }).catch((err: any) => {
            setLoading(false)
            SetContentNotifi('Mã xác thực không chính xác')
        })
    }

    const setDataOtp = (value: string, target: number) => {
        const object = { ...otp };
        object[target] = value;
        setOTP(object)
    }
    return (
        <>
            <div className="mx-auto border max-w-sm mt-20 rounded">
                <div className="text-xl font-medium text-center">Xác thực OTP</div>
                <form className="shadow-md px-4 py-6">
                    <div className="flex justify-center gap-2 mb-6">
                        <input
                            className="w-12 h-12 text-center border rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500"
                            type="text"
                            maxLength={1}
                            pattern="[0-9]"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            onChange={(e) => setDataOtp(e.target.value, 1)}

                        />
                        <input
                            className="w-12 h-12 text-center border rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500"
                            type="text"
                            maxLength={1}
                            pattern="[0-9]"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            onChange={(e) => setDataOtp(e.target.value, 2)}
                        />
                        <input
                            className="w-12 h-12 text-center border rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500"
                            type="text"
                            maxLength={1}
                            pattern="[0-9]"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            onChange={(e) => setDataOtp(e.target.value, 3)}
                        />
                        <input
                            className="w-12 h-12 text-center border rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500"
                            type="text"
                            maxLength={1}
                            pattern="[0-9]"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            onChange={(e) => setDataOtp(e.target.value, 4)}
                        />
                        <input
                            className="w-12 h-12 text-center border rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500"
                            type="text"
                            maxLength={1}
                            pattern="[0-9]"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            onChange={(e) => setDataOtp(e.target.value, 5)}
                        />
                        <input
                            className="w-12 h-12 text-center border rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500"
                            type="text"
                            maxLength={1}
                            pattern="[0-9]"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            onChange={(e) => setDataOtp(e.target.value, 6)}
                        />

                    </div>
                    <div className="flex items-center justify-center">
                        <div className="text-xl justify-items-start cursor-pointer"
                            onClick={() => router.push('/Login')}
                        ><MdKeyboardBackspace></MdKeyboardBackspace></div>

                        <button
                            className="bg-teal-500 ml-4 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="button"
                            onClick={() => ValidateOtp()}
                        >
                            Xác nhận
                        </button>
                        {!result ? <div
                            className="inline-block align-baseline font-bold cursor-pointer text-sm text-teal-500 hover:text-teal-800 ml-4"
                            onClick={() => signin()}
                        >
                            Gửi mã
                        </div> : <div className="inline-block align-baseline font-bold text-sm text-teal-500 hover:text-teal-800 ml-4">
                            Đã gửi mã</div>}
                        <div id="sign-in-button"></div>
                    </div>
                </form>
            </div>
        </>
    )
}
