import { useDispatch } from "react-redux";
import { serverCon } from "../App";
import { SetPosts } from "../redux/postSlice";
export const apiReqest = async ({ url, token, data, method, headers }) => {
    try {
        let response = await serverCon(url, {
            method: method || "GET",
            data: data,
            headers: headers ?? {
                "Content-Type": "application/json",
                Authorization: token ? `Bearer ${token}` : ""
            }
        });
        return response?.data;
    } catch (error) {
        return (error?.response?.data);
    }
};

export const fetchPosts = async ({ url, dispatch, token, data, method }) => {
    try {
        const res = await apiReqest(
            {
                url: url || "/posts",
                token: token,
                data: data || {},
                method: method || "POST"
            }
        );
        dispatch(SetPosts(res?.data));
        return (res);
    } catch (error) {
        return (error?.response?.data);
    }
};

export const fetchRequestCaller = async ({ url, token, data, method, headers }) => {
    try {
        const res = await apiReqest(
            {
                url: url || "/users/suggested-friends",
                token: token || "",
                data: data || {},
                method: method || "POST",
                headers: headers
            }
        );
        return (res);
    } catch (error) {
        return (error?.response);
    }
};