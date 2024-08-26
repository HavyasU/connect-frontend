import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CustomButton, TextInput } from "../../components/elementComponents";
import ChatBox from "../../components/ChatBox/ChatBox";
import {
  getConversation,
  getMessages,
  getUnreadMessageCount,
  saveMessage,
  updateMessagesAsRead,
} from "./ChatUtils";
import {
  SetChatMessages,
  SetConversationMessages,
  SetFileLInk,
  SetRawFile,
} from "../../redux/ChatSlice";
import FriendsInfoCard from "../../components/ChatComponents/FriendsInfoCard";
import { fetchInitialChatStatus } from "../../hooks/socketUtils";

const Chats = ({
  socket,
  connected,
  sendMessage,
  onMessage,
  friendsStatus,
  typingStatus,
  setFriendsStatus,
}) => {
  const { user } = useSelector((state) => state.user);
  const {
    chatMessages,
    UploadedFile: { fileType, fileLink },
  } = useSelector((state) => state.chats);
  const [conversationId, setConversationId] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const [unreadMessagesCount, setUnreadMeassagesCount] = useState([]);
  const dispatch = useDispatch();

  const dispatchChatMessages = (payload) => {
    dispatch(SetChatMessages(payload));
  };

  const findFriend = (id) => user.friends.find((friend) => friend._id === id);

  useEffect(() => {
    if (socket) {
      const handlePrivateMessage = ({
        fromUserId,
        message,
        createdAt,
        type,
        fileUrl,
      }) => {
        if (currentChat === fromUserId) {
          dispatchChatMessages({
            senderId: findFriend(fromUserId),
            text: message,
            createdAt,
            type,
            fileUrl,
          });
        } else {
          getUnreadCount();
        }
      };
      const handleMessageReadStatus = (data) => {
        const { userId } = data;
        if (currentChat === userId) {
        }
      };

      socket.on("private_message", handlePrivateMessage);
      socket.on("message_read", handleMessageReadStatus);
      return () => {
        socket.off("private_message", handlePrivateMessage);
        socket.off("message_read", handleMessageReadStatus);
      };
    }
  }, [currentChat, socket]);

  const handleChatSubmit = async ({ chatInput }, resetChatInput) => {
    if (!fileLink && !chatInput?.trim()) return;
    const data = {
      toUserId: currentChat,
      message: chatInput,
      createdAt: new Date(),
      type: fileType ?? null,
      fileUrl: fileLink ?? null,
    };
    socket.emit("private_message", data);
    await saveMessage(
      conversationId,
      user._id,
      currentChat,
      fileType ?? "",
      chatInput,
      fileLink || "",
      user
    );
    dispatchChatMessages({
      senderId: user,
      text: chatInput,
      createdAt: new Date(),
      type: fileType ?? null,
      fileUrl: fileLink ?? null,
    });
    dispatch(SetRawFile(null, null));
    dispatch(SetFileLInk(null, null));
    resetChatInput();
  };

  useEffect(() => {
    if (currentChat) {
      getConversation(user._id, currentChat).then((res) =>
        setConversationId(res?.conversationId ?? null)
      );
    }
  }, [currentChat, user._id]);

  const getChatMessages = () => {
    if (conversationId) {
      getMessages(conversationId, user).then((res) =>
        dispatch(SetConversationMessages(res.data))
      );
    }
  };
  useEffect(() => {
    getChatMessages();
  }, [conversationId, user]);

  useEffect(() => {
    if (conversationId) {
      updateMessagesAsRead(conversationId, user).then(() => {
        const data = {
          currentChat,
        };
        socket.emit("message_read", data);
        getUnreadCount();
      });
    }
  }, [currentChat, conversationId, chatMessages]);

  const getUnreadCount = async () => {
    let msgCount = await getUnreadMessageCount(user);
    setUnreadMeassagesCount(msgCount?.unreadMessages || []);
  };
  const getInitialChatStatus = async () => {
    let res = await fetchInitialChatStatus(currentChat, user);
    setFriendsStatus((prev) => ({ ...prev, [currentChat]: res?.chatStatus }));
  };
  useEffect(() => {
    getUnreadCount();
    getInitialChatStatus();
    // setTimeout(() => {
    //   getUnreadCount();
    // }, 1000);
  }, [currentChat, user, conversationId]);

  const handleFriendClick = (friendId) => {
    setCurrentChat(friendId);
  };
  const findUnreadMessage = (friendId) => {
    let friend =
      unreadMessagesCount &&
      unreadMessagesCount?.find((friend) => friend._id === friendId);
    return friend?.unreadCount || null;
  };

  return (
    <div className="  flex  w-full bg-secondary c-height">
      <div
        className={`w-1/6  border-r-ascent-1 border-r-2 shadow-2xl shadow-ascent-1 max-md:w-full max-md:${
          currentChat ? "hidden" : "min-w-full"
        }`}
      >
        <h1 className="text-4xl max-md:text-3xl max-md:pl-5 w-full shadow-[#212121] rounded-lg font-bold pl-2 text-blue py-4 pb-6 mb-0.5 border-b-4 border-b-blue">
          Chats
        </h1>
        <ul className="w-full px-1">
          {user?.friends?.map((friend) => (
            <FriendsInfoCard
              friend={friend}
              friendsStatus={friendsStatus}
              currentChat={currentChat}
              findUnreadMessage={findUnreadMessage}
              handleFriendClick={handleFriendClick}
              typingStatus={typingStatus}
            />
          ))}
        </ul>
      </div>
      <div
        className={`w-5/6 c-height  flex justify-center items-center flex-col   text-white ${
          currentChat ? "w-full" : "hidden"
        } `}
        style={{
          backgroundImage: "url('/images/chatBG.png')",
          backgroundSize: "contain",
        }}
      >
        {currentChat && (
          <ChatBox
            key={"chatbox"}
            currentChat={currentChat}
            handleChatSubmit={handleChatSubmit}
            friendsStatus={friendsStatus}
            typingStatus={typingStatus}
            socket={socket}
            setCurrentChat={setCurrentChat}
          />
        )}
      </div>
    </div>
  );
};

export default Chats;
