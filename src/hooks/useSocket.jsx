import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { fetchRequestCaller } from "../utils";
import { fetchInitialChatStatus } from "./socketUtils";
import { current } from "@reduxjs/toolkit";

const useSocket = (url, user) => {
  const socket = useRef(null);
  const [connected, setConnected] = useState(false);
  const [friendsStatus, setFriendsStatus] = useState([]);
  const [typingStatus, setTypingStatus] = useState("");

  useEffect(() => {
    if (user) {
      socket.current = io(url);

      socket.current.on("connect", () => {
        setConnected(true);
        socket.current.emit("join", { userId: user._id });
      });

      socket.current.on("getUsers", (users) => {
        const statusMap = users.reduce((acc, user) => {
          acc[user.userId] = user.status;
          return acc;
        }, {});
        setFriendsStatus(statusMap);
        console.log(users);
      });

      socket.current.on("user_status", ({ userId, status }) => {
        setFriendsStatus((prev) => ({ ...prev, [userId]: status }));
      });

      socket.current.on("typing", ({ userId, typing }) => {
        setTypingStatus((prev) => ({ ...prev, [userId]: typing }));
      });
      socket.current.on("disconnect", () => {
        setConnected(false);
      });

      return () => {
        socket.current.disconnect();
      };
    }
  }, [url]);

  const sendMessage = (event, message) => {
    if (socket.current) {
      socket.current.emit(event, message);
    }
  };

  const onMessage = (event, handler) => {
    if (socket.current) {
      socket.current.on(event, handler);

      return () => {
        socket.current.off(event, handler);
      };
    }
  };

  return {
    socket: socket.current,
    connected,
    sendMessage,
    onMessage,
    friendsStatus,
    setFriendsStatus,
    typingStatus,
  };
};

export default useSocket;
