import React from "react";
import { MdClose } from "react-icons/md";
import ProfileCard from "../ProfileCard/ProfileCard";
import { useDispatch, useSelector } from "react-redux";
import FriendsCard from "../FriendsCard/FriendsCard";
import { setMobileProfile } from "../../redux/userSlice";

const MobileProfileCard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  return (
    <div className=" w-full pt-1 rounded-xl md:hidden  fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity">
          <div className="absolute  inset-0 bg-[#000] opacity-70"></div>
        </div>
        <span className=" sm:inline-block sm:align-middle sm:h-screen"></span>
        &#8203;
        <div
          className="inline-block w-full align-bottom bg-primary rounded-lg text-left overflow-hidden shadow-xl transform transition-all  sm:align-middle sm:max-w-lg sm:w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div className=" w-full flex justify-between px-6 pt-5 pb-2">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileProfileCard;
