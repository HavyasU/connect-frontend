import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { MdClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { CustomButton, Loading, TextInput } from "../elementComponents";
import { updateProfile, userLogin } from "../../redux/userSlice";
import { serverCon, ToastMessage } from "../../App";
import { fetchPosts } from "../../utils";

const EditProfile = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [errMsg, setErrMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [picture, setPicture] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: { ...user },
  });
  const fetchPostsData = async () => {
    await fetchPosts({
      url: "/posts",
      method: "POST",
      token: user.token,
    });
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      formData.append("profession", data.profession);
      formData.append("location", data.location);
      if (picture) {
        formData.append("profilePhoto", picture);
      }

      const response = await serverCon.put("/users/update-user", formData, {
        headers: {
          Authorization: "Bearer " + user?.token,
          "Content-Type": "multipart/form-data",
        },
      });

      ToastMessage(response?.data?.message);
      const userData = { ...user, ...response?.data?.user };
      dispatch(userLogin(userData));
    } catch (error) {
      ToastMessage(error?.response?.data?.message);
      setErrMsg({
        status: "failed",
        message: error?.response?.data?.message || "Failed to update profile",
      });
    } finally {
      fetchPostsData();
      setIsSubmitting(false);
      dispatch(updateProfile(false)); // Close modal after submission
    }
  };

  const handleClose = () => {
    dispatch(updateProfile(false));
  };

  const handleSelect = (e) => {
    setPicture(e.target.files[0]);
  };

  return (
    <div className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-10 sm:p-0">
        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 bg-[#000] opacity-70"></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
        <div
          className="inline-block align-bottom bg-primary rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div className="flex justify-between px-6 pt-5 pb-2">
            <label
              htmlFor="name"
              className="block font-medium text-xl text-ascent-1 text-left"
            >
              Edit Profile
            </label>
            <button className="text-ascent-1" onClick={handleClose}>
              <MdClose size={22} />
            </button>
          </div>
          <form
            className="px-4 sm:px-6 flex flex-col gap-3 2xl:gap-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            <TextInput
              name="firstName"
              label="First Name"
              placeholder="First Name"
              type="text"
              styles="w-full"
              register={register("firstName", {
                required: "First Name is required!",
              })}
              error={errors.firstName ? errors.firstName?.message : ""}
            />

            <TextInput
              name="lastName"
              label="Last Name"
              placeholder="Last Name"
              type="text"
              styles="w-full"
              register={register("lastName", {
                required: "Last Name is required!",
              })}
              error={errors.lastName ? errors.lastName?.message : ""}
            />

            <TextInput
              name="profession"
              label="Profession"
              placeholder="Profession"
              type="text"
              styles="w-full"
              register={register("profession", {
                required: "Profession is required!",
              })}
              error={errors.profession ? errors.profession?.message : ""}
            />

            <TextInput
              name="location"
              label="Location"
              placeholder="Location"
              type="text"
              styles="w-full"
              register={register("location", {
                required: "Location is required!",
              })}
              error={errors.location ? errors.location?.message : ""}
            />

            <label className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer my-4">
              Upload Profile Photo
              <input
                type="file"
                name="profilePhoto"
                id="imgUpload"
                className="hidden"
                onChange={(e) => handleSelect(e)}
                accept=".jpg, .png, .jpeg"
              />
            </label>

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

            <div className="py-5 sm:flex sm:flex-row-reverse border-t border-[#66666645]">
              {isSubmitting ? (
                <Loading />
              ) : (
                <CustomButton
                  type="submit"
                  containerStyles={`inline-flex justify-center rounded-md bg-blue px-8 py-3 text-sm font-medium text-white outline-none`}
                  title="Submit"
                />
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
