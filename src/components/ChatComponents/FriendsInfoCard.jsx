import React from "react";
import { baseUrlForUploads } from "../../App";
import { NoProfile } from "../../assets";
import UnreadMessageNotifier from "./UnreadMessageNotifier";

const FriendsInfoCard = ({
  handleFriendClick,
  friend,
  currentChat,
  friendsStatus,
  findUnreadMessage,
  typingStatus,
}) => {
  return (
    <div>
      <div
        key={friend._id}
        className="w-full h-full"
        onClick={() => handleFriendClick(friend._id)}
      >
        <li
          className={`flex rounded-lg transition-all ease-linear delay-0 hover:bg-blue hover:text-white gap-2 w-full border-b-2 border-b-primary h-full  justify-between items-center font-bold cursor-pointer text-ascent-1 p-4 ${
            currentChat === friend._id ? "bg-blue text-white" : "bg-secondary"
          }`}
        >
          <div className="flex gap-3 w-full h-full justify-start items-center ">
            <div className="w-fit h-fit relative ">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  src={
                    friend?.profileUrl
                      ? `${baseUrlForUploads}/${friend?.profileUrl}`
                      : NoProfile
                  }
                  alt="loading"
                />
              </div>
              {friendsStatus[friend._id] === "online" && (
                <div
                  className={`w-3 h-3 absolute bottom-0 right-0  border-2 border-ascent-1  rounded-full bg-[#46ff46]`}
                ></div>
              )}
            </div>

            <div className="flex  justify-start items-start p-0 m-0 gap-0  -mt-1 flex-col">
              <h1 className="text-lg">
                {friend?.firstName} {friend?.lastName}
              </h1>
              <p className="text-xs m-0 p-0">
                {typingStatus[friend._id]
                  ? "typing..."
                  : friend?.profession || "No - Profession"}
              </p>
            </div>
          </div>

          <UnreadMessageNotifier
            findUnreadMessage={findUnreadMessage}
            friend={friend}
          />
        </li>
      </div>
    </div>
  );
};

export default FriendsInfoCard;
