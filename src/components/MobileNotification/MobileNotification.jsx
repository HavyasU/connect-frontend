import React, { useEffect } from "react";
import { MdClose } from "react-icons/md";
import ProfileCard from "../ProfileCard/ProfileCard";
import { useDispatch, useSelector } from "react-redux";
import FriendsCard from "../FriendsCard/FriendsCard";
import { setMobileNotification, setMobileProfile, userLogin } from "../../redux/userSlice";
import { BsPersonFillAdd } from "react-icons/bs";
import { Link } from "react-router-dom";
import { CustomButton } from "../elementComponents";
import { NoProfile } from "../../assets";
import { baseUrlForUploads, ToastMessage } from "../../App";
import { fetchPosts, fetchRequestCaller } from "../../utils";

const MobileNotification = ({ friendRequests, suggestedFriends }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const fetchUserData = async () => {
    let res = await fetchRequestCaller({
      token: user?.token,
      url: "/users/get-user",
    });
    dispatch(userLogin({ ...user, ...res?.user }));
  };

  const fetchPostsData = async () => {
    await fetchPosts({
      url: "/posts",
      method: "POST",
      token: user.token,
      dispatch: dispatch,
    });
  };
  const addFriend = async (requestTo) => {
    let res = await fetchRequestCaller({
      method: "POST",
      url: "users/friend-request",
      data: {
        requestTo,
      },
      token: user?.token,
    });
    ToastMessage(res?.message);
  };

  const responseToRequest = async (rid, status) => {
    let response = await fetchRequestCaller({
      url: "/users/accept-request",
      data: {
        rid: rid,
        status: status,
      },
      token: user?.token,
      method: "POST",
    });
    fetchUserData();
    fetchfriendsData();
    ToastMessage(response?.message);
  };
  useEffect(() => {
    fetchPostsData();
    fetchUserData();
  }, [user]);
  return (
    <div className=" w-full pt-1 rounded-xl lg:hidden  fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 bg-[#000] opacity-70"></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
        &#8203;
        <div
          className="inline-block w-full align-bottom bg-primary rounded-lg text-left overflow-hidden shadow-xl transform transition-all  sm:align-middle sm:max-w-lg sm:w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          {/* <div className=" w-full flex justify-between px-6 pt-5 pb-2">
          <div className="w-full  h-full md:flex flex-col gap-6 overflow-y-auto">
            <div className="flex justify-between px-6 pt-5 pb-2">
              <label
                htmlFor="name"
                className="block font-medium text-xl text-ascent-1 text-left"
              >
                 Profile
              </label>

              <button
                className="text-ascent-1"
                onClick={() => dispatch(setMobileProfile(false))}
              >
                <MdClose size={22} />
              </button>
            </div>
            <ProfileCard user={user} />
            <div className="my-2"></div>
            <FriendsCard friends={user?.friends} />
          </div>
        </div> */}
          <div className="flex justify-between px-6 pt-5 pb-2">
            <label
              htmlFor="name"
              className="block font-medium text-xl text-ascent-1 text-left"
            >
              Notifications
            </label>
            <button
              className="text-ascent-1"
              onClick={() => dispatch(setMobileNotification(false))}
            >
              <MdClose size={22} />
            </button>
          </div>
          <div className=" w-full h-full lg:flex flex-col gap-8 overflow-y-auto">
            {/* Friend Requests section  */}
            <div className="w-full bg-primary shadow-sm rounded-lg px-6 py-5">
              <div className="flex items-center justify-between text-xl text-ascent-1 pb-2 border-b border-[#66666645]">
                <span>Friend Requests</span>
                <span> {friendRequests?.length}</span>
              </div>
              <div className="w-full flex flex-col gap-4 pt-4">
                {friendRequests &&
                  friendRequests?.map(({ _id, requestFrom: from }) => {
                    return (
                      <div
                        key={_id}
                        className="flex items-center justify-between "
                      >
                        <Link
                          to={"profile/" + from._id}
                          className=" w-full flex gap-4 items-center cursor-pointer"
                        >
                          <img
                            src={
                              from.profileUrl
                                ? `${baseUrlForUploads}/${from?.profileUrl}`
                                : NoProfile
                            }
                            alt={from.firstName}
                            className=" w-10 h-10 object-cover rounded-full"
                          />
                          <div className="flex-1">
                            <p className="text-base font-medium text-ascent-1">
                              {from?.firstName} {from?.lastName}
                            </p>
                            <span className="text-sm text-ascent-2">
                              {from?.profession ?? "No Profession"}
                            </span>
                          </div>
                        </Link>
                        <div className="flex gap-1">
                          <CustomButton
                            title="Accept"
                            onClick={() => responseToRequest(_id, "Accepted")}
                            containerStyles="bg-[#0444a4] text-xs text-white px-1.5 py-1 rounded-md font-medium"
                          />
                          <CustomButton
                            onClick={() => responseToRequest(_id, "Rejected")}
                            title="Deny"
                            containerStyles="border border-[#666] text-xs text-ascent-1 px-1.5 py-1 rounded-md font-medium"
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* suggested friend section   */}
            <div className="w-full bg-primary shadow-sm rounded-lg px-5 py-5">
              <div className="flex items-center justify-between text-lg text-ascent-1 border-b border-[#66666645]">
                <span>Friend Suggestions</span>
              </div>
              <div className="w-full flex flex-col gap-4 pt-4">
                {suggestedFriends?.map((friend) => (
                  <div
                    className="flex items-center justify-between"
                    key={friend._id}
                  >
                    <Link
                      to={"/profile/" + friend?._id}
                      key={friend?._id}
                      className="w-full flex gap-4 items-center cursor-pointer"
                    >
                      <img
                        src={
                          friend?.profileUrl
                            ? `${baseUrlForUploads}/${friend?.profileUrl}`
                            : NoProfile
                        }
                        alt={friend?.firstName}
                        className="w-10 h-10 object-cover rounded-full"
                      />
                      <div className="flex-1 ">
                        <p className="text-base font-medium text-ascent-1">
                          {friend?.firstName} {friend?.lastName}
                        </p>
                        <span className="text-sm text-ascent-2">
                          {friend?.profession ?? "No Profession"}
                        </span>
                      </div>
                    </Link>

                    <div className="flex gap-1">
                      <button
                        className="bg-[#0444a430] text-sm text-white p-1 rounded"
                        onClick={() => {
                          addFriend(friend?._id);
                        }}
                      >
                        <BsPersonFillAdd size={20} className="text-[#0f52b6]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileNotification;
