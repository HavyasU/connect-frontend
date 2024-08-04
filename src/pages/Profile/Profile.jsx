import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import FriendsCard from "../../components/FriendsCard/FriendsCard";
import { Loading } from "../../components/elementComponents";
import PostCard from "../../components/PostCard/PostCard";
import ProfileCard from "../../components/ProfileCard/ProfileCard";
import TopBar from "../../components/TopBar/TopBar";
import { fetchPosts, fetchRequestCaller } from "../../utils";
import { userLogin } from "../../redux/userSlice";
import { SetPosts } from "../../redux/postSlice";
import { ToastMessage } from "../../App";
// import { posts } from "../../assets/data";

const Profile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { posts } = useSelector((state) => state.posts);
  const [userInfo, setUserInfo] = useState(user);
  const [loading, setLoading] = useState(false);

  const fetchUserData = async () => {
    let res = await fetchRequestCaller({
      token: user?.token,
      url: "/users/get-user/" + id,
    });
    console.log(res);
    setUserInfo(res?.user);
  };
  const fetchPostsData = async () => {
    let posts = await fetchPosts({
      url: "/posts/get-user-post/" + id,
      method: "GET",
      token: user.token,
      dispatch: dispatch,
    });
  };
  const updateProfieView = async () => {
    let res = await fetchRequestCaller({
      url: "/users/profile-view",
      data: {
        id,
      },
      method: "POST",
      token: user?.token,
    });
  };

  useEffect(() => {
    fetchUserData();
    fetchPostsData();
    updateProfieView();
  }, [id]);
  return (
    <>
      <div className="home w-full px-0  lg:px-10 pb-20 2xl:px-40 bg-bgColor lg:rounded-lg h-screen overflow-hidden">
        <TopBar />
        <div className="w-full flex gap-2 lg:gap-4 md:pl-4 pt-3 pb-10 h-full   max-md:flex-col overflow-auto">
          {/* LEFT */}
          <div className="hidden max-md:flex max-md:px-1 max-md:flex-1  max-md:w-full max-md:min-h-fit  w-1/3 lg:w-1/4 md:flex flex-col gap-2 ">
            <ProfileCard user={userInfo} />
            <div className="block lg:hidden  min-h-fit">
              <FriendsCard friends={userInfo?.friends} />
            </div>
          </div>

          {/* CENTER */}
          <div className="   flex-1 h-full bg-orimary px-4  max-md:p-0  max-sm:gap-0 flex flex-col gap-6 max-md:px-1 max-md:min-h-[100%] overflow-y-auto max-md:overflow-visible">
            {loading ? (
              <Loading />
            ) : posts?.length > 0 ? (
              posts?.map((post) => (
                <PostCard
                  post={post}
                  key={post?._id}
                  user={user}
                  fetchPosts={fetchPostsData}
                />
              ))
            ) : (
              <div className="flex w-full h-full items-center justify-center">
                <p className="text-lg text-ascent-2">No Post Available</p>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className="hidden  w-1/4 h-full lg:flex flex-col gap-8 overflow-y-auto">
            <FriendsCard friends={userInfo?.friends} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
