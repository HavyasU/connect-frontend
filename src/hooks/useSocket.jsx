import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { getNotificationCount } from './socketUtils';

// "undefined" means the URL will be computed from the `window.location` object

const URL = import.meta.env.VITE_SOCKET_URL;
const socketContext = createContext();

export const useSocket = () => {
    return useContext(socketContext);
};

const socketContextProvider = ({ children }) => {
    const { user } = useSelector(state => state.user);
    const socket = useRef(null);
    const [connected, setConnected] = useState(false);
    const [currentConversation, setCurrentConversation] = useState(null);
    const [chatHistory, setChatHistory] = useState([]);
    const [currentChat, setCurrentChat] = useState("");
    const [chatLoading, setChatLoading] = useState(false);

    const [notifications, setNotifications] = useState({
        "001": 0
    });
    const [users, Setusers] = useState([
        {
            status: "online", 
            typing: false,
            _id: "653063f584f1236168a109ca",
        },
    ]);
    const [isTyping, setIsTyping] = useState(false); // to maintian the typing of this user.

    const findUserByUserId = (userId) => {
        return users.findIndex((user) => user.userId === userId);
    };

    useEffect(() => {
        socket.current = io(URL);
        socket.current?.on('connect', () => {
            setConnected(true);
            const userData = {
                userId: user._id,
            };
            socket.current?.emit('active', userData);
        });
        return () => {
            socket.current?.close();
            setConnected(false);
        };
    }, [socket]);

    const handleUsers = (users) => {
        Setusers(users);
    };
    socket?.current?.on("users", handleUsers);

    const sendMessage = (data) => {
        console.log(data);
        // data = {message, to}
        data = { ...data, toUserId: currentChat };
        console.log(JSON.stringify(data));
        socket?.current?.emit("private_message", data);
    };

    // Receiving messages and also setting notifications for messages from other conversations
    const onMessage = (data) => {
        const { senderId, recieverId } = data;
        
        if (senderId?._id === currentChat || recieverId?._id === currentChat) {
            // Mark message as received if it's in current chat
            updateMessagesAsRecieved(recieverId, senderId);
            const copyHatsHistory = chatHistory;
            setChatHistory([...copyHatsHistory, data]);
        } else {
            setNotifications({
                [senderId?._id]: notifications[senderId?._id] + 1 || 1
            });
        }
    };
    socket?.current?.on("private_message", onMessage);

    //update the typing status.
    useEffect(() => {
        socket.current?.emit("user_typing", { isTyping, toUserID: currentChat });
    }, [isTyping]);

    const handleUserTyping = (data) => {
        const { fromUserID, isTyping } = data;
        const updatedUsers = [...users];
        const userIndex = findUserByUserId(fromUserID);
        if (userIndex >= 0) {
            updatedUsers[userIndex].typing = isTyping;
            Setusers(updatedUsers);
        }
    };
    socket.current?.on("user_typing", handleUserTyping);

    // Getting conversation chats and setting the current conversation
    const getConversationChats = async (currentChat) => {
        socket?.current?.emit("get_conversation_chats", { currentChat });
        setChatLoading(true);
    };

    const fetchConversations = (page) => {
        if (currentChat) {
            getConversationChats(currentChat, page);
        }
    };

    useEffect(() => {
        // fetchConversations(1);
        getConversationChats(currentChat, 1);
        setChatHistory([]);
    }, [currentChat]);

    const getNextPageChats = async () => {
        if (!chatLoading) {
            setChatLoading(true);
            await getConversationChats(currentChat);
        }
    };

    const onConversationChats = (data) => {
        // data={chats}
        const prevChats = [...chatHistory];
        console.log(data);
        if (data) {
            setChatHistory([...data, ...prevChats]);
        }
        setChatLoading(false);
    };
    socket?.current?.on("conversation_chats", onConversationChats);

    // Getting friends status

    const updateMessageAsSeen = (data) => {
        // data={conversationId}
        socket?.current?.emit("message_seen", data);
    };

    const updateMessagesAsRecieved = (recieverId, senderId) => {
        const data = { recieverId, senderId };
        socket?.current?.emit("message_recieved", data);
    };

    const values = {
        connected: connected || null,
        socket: socket.current,
        setIsTyping,
        setCurrentConversation,
        currentConversation,
        chatHistory,
        setChatHistory,
        currentChat,
        setCurrentChat,
        users,
        sendMessage,
        notifications,
        setNotifications,
        chatLoading,
        setChatLoading,
        getNextPageChats
    };

    return (
        <socketContext.Provider value={values} >
            {children}
        </socketContext.Provider >
    );
};

export default socketContextProvider;
