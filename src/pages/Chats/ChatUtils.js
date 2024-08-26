import { fetchRequestCaller } from "../../utils";


export const getConversation = async (user, friend) => {
    let conversation = await fetchRequestCaller({
        method: "POST",
        data: {
            "user1": user,
            "user2": friend
        },
        token: user ? user.token : null,
        url: "/chats/conversation"
    });
    return conversation;
};

export const saveMessage = async (
    conversationId,
    senderId,
    recieverId,
    type,
    text, file, user) => {
    let res = await fetchRequestCaller({
        data: {
            conversationId,
            senderId,
            recieverId,
            text,
            type: type || "",
            fileUrl: file || ""
        },
        method: "POST",
        url: "chats/saveMessage",
        token: user ? user.token : null
    });
    return res;
};

export const getMessages = async (conversationId, user) => {
    let res = await fetchRequestCaller({
        data: {
            "conversationId": conversationId
        },
        url: "chats/getMessages",
        method: "POST",
        token: user ? user.token : null
    });
    return res;
};

//message read/unread tracking
export const updateMessagesAsRead = async (conversationId, user) => {
    let res = await fetchRequestCaller({
        url: `/chats/updateReadMessages/${conversationId}/${user._id}`,
        method: "POST",
        token: user ? user.token : null
    });
    return res;
};
export const getUnreadMessageCount = async (user) => {
    let res = await fetchRequestCaller({
        url: `/chats/getUnreadCount/${user._id}`,
        method: "POST",
        token: user ? user.token : null
    });
    return res;
};
