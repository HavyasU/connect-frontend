import React, { useEffect, useRef, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { CustomButton, TextInput } from "../elementComponents";
import { useSelector } from "react-redux";
import EmojiPickerContainer from "../EmojiPicker/EmojiPicker";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import AttchFileIcon from "../ChatFooterComponents/AttchFileIcon";
import { IoCheckmarkDoneOutline, IoSend } from "react-icons/io5";
import { baseUrlForUploads } from "../../App";
import FilePreview from "../ChatsFilesPreview/FilePreview";
import moment from "moment";
import { BiArrowBack, BiLeftArrow, BiLeftArrowAlt } from "react-icons/bi";

const ChatBox = ({
  handleChatSubmit,
  currentChat,
  friendsStatus,
  socket,
  typingStatus,
  setCurrentChat,
}) => {
  const { user } = useSelector((state) => state.user);
  const { chatMessages } = useSelector((state) => state.chats);
  const [emojiContainerOpen, setEmojiContainerOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);
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

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [chatMessages, currentChat]);

  const resetChatInput = () => {
    setValue("chatInput", "");
  };

  let typingTimeoutRef = useRef(null);

  const UpdateTypingStatus = () => {
    setIsTyping(true);
    if (typingTimeoutRef) {
      clearTimeout(typingTimeoutRef);
    }
    typingTimeoutRef = setTimeout(() => setIsTyping(false), 2000);
  };

  useEffect(() => {
    if (socket) {
      socket?.emit("typing", {
        currentChat,
        typing: isTyping,
      });
    }
  }, [isTyping]);

  return (
    <div className="c-height w-full  flex justify-between items-center flex-col  overflow-x-hidden ">
      <header className="text-xl min-h-[13svb] max-h-[13svb]  w-full  text-ascent-1 flex justify-start items-center gap-2  py-3 pl-2  max-md:px-5  rounded-lg  font-bold bg-secondary">
        <div
          onClick={() => setCurrentChat(null)}
          className=" md:hidden p-2 bg-blue mr-2 font-extrabold text-white rounded-full"
        >
          <BiArrowBack />
        </div>
        <div className="">
          <p className="flex">
            {findFriend(currentChat)?.firstName}{" "}
            {findFriend(currentChat)?.lastName}
          </p>
          <p className="text-[10px]">
            {friendsStatus[currentChat] ?? "offline"}
          </p>
        </div>
      </header>
      <div className=" max-md:min-h-[80svb] max-md:max-h-[80svb] max-md:h-[80svb]  md:px-0 overflow-y-auto overflow-x-hidden w-full text-ascent-1 flex flex-col ">
        {chatMessages?.map((chat, index) => (
          <div
            key={index}
            className={`my-2 max-md:my-1 w   p-2 py-2 max-md:py-2 max-md:rounded-xl bg-secondary shadow-sm shadow-secondary w-fit max-md:text-sm  max-w-[55%] max-md:max-w-[80%] flex flex-col justify-start items-start rounded-xl max-md:mx-1 mx-2  ${
              chat?.senderId?._id === user._id
                ? "self-end rounded-tr-none"
                : "rounded-tl-none"
            }`}
          >
            <p className="text-xs  font-bold capitalize text-blue">
              {chat?.senderId?.firstName} {chat?.senderId?.lastName}
            </p>
            {chat.type && <FilePreview chat={chat} />}
            <p className="text-xl max-md:text-sm font-semibold">
              {chat?.text ?? "Waiting for the Text"}
            </p>
            <div className="flex   gap-[10px]" ref={scrollRef}>
              <p className="text-[10px] self-end mt-0.5 max-md:pl-6 max-md: pr-0.5 pl-16 text-ascent-2 font-mono font-light">
                {/* {new Date(chat?.createdAt).toLocaleString()} */}
                {formatDate(chat?.createdAt)}
              </p>
              {chat?.senderId?._id === user._id && (
                <p>
                  {chat?.read ? (
                    <IoCheckmarkDoneOutline className="text-blue" />
                  ) : (
                    <IoCheckmarkDoneOutline />
                  )}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      <form
        className="w-full h-fit  flex justify-start items-center gap-2"
        onSubmit={handleSubmit((data) => {
          handleChatSubmit(data, resetChatInput);
        })}
      >
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
              styles="w-full max-md:h-12 font-bold"
              register={register("chatInput", {
                onChange: () => {
                  UpdateTypingStatus();
                },
              })}
              error={errors.chatInput ? errors.chatInput.message : ""}
            />

            <div className="">
              <AttchFileIcon />
            </div>
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
