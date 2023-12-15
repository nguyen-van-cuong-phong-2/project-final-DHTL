import Cookies from "js-cookie";
import axios from "axios";
const callApiPost_Json = async (url: string, conditions: object, token_server?: string) => {
    try {
        type header = {
            "Content-Type": string,
            "Authorization": string
        }

        let headers: header = {
            "Content-Type": "application/json",
            Authorization: ""
        };
        const token = Cookies.get("token")
        if (!conditions) conditions = {};

        if (token)
            headers = {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            };
        if (token_server) {
            headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token_server}`,
            };
        }
        console.log(token_server)
        return await axios({
            method: "post",
            url: `${process.env.NEXT_PUBLIC_DOMAIN_API}/${url}`,
            data: JSON.stringify(conditions),
            headers,
        }).then(async (response) => {
            return response.data;
        })
    } catch (error) {
        console.log("🚀 ~ file: callAPI.tsx:38 ~ constcallApiPost_Json= ~ error:", error)
        return error?.response?.data;
    }
};

const callApiPost_formdata = async (url: string, conditions: object, token_server?: string) => {
    try {
        const token = Cookies.get("token")
        if (!conditions) conditions = {};
        return await axios({
            method: "post",
            url: `${process.env.NEXT_PUBLIC_DOMAIN_API}/${url}`,
            data: conditions,
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            },
        }).then(async (response) => {
            return response.data;
        })
    } catch (error) {
        return error?.response?.data;
    }
};

export const callApi_Login = async (data: object) => {
    const response = await callApiPost_Json('user/login', data);
    return response;
}

export const callApi_Register = async (data: object) => {
    const response = await callApiPost_Json('user/register', data)
    return response;
}

export const callApi_uploadAvatar = async (data: object) => {
    const response = await callApiPost_formdata('user/uploadAvatar', data)
    return response;
}

export const callApi_getInforUser = async (data: object, token?: string) => {
    const response = await callApiPost_Json('user/getInforUser', data, token)
    return response;
}

export const callApi_SearchUser = async (data: object) => {
    const response = await callApiPost_Json('user/SearchUser', data)
    return response;
}

export const callApi_MakeFriend = async (data: object) => {
    const response = await callApiPost_Json('friend/sendMakeFriend', data)
    return response;
}

export const callApi_cancelMakeFriend = async (data: object) => {
    const response = await callApiPost_Json('friend/cancelMakeFriend', data)
    return response;
}