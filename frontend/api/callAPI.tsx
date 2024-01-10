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
        return await axios({
            method: "post",
            url: `${process.env.NEXT_PUBLIC_DOMAIN_API}/${url}`,
            data: JSON.stringify(conditions),
            headers,
        }).then(async (response) => {
            return response.data;
        })
    } catch (error) {
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

export const callApi_notification = async (data: object) => {
    const response = await callApiPost_Json('notification/getNotification', data)
    return response;
}

export const callApi_acceptMakeFriend = async (data: object) => {
    const response = await callApiPost_Json('friend/acceptMakeFriend', data)
    return response;
}

export const callApi_DeleteMakeFriend = async (data: object) => {
    const response = await callApiPost_Json('friend/cancelMakeFriend', data)
    return response;
}

export const callApi_GetListFriendOnline = async (data: object) => {
    const response = await callApiPost_Json('friend/getListFriendOnline', data)
    return response;
}

export const callApi_PostNews = async (data: object) => {
    const response = await callApiPost_Json('news/PostNews', data)
    return response;
}

export const callApi_GetNews = async (data: object, token?: string) => {
    const response = await callApiPost_Json('news/GetNews', data, token)
    return response;
}

export const callApi_LikeNews = async (data: object, token?: string) => {
    const response = await callApiPost_Json('news/LikeNews', data, token)
    return response;
}

export const callApi_GetDetailNews = async (data: object, token?: string) => {
    const response = await callApiPost_Json('news/GetDetailNews', data, token)
    return response;
}

export const callApi_GetMessage = async () => {
    const response = await callApiPost_Json('message/getMessage', {})
    return response;
}

export const callApi_GetOfflineUser = async (data: object) => {
    const response = await callApiPost_Json('user/getOfflineUser', data)
    return response;
}

export const callApi_GetReels = async (data: object) => {
    const response = await callApiPost_Json('reels/GetReels', data)
    return response;
}