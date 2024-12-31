import React, { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { CustomButton, TextInput } from "../../components/elementComponents";
import ChatBox from "../../components/ChatBox/ChatBox";
import {
  getConversation,
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
import { useSocket } from "../../hooks/useSocket";
import { TbSocial } from "react-icons/tb";
import { MdSocialDistance } from "react-icons/md";
import { BiChat } from "react-icons/bi";
import { BsFillChatSquareFill } from "react-icons/bs";

const Chats = ({ }) => {
  const { user } = useSelector((state) => state.user);
  const {
    chatMessages,
    UploadedFile: { fileType, fileLink },
  } = useSelector((state) => state.chats);
  const dispatch = useDispatch();


  const {
    connected,
    friendsStatus,
    currentChat,
    setCurrentChat,
    users } = useSocket();

  return (
    <div className="flex w-full bg-secondary c-height">
      <div
        className={`w-1/6 lg:min-w-[20%] lg:max-w-[17%] md:min-w-[27%] md:max-w-[27%] border-r-ascent-1 border-r-2 shadow-2xl shadow-ascent-1 max-md:w-full max-md:${currentChat ? "hidden" : "min-w-full"
          }`}
      >
        <div className=" flex justify-start items-center p-3 py-7 mb-1  border-b-4 border-b-blue">
          <div className=" p-2  bg-[#065ad8] rounded text-white">
            <BsFillChatSquareFill fontSize={22} />
          </div>
          <div className="">
            <h1 className="text-4xl max-md:text-3xl max-md:pl-5 w-full shadow-[#212121] rounded-lg font-bold pl-2 text-blue ">
              Chats
            </h1>
          </div>
        </div>
        <ul className="w-full px-1">
          {user?.friends?.map((friend) => (
            <FriendsInfoCard friend={friend} key={friend._id} />
            // <p key={friend?._id} className="text-xl text-white">{friend?._id}</p>
          ))}
        </ul>
      </div>
      <div
        className={`w-5/6 c-height flex justify-center items-center flex-col text-white ${currentChat ? "w-full" : "hidden"
          }`}
        style={{
          backgroundImage: "url('/images/chatBG.png')",
          backgroundSize: "contain",
        }}
      >
        {currentChat && (
          <ChatBox
            key={"chatbox"}
          />
          // <p>{currentChat?.name}</p>
        )}
      </div>
    </div>
  );
};

export default Chats;
