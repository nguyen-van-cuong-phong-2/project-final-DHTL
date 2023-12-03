import Cookies from "js-cookie";
import axios from "axios";
const callApiPost_Json = async (url: string, conditions: object, token_freelancer?: string) => {
    try {
        type header = {
            "Content-Type": string,
            "Authorization": string
        }

        let headers: header = {
            "Content-Type": "application/json",
            Authorization: ""
        };
        const token = Cookies.get("token_freelancer")
        if (!conditions) conditions = {};

        if (token)
            headers = {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            };
        if (token_freelancer) {
            headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token_freelancer}`,
            };
        }

        return await axios({
            method: "post",
            url: `${process.env.NEXT_PUBLIC_DOMAIN_API}/${url}`,
            data: JSON.stringify(conditions),
            headers,
        }).then(async (response) => {
            return response.data;
        })
    } catch (error) {
        return error;
    }
};

export const callApiLogin = async (data: object) => {
    const response = await callApiPost_Json('user/login', data)
}

export const callApiRegister = async (data: object) => {
    const response = await callApiPost_Json('user/register', data)
    return response;
}