import React, { useEffect, useLayoutEffect } from "react";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { Home, Login, Profile, Register, ResetPassword } from "./pages";
import { useDispatch, useSelector } from "react-redux";
import VerificationPage from "./components/VerificationPage/VerificationPage";
import axios from "axios";
import { Flip, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import {
  setFriendRequets,
  setSuggestedFriends,
  userLogin,
} from "./redux/userSlice";
import MobileProfileCard from "./components/MobileProfileCard/MobileProfileCard";
import MobileNotification from "./components/MobileNotification/MobileNotification";
import { fetchRequestCaller } from "./utils";
import EditProfile from "./components/EditProfile/EditProfile";
const backend_url = import.meta.env.VITE_BACKEND_URL;
export const serverCon = axios.create({
  baseURL: backend_url,
  responseType: "json",
});
export const baseUrlForUploads = backend_url + "uploads";

export const ToastMessage = (message) => {
  toast(message);
};

const Layout = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const checkJWT = () => {
    if (user) {
      serverCon
        .get("/auth/checkToken", {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        })
        .then((res) => {
          if (res?.data?.success === "new") {
            dispatch(userLogin({ ...user, token: res?.data?.newToken }));
            window.location.reload();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  useEffect(() => {
    checkJWT();
  }, [user]);
  const location = useLocation();
  return user?.token ? (
    <Outlet />
  ) : (
    <Navigate to={"/login"} state={{ from: location }} replace />
  );
};
const App = () => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);
  const {
    user,
    edit,
    MobileProfileView,
    MobileNotificationView,
    suggestedFriends,
    friendRequests,
  } = useSelector((state) => state.user);

  const fetchfriendsData = async () => {
    let suggested = await fetchRequestCaller({
      token: user?.token,
      data: {
        userId: user._id,
      },
    });
    let requestdFriendsData = await fetchRequestCaller({
      url: "/users/get-friend-request",
      token: user?.token,
    });
    dispatch(setSuggestedFriends(suggested?.data));
    dispatch(setFriendRequets(requestdFriendsData?.data));
  };
  useEffect(() => {
    fetchfriendsData();
  }, [user]);
  return (
    <div data-theme={theme} className="w-full  min-h-[100vh] ">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnFocusLoss
        className={"min-w-max max-sm:text-xs max-w-[90vw] m-auto"}
        draggable
        pauseOnHover
        theme={theme}
        transition={Flip}
      />
      {MobileProfileView && <MobileProfileCard />}
      {edit && <EditProfile />}

      {MobileNotificationView && (
        <MobileNotification
          friendRequests={friendRequests}
          suggestedFriends={suggestedFriends}
        />
      )}
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/profile/:id" element={<Profile />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route
          path="/verify/:type/:userId/:otp"
          element={<VerificationPage />}
        />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>

      {/* Same as */}
    </div>
  );
};

export default App;
