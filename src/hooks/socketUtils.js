import { fetchRequestCaller } from "../utils";

export const fetchInitialChatStatus = async (chatUser, user) => {
    let res = fetchRequestCaller({
        method: "GET",
        url: "/chats/getChatStatus/" + chatUser,
        token: user?.token
    });
    return res;
};