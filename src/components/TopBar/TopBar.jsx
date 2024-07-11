import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { TbSocial } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import TextInput from "../elementComponents/TextInput";
import CustomButton from "../elementComponents/CustomButton";
import { BsMoon, BsSearch, BsSunFill } from "react-icons/bs";
import { SetTheme } from "../../redux/themeSlice";
import { IoMdNotificationsOutline } from "react-icons/io";
import {
  setMobileNotification,
  setMobileProfile,
  userLogout,
} from "../../redux/userSlice";
import { FaRegUserCircle } from "react-icons/fa";
import { MdNotificationsActive } from "react-icons/md";
import { fetchPosts, fetchRequestCaller } from "../../utils";
import { CgClose } from "react-icons/cg";
import MobileSeachBox from "../MobileSeachBox/MobileSeachBox";

const TopBar = ({ friendRequests }) => {
  const { theme } = useSelector((state) => state.theme);
  const { user } = useSelector((state) => state.user);
  const [mobileSearch, setMobileSearch] = useState(false);
  const dispatch = useDispatch();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });
  const handleSearch = async (data) => {
    let res = await fetchPosts({
      url: "/posts",
      token: user?.token,
      data: {
        search: data.search,
      },
      method: "POST",
      dispatch: dispatch,
    });
  };

  return (
    <>
      <div className="topbar w-full rounded-2xl mt-1 max-md:rounded flex items-center justify-between py-3 md:py-6 px-4 bg-primary ">
        <Link to={"/"} className="flex gap-2 items-center justify-center">
          <div className="w-full flex gap-2 items-center mb-0">
            <div className="logo max-sm:text-[17px] max-md:p-1.5 p-2 bg-[#065ad8] rounded text-white">
              <TbSocial />
            </div>
            <span className="text-2xl max-sm:text-xl text-[blue] font-bold">
              Connect
            </span>
          </div>
        </Link>
        <form
          action="#"
          className="hidden md:flex items-center justify-center "
          onChange={handleSubmit(handleSearch)}
        >
          <TextInput
            placeholder="Search.."
            styles=" w-[18rem] lg:w-[38rem] rounded-l-full  h-full border border-black"
            register={register("search")}
          />
          <CustomButton
            title={"Search"}
            type={"Submit"}
            containerStyles={`bg-[#0444a4]   text-white px-6 min-h-[3.2rem]    rounded-r-full`}
          />
        </form>

        <div className="flex gap-4 items-center text-ascent-1 md:text-xl">
          <button
            className=" hidden max-sm:flex"
            onClick={() => {
              setMobileSearch(!mobileSearch);
            }}
          >
            {mobileSearch ? <CgClose /> : <BsSearch />}
          </button>
          <button
            onClick={() => {
              dispatch(SetTheme(theme === "dark" ? "light" : "dark"));
            }}
          >
            {theme == "light" ? <BsMoon size={18} /> : <BsSunFill size={19} />}
          </button>
          <div className=" max-sm:flex lg:flex ">
            {friendRequests?.length > 0 ? (
              <MdNotificationsActive
                size={20}
                className="bell-animation"
                onClick={() => {
                  dispatch(setMobileNotification(true));
                }}
              />
            ) : (
              <IoMdNotificationsOutline
                onClick={() => {
                  dispatch(setMobileNotification(true));
                }}
                size={22}
              />
            )}
          </div>
          <div className="max-md:hidden">
            <CustomButton
              onClick={() => dispatch(userLogout())}
              title={"Logout"}
              containerStyles={
                "txet-sm text-ascent-1 px-4 md:px-6 py-1 md:py-2 border border-[#666] rounded-full"
              }
            />
          </div>
          <div className="hidden max-md:flex "
            onClick={() => {
              dispatch(setMobileProfile(true));
            }}>
            <FaRegUserCircle size={20} />
          </div>
        </div>
      </div>
      <div
        className={`bg-primary mobile-search-box ${
          mobileSearch ? "active" : ""
        }`}
      >
        <MobileSeachBox handleSearch={handleSearch} />
      </div>
    </>
  );
};

export default TopBar;
