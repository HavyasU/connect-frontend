import React, { useEffect, useState } from "react";
import { baseUrlForUploads } from "../../App";
import { NoProfile } from "../../assets";
import { useSocket } from "../../hooks/useSocket";

const FriendsInfoCard = ({ friend }) => {
  const { setCurrentChat, users: friendsStatus, notifications, currentChat, setNotifications } = useSocket();
  const [notificationCount, setNotificationCount] = useState(0);

  const handleFriendClick = (friendId) => {
    setCurrentChat(friendId);
    setNotifications({
      [friend?._id]: 0
    });
  };




  const getNotificationCount = (friendId) => {
    return notifications[friendId];
  };


  useEffect(() => {
    const notificationCount = getNotificationCount(friend?._id);
    setNotificationCount(notificationCount);
  }, [notifications]);

  return (
    <div>
      <div
        key={friend._id}
        className="w-full h-full"
        onClick={() => handleFriendClick(friend?._id)}
      >
        <li
          className={`flex rounded-lg transition-all ease-linear delay-0 hover:bg-blue hover:text-white gap-2 w-full border-b-2 border-b-primary h-full  justify-between items-center font-bold cursor-pointer text-ascent-1 p-4 ${currentChat === friend._id ? "bg-blue text-white" : "bg-secondary"
            }`}
        >
          <div className="flex gap-3 w-full h-full justify-start items-center ">
            <div className="w-fit h-fit relative ">
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  src={
                    friend?.profileUrl
                      ? `${baseUrlForUploads}${friend?.profileUrl}`
                      : NoProfile
                  }
                  alt="loading"
                />
              </div>
              {friendsStatus?.find(user => user.userId == friend._id)?.status === "online" && (
                <div
                  className={`w-4 h-4 absolute -bottom-0.5 -right-0.5 border-2 border-ascent-1  rounded-full bg-[#00ad0c]`}
                ></div>
              )}
            </div>

            <div className="flex w-full  justify-between items-start p-0 m-0  -mt-1 ">
              <div className="">
                <h1 className="text-lg">
                  {friend?.firstName} {friend?.lastName}
                </h1>
                {friendsStatus?.find(user => user.userId == friend._id)?.typing ?
                  <p className="text-xs m-0 p-0 text-[#16c816]">
                    typing..
                  </p> :
                  <p className="text-xs m-0 p-0">
                    {friendsStatus?.find(user => user.userId == friend._id)?.status || "offline"}
                  </p>
                }
              </div>
              <div>

                {notificationCount && notificationCount > 0 ? <div className={`w-6 h-6 flex justify-center items-center text-xs text-center  border-2 border-ascent-1  rounded-full bg-[#00ad0c]`}>
                  {notificationCount > 0 && notificationCount}
                </div> : null}
              </div>

            </div>

          </div>


        </li>
      </div>
    </div>
  );
};

export default FriendsInfoCard;
