import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TopBar from "../../components/TopBar/TopBar";
import ProfileCard from "../../components/ProfileCard/ProfileCard";
import FriendsCard from "../../components/FriendsCard/FriendsCard";
import { Link } from "react-router-dom";
import { NoProfile } from "../../assets";
import {
  CustomButton,
  Loading,
  TextInput,
} from "../../components/elementComponents";
import { BsFiletypeGif, BsPersonFillAdd } from "react-icons/bs";
import { useForm } from "react-hook-form";
import { BiImages, BiSolidVideo } from "react-icons/bi";
import PostCard from "../../components/PostCard/PostCard";
import EditProfile from "../../components/EditProfile/EditProfile";
import MobileProfileCard from "../../components/MobileProfileCard/MobileProfileCard";
import MobileNotification from "../../components/MobileNotification/MobileNotification";
import { baseUrlForUploads, serverCon, ToastMessage } from "../../App";
import { fetchPosts, fetchRequestCaller } from "../../utils";
import {
  setFriendRequets,
  setSuggestedFriends,
  userLogin,
} from "../../redux/userSlice";
const Home = () => {
  const { user, edit, friendRequests, suggestedFriends } = useSelector(
    (state) => state.user
  );
  const { posts } = useSelector((state) => state.posts);

  const [file, setFile] = useState({
    type: "",
    media: "",
  });
  const [errMsg, setErrMsg] = useState("");
  const [posting, setPosting] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handlePostSubmit = async (data) => {
    setLoading(true);
    const formdata = new FormData();
    for (let name in data) formdata.append(name, data[name]);
    formdata.append("type", file.type);
    formdata.append("media", file.media);
    serverCon
      .post("/posts/create-post", formdata, {
        headers: {
          Authorization: "Bearer " + user?.token,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        ToastMessage(res?.data?.message);
        fetchPostsData();
        setFile(null);
        setValue("description", "");
        setLoading(false);
      })
      .catch((err) => {
        ToastMessage(err?.response?.data?.message);
        setLoading(false);
      });
  };
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
  const handleDeletePost = async (id) => {
    let res = await fetchPosts({
      url: "/posts/delete-post/" + id,
      token: user?.token,
      method: "DELETE",
      dispatch: () => {},
    });
    ToastMessage(res?.message);
    fetchPostsData();
  };

  //giving friend request
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
  }, []);

  return (
    <div className="home w-full px-0 lg:px-10 pb-20 2xl:px-40 bg-bgColor  lg:rounded- h-screen  overflow-hidden transition-[background-color] ease-in-out duration-75">
      <TopBar friendRequests={friendRequests} />

      <div className="w-full flex gap-2 lg:gap-4 pt-5 pb-10 h-full max-md:p-1">
        {/* user profile */}
        <div className="hidden w-1/3 lg:w-1/4 h-full md:flex flex-col gap-6 overflow-y-auto">
          <ProfileCard user={user} />
          <FriendsCard friends={user?.friends} />
        </div>

        {/* Tredning posts */}
        <div className="flex-1 max-md:h-[100vh] max-md:pb-20 rounded-lg h-full bg-primary  px-4  flex flex-col gap-6  overflow-y-auto ">
          <form
            action="#"
            className="bg-primary px-4 rounded-lg border-b  border-[#66666645]"
            onSubmit={handleSubmit(handlePostSubmit)}
          >
            <div className="w-full flex items-center gap-2 py-4 border-b border-[#66666645]">
              <img
                src={
                  user?.profileUrl
                    ? `${baseUrlForUploads}/${user?.profileUrl}`
                    : NoProfile
                }
                alt="User Image"
                className="w-14 h-14 rounded-full object-cover"
              />
              <TextInput
                styles="w-full rounded-full py-5"
                placeholder="What's on your mind...."
                name="description"
                register={register("description", {
                  required: "Write something about post",
                })}
                error={errors.description ? errors.description.message : ""}
              />
            </div>
            {errMsg?.message && (
              <span
                role="alert"
                className={`text-sm ${
                  errMsg?.status === "failed"
                    ? "text-[#f64949fe]"
                    : "text-[#2ba150fe]"
                } mt-0.5`}
              >
                {errMsg?.message}
              </span>
            )}
            <div className="flex items-center justify-between py-4">
              <label
                htmlFor="imgUpload"
                className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer"
              >
                <input
                  type="file"
                  onChange={(e) =>
                    setFile({
                      type: "image",
                      media: e.target.files[0],
                    })
                  }
                  className="hidden"
                  id="imgUpload"
                  data-max-size="5120"
                  accept=".jpg, .png, .jpeg"
                />
                <BiImages />
                <span>Image</span>
              </label>

              <label
                className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer"
                htmlFor="videoUpload"
              >
                <input
                  type="file"
                  data-max-size="5120"
                  onChange={(e) =>
                    setFile({
                      type: "video",
                      media: e.target.files[0],
                    })
                  }
                  className="hidden"
                  id="videoUpload"
                  accept=".mp4, .wav"
                />
                <BiSolidVideo />
                <span>Video</span>
              </label>

              {/* <label
                className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer"
                htmlFor="vgifUpload"
              >
                <input
                  type="file"
                  data-max-size="5120"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="hidden"
                  id="vgifUpload"
                  accept=".gif"
                />
                <BsFiletypeGif />
                <span>Gif</span>
              </label> */}

              <div>
                {loading ? (
                  <Loading />
                ) : (
                  <CustomButton
                    type="submit"
                    title="Post"
                    containerStyles="bg-[#0444a4] text-white py-1 px-6 rounded-full font-semibold text-sm"
                  />
                )}
              </div>
            </div>
          </form>

          {loading ? (
            <Loading />
          ) : posts && posts?.length > 0 ? (
            posts.map((post) => {
              return (
                <PostCard
                  key={post._id}
                  post={post}
                  user={user}
                  fetchPosts={() => fetchPostsData()}
                />
              );
            })
          ) : (
            <div className="flex w-full h-full items-center justify-center">
              <p className="text-lg text-ascent-2">No Post Available</p>
            </div>
          )}
        </div>

        {/* friends of user */}
        <div className="hidden w-1/4 h-full lg:flex flex-col gap-8 overflow-y-auto">
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
                              ? `${baseUrlForUploads}/${from.profileUrl}`
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
                        addFriend(friend._id);
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
  );
};

export default Home;
