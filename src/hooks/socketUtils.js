import { fetchRequestCaller } from "../utils";

export const fetchInitialChatStatus = async (chatUser, user) => {
    let res = fetchRequestCaller({
        method: "GET",
        url: "/chats/getChatStatus/" + chatUser,
        token: user?.token
    });
    return res;
};

export const getNotificationCount = (notifications, friendId) => {
    return notifications?.find(n => n.senderId == friendId)?.count || null;
};