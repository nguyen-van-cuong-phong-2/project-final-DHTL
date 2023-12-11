import Cookies from "js-cookie";
import JWT from "jsonwebtoken";

interface TokenInfo {
    id: number;
}

export class functions {
    public getTokenFromClientSide() {
        try {
            const token = Cookies.get('token');
            return token
        } catch (error) {
            console.log(error)
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
                throw new Error('Invalid response type');
            }
        } catch (error) {
            throw new Error('Error decoding token');
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
}
