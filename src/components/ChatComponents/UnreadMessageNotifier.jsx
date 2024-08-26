import React from "react";

const UnreadMessageNotifier = ({ findUnreadMessage, friend }) => {
  const messageCount = findUnreadMessage(friend._id);
  return (
    <div>
      {messageCount && (
        <div
          className={`w-5 text-xs text-white h-5 flex justify-center items-center rounded-full bg-blue`}
        >
          {messageCount}
        </div>
      )}
    </div>
  );
};

export default UnreadMessageNotifier;
