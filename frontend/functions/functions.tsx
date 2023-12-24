import Cookies from "js-cookie";
import JWT from "jsonwebtoken";
import { redirect } from 'next/navigation';

interface TokenInfo {
    id: number;
}

export class functions {
    public getTokenFromClientSide() {
        try {
            const token = Cookies.get('token');
            return token
        } catch (error) {
            return null
        }
    }

    public getInfoFromToken() {
        try {
            const token = this.getTokenFromClientSide();
            const response = JWT.decode(token as string);

            if (typeof response === 'object' && response !== null) {
                // If the response is an object and not null, attempt to cast it to TokenInfo
                const tokenInfo = response as TokenInfo;
                return tokenInfo;
            } else {
                return null
            }
        } catch (error) {
            return null
        }
    }

    public getTokenServerSide(context: any) {
        try {
            const cookieString = context.req.headers.cookie;
            const token = cookieString
                .split(";")
                .find((cookie: any) => cookie.trim().startsWith("token="));
            const tokenValue = token.split('=')[1];
            return tokenValue
        } catch (error) {
            return null
        }
    };

    public async getInfoFromTokenServerSide(token: string) {
        try {
            const response = JWT.decode(token as string);
            if (typeof response === 'object' && response !== null) {
                // If the response is an object and not null, attempt to cast it to TokenInfo
                const tokenInfo = response as TokenInfo;
                return tokenInfo;
            } else {
                return null
            }
        } catch (error) {
            return redirect('/Login')
        }
    }

    public TimeAgo = (time: number) => {
        try {
            const currentTime = Date.now() / 1000;
            const inputTime = time / 1000;
            const tg = currentTime - inputTime;
            if (tg < 60) {
                return `${Math.floor(tg)} giây trước`;
            } else if (tg >= 60 && tg < 3600) {
                return `${Math.floor(tg / 60)} phút trước`;
            } else if (tg >= 3600 && tg < 86400) {
                return `${Math.floor(tg / 3600)} giờ trước`;
            } else if (tg >= 86400 && tg < 2592000) {
                return `${Math.floor(tg / 86400)} ngày trước`;
            } else if (tg >= 2592000 && tg < 77760000) {
                return `${Math.floor(tg / 2592000)} tháng trước`;
            } else if (tg >= 77760000) {
                return `${Math.floor(tg / 77760000)} năm trước`;
            }
        } catch (error) {
            return ''
        }
    }
}
