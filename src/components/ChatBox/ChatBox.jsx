import React, { useEffect, useRef, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { CustomButton, Loading, TextInput } from "../elementComponents";
import { useSelector } from "react-redux";
import EmojiPickerContainer from "../EmojiPicker/EmojiPicker";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import AttchFileIcon from "../ChatFooterComponents/AttchFileIcon";
import { IoCheckmark, IoCheckmarkCircleSharp, IoCheckmarkDoneOutline, IoSend } from "react-icons/io5";
import { baseUrlForUploads } from "../../App";
import FilePreview from "../ChatsFilesPreview/FilePreview";
import moment from "moment";
import { BiArrowBack, BiLeftArrow, BiLeftArrowAlt } from "react-icons/bi";
import { useSocket } from "../../hooks/useSocket";
import { NoProfile } from "../../assets";

const ChatBox = ({

}) => {

  const { currentChat, setCurrentChat, chatHistory, users: friendsStatus, setIsTyping, sendMessage, chatLoading, getNextPageChats } = useSocket();
  const { user } = useSelector((state) => state.user);
  const [emojiContainerOpen, setEmojiContainerOpen] = useState(false);
  const scrollRef = useRef(null);
  const chatContainer = useRef(null);
  const [currentChatPage, setCurrentChatPage] = useState(1);
  const [userVisibleChats, setUserVisibleChats] = useState([]);
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();

  const formatDate = (date) => {
    const now = moment();
    const dateMoment = moment(date);

    if (dateMoment.isSame(now, "day")) {
      return `Today ${dateMoment.format("h:mm a")}`;
    } else if (dateMoment.isSame(now.subtract(1, "day"), "day")) {
      return `Yesterday ${dateMoment.format("h:mm a")}`;
    } else {
      return dateMoment.format("MM/DD/YYYY h:mm a");
    }
  };


  const findFriend = useMemo(() => {
    return (id) => {
      return user.friends.find((friend) => friend._id === id);
    };
  }, [user.friends]);

  // Scroll to bottom only when sending a new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end'
      });
    }
  }, [chatHistory]);

  const resetChatInput = () => {
    setValue("chatInput", "");
  };

  let typingTimeoutRef = useRef(null);

  const UpdateTypingStatus = () => {
    setIsTyping(true);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 3000);
  };

  // infinite scroll
  // useEffect(() => {
  //   if(chatHistory){
  //     userVisibleChats()
  //   }
  // }, [chatHistory, currentChatPage]);


  return (
    <div className="c-height w-full  flex justify-between items-center flex-col  overflow-x-hidden ">
      <header className="text-xl min-h-[13svb] max-h-[13svb]  w-full  text-ascent-1 flex justify-start items-center gap-2  py-3 pl-2   max-md:px-5  rounded-lg  font-bold bg-secondary">
        <div
          onClick={() => setCurrentChat(null)}
          className=" md:hidden p-2 bg-blue mr-2 font-extrabold text-white rounded-full"
        >
          <BiArrowBack />
        </div>
        <div className="flex gap-3 pl-5">
          <div className="w-12 h-12 rounded-full overflow-hidden">
            <img
              className="w-full h-full object-cover"
              src={
                findFriend(currentChat)?.profileUrl
                  ? `${baseUrlForUploads}/${findFriend(currentChat)?.profileUrl}`
                  : NoProfile
              }
              alt="loading"
            />
          </div>
          <div className="">
            <p className="flex">
              {findFriend(currentChat)?.firstName}{" "}
              {findFriend(currentChat)?.lastName}
            </p>

            {friendsStatus?.find(user => user.userId == findFriend(currentChat)?._id)?.typing ?
              <p className="text-xs m-0 p-0 text-[#16c816]">
                typing..
              </p> :
              <p className="text-xs m-0 p-0">
                {friendsStatus?.find(user => user.userId == findFriend(currentChat)?._id)?.status || "offline"}
              </p>
            }
          </div>
        </div>
      </header>
      <div ref={chatContainer} className=" chatbox-scrollbar max-md:min-h-[80svb] max-md:max-h-[80svb] max-md:h-[80svb]  md:px-0 overflow-y-scroll overflow-x-hidden w-full text-ascent-1 flex flex-col h-full">
        {chatHistory && chatHistory.length > 0 && chatHistory?.map((chat, index) => (
          <div
            key={index}
            ref={scrollRef}
            className={`mt-1.5  max-md:mt-0.5 mb-0.5 border  p-2  max-md:py-2 max-md:rounded-xl bg-secondary shadow-sm shadow-secondary w-fit max-md:text-sm  max-w-[55%] max-md:max-w-[80%] flex flex-col justify-start items-start rounded-xl max-md:mx-1 mx-2  ${chat?.senderId?._id === user._id
              ? "self-end  rounded-tr-none"
              : "rounded-tl-none"
              } `}
          >
            <p className="text-xs  font-bold capitalize text-blue">
              {chat?.senderId?.firstName} {chat?.senderId?.lastName}
            </p>
            {chat?.type && <FilePreview chat={chat} />}
            <p className="text-xl max-md:text-sm font-semibold">
              {chat?.text ?? "Waiting for the Text"}
              {/* {JSON.stringify(chat)} */}
            </p>
            <div className="flex gap-[10px]">
              <p className="text-[10px] self-end mt-0.5 max-md:pl-6 max-md: pr-0.5 pl-16 text-ascent-2 font-mono font-light">
                {/* {new Date(chat?.createdAt).toLocaleString()} */}
                {formatDate(chat?.createdAt)}
              </p>

            </div>
          </div>
        ))}
        {
          (chatHistory && chatHistory.length === 0) && (
            chatLoading ? <div className="p-10 w-full h-full ">
              <Loading />
            </div> : ""
          )
        }
      </div>
      <form
        className="w-full h-fit px-2 flex justify-start items-center gap-2"
        onSubmit={handleSubmit((data) => {
          // if (data?.chatInput?.split() == "" || data?.chatInput?.split() == undefined) { return; }
          sendMessage({
            senderId: user._id,
            recieverId: currentChat,
            text: data?.chatInput,
            fileUrl: null,
          });
          resetChatInput();
        })}
      >
        {/* 
conversationId
fileUrl
recieverId
senderId
text
_id */}
        <EmojiPickerContainer
          emojiContainerOpen={emojiContainerOpen}
          setEmojiContainerOpen={setEmojiContainerOpen}
          getValues={getValues}
          setValue={setValue}
        />
        <div className="w-full h-full flex flex-row justify-between gap-2  items-center">
          <div className="flex h-full  w-full items-center text-ascent-1 justify-between gap-2">
            <div
              onClick={() => setEmojiContainerOpen(!emojiContainerOpen)}
              className="relative  w-12 max-md:w-16 hover:bg-primary h-12 cursor-pointer flex justify-center items-center bg-secondary rounded"
              aria-label="Toggle Emoji Picker"
            >
              <MdOutlineEmojiEmotions fontSize={25} />
            </div>
            <TextInput
              name="chatInput"
              label=""
              placeholder="Type a message"
              type="text"
              autofocus={true}
              styles="w-full max-md:h-12 font-bold"
              register={register("chatInput", {
                onChange: () => {
                  UpdateTypingStatus();
                },
              })}
              error={errors.chatInput ? errors.chatInput.message : ""}
            />

            {/* <div className="">
              <AttchFileIcon />
            </div> */}
          </div>
          <CustomButton
            Component={IoSend}
            isComponent={true}
            type="submit"
            containerStyles="px-4  text-primary text-3xl rounded my-2 text-ascent-1 font-bold py-2 text-xl bg-blue border-2 border-blue"
          />
        </div>
      </form>
    </div>
  );
};

export default ChatBox;
