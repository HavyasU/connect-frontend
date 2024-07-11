import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { user } from "../../assets/data";
import { NoProfile } from "../../assets";
import { LiaEditSolid } from "react-icons/lia";
import {
  setMobileNotification,
  setMobileProfile,
  updateProfile,
  userLogout,
} from "../../redux/userSlice";
import {
  BsBriefcase,
  BsFacebook,
  BsInstagram,
  BsPersonFill,
  BsPersonFillAdd,
  BsPersonFillCheck,
} from "react-icons/bs";
import { CiLocationOn } from "react-icons/ci";
import { FaTwitterSquare } from "react-icons/fa";
import moment from "moment";
import { CustomButton } from "../elementComponents";
import { baseUrlForUploads } from "../../App";
const ProfileCard = ({ user }) => {
  const { user: data, edit } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(setMobileNotification(false));
    // dispatch(setMobileProfile(false));
  }, []);
  const sendFriendrequest = () => {};
  return (
    <div>
      <div className="w-full bg-primary flex flex-col items-center shadow-sm rounded-xl   px-6 py-4">
        <div className="w-full flex items-center justify-between  border-b pb-5 border-[#66666645] max-md:flex-col max-md:gap-2 ">
          <Link to={"/profile/" + user?._id} className="flex gap-2 ">
            <img
              src={
                user?.profileUrl
                  ? `${baseUrlForUploads}/${user?.profileUrl}`
                  : NoProfile
              }
              alt={user?.email}
              loading="lazy"
              className="w-14 h-14 object-cover  rounded-full "
            />
            <div className="username flex flex-col justify-center">
              <p className="text-lg font-medium text-ascent-1  ">
                {user?.firstName} {user?.lastName}
              </p>
              <span className="text-ascent-2">
                {user?.profession ?? "No Profession"}
              </span>
            </div>
          </Link>
          <div className="">
            {user?._id === data?._id ? (
              <>
                <div className=" gap-2 text-blue">
                  <LiaEditSolid
                    size={22}
                    className="hidden md:flex text-blue cursor-pointer"
                    onClick={() => dispatch(updateProfile(true))}
                  />
                  <div className="hidden max-md:flex gap-2 my-3 ">
                    <CustomButton
                      onClick={() => dispatch(updateProfile(true))}
                      title={"Edit"}
                      containerStyles={
                        "text-sm text-ascent-1 bg-blue text-primary font-bold py-1 rounded-full text-ascent-1 px-8"
                      }
                    />
                    <CustomButton
                      onClick={() => {
                        dispatch(userLogout());
                        dispatch(setMobileProfile(false));
                        navigate("/");
                      }}
                      title={"Logout"}
                      containerStyles={
                        "text-sm text-ascent-1 bg-blue text-primary font-bold  rounded-full text-ascent-1 px-4"
                      }
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex gap-2 text-blue">
                  {/* <span className="hidden max-md:block">Add Friend</span> */}
                  <button
                    className=" bg-[#04441430]  text-sm text-white p-1 rounded"
                    onClick={() => sendFriendrequest(data.token, user._id)}
                  >
                    {console.log()}
                    {data?.friends?.some((ele) => ele._id == user?._id) ? (
                      <BsPersonFillCheck
                        title="friends"
                        size={20}
                        className="text-[#0f52b6]"
                      />
                    ) : (
                      <BsPersonFillAdd
                        title="connect"
                        size={20}
                        className="text-[#0f52b6]"
                      />
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="w-full flex  flex-col gap-2 py-4 border-b border-b-[#66666645] ">
          <div className="flex gap-2 items-center text-ascent-2 max-md:justify-center ">
            <CiLocationOn className="text-xl text-ascent-1 " />
            <span>{user?.location ?? "Add Location"}</span>
          </div>
          <div className="flex gap-2 items-center text-ascent-2  max-md:justify-center">
            <BsBriefcase size={18} className="text-xl text-ascent-1 " />
            <span>{user?.profession ?? "Add Proffesiion"}</span>
          </div>
        </div>
        <div className="w-full flex flex-col gap-2 py-4 border-b border-[#66666645]">
          <p className="text-xl text-ascent-1 font-semibold max-md:text-center">
            {user?.friends?.length} Friends
          </p>

          <div className="flex items-center justify-between max-md:justify-center max-md:gap-2">
            <span className="text-ascent-2 max-md:hidden">
              Who viewed your profile
            </span>
            <span className="text-ascent-1 text-lg">{user?.views?.length}</span>
            <span className="hidden text-ascent-2 max-md:block">
              Profile Views
            </span>
          </div>

          <span className="text-base text-blue  max-sm:text-center">
            {user?.verified ? "Verified Account" : "Not Verified"}
          </span>

          <div className="flex items-center justify-between max-md:justify-center max-md:gap-2">
            <span className="text-ascent-2">Joined</span>
            <span className="text-ascent-1 text-base">
              {moment(user?.createdAt).fromNow()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
