import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { TbSocial } from "react-icons/tb";
import {
  CustomButton,
  Loading,
  TextInput,
} from "../../components/elementComponents";
import { serverCon, ToastMessage } from "../../App";

const Register = () => {
  const navigate = useNavigate();
  const [emailsent, setEmailsent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    serverCon
      .post("/auth/register", data)
      .then((res) => {
        {
          if (res?.data?.success === "Pending") {
            setEmailsent(res?.data?.message);
          } else {
            ToastMessage(res?.data?.message);
          }
          setTimeout(() => {
            navigate("/login");
          }, 5000);
          setIsSubmitting(false);
        }
      })
      .catch((err) => {
        ToastMessage(err?.response?.data?.message);
        setIsSubmitting(false);
      });
  };

  const dispatch = useDispatch();

  return (
    <div className="bg-bgColor w-full h-[100vh] flex items-center justify-center p-6">
      <div className="w-full md:w-2/3 h-full overflow-scroll  lg:h-full 2xl:h-5/6 py-8 lg:py-0 flex flex-row-reverse bg-primary rounded-xl  shadow-xl ">
        <div className="w-full lg:w-1/2 m-auto  overflow-scroll p-10 2xl:px-20 flex flex-col justify-center ">
          <div className="w-full flex gap-2 items-center mb-6  ">
            <div className="p-2 bg-[#065ad8] rounded text-white">
              <TbSocial />
            </div>
            <span className="text-2xl text-white font-bold" font-semibold>
              Connect
            </span>
          </div>

          <p className="text-ascent-1 text-base font-semibold">
            Register Now!..
          </p>

          <form
            className="py-8 flex flex-col gap-5 max-md:gap-1"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="w-full flex flex-col lg:flex-row gap-5 md:gap-2">
              <TextInput
                name="firstName"
                label="First Name"
                placeholder="First Name"
                type="text"
                styles="w-full max-md:h-12"
                register={register("firstName", {
                  required: "First Name is required!",
                })}
                error={errors.firstName ? errors.firstName?.message : ""}
              />

              <TextInput
                label="Last Name"
                placeholder="Last Name"
                type="lastName"
                styles="w-full max-md:h-12"
                register={register("lastName", {
                  required: "Last Name Required!",
                })}
                error={errors.lastName ? errors.lastName?.message : ""}
              />
            </div>

            <TextInput
              name="email"
              placeholder="email@example.com"
              label="Email Address"
              type="email"
              register={register("email", {
                required: "Email Address is required",
              })}
              styles="w-full max-md:h-12"
              error={errors.email ? errors.email.message : ""}
            />

            <div className="w-full flex flex-col lg:flex-row gap-1 md:gap-2">
              <TextInput
                name="password"
                label="Password"
                placeholder="Password"
                type="password"
                styles="w-full max-md:h-12"
                register={register("password", {
                  required: "Password is required!",
                })}
                error={errors.password ? errors.password?.message : ""}
              />

              <TextInput
                label="Confirm Password"
                placeholder="Password"
                type="password"
                styles="w-full max-md:h-12 mb-4"
                register={register("cPassword", {
                  validate: (value) => {
                    const { password } = getValues();

                    if (password != value) {
                      return "Passwords do no match";
                    }
                  },
                })}
                error={
                  errors.cPassword && errors.cPassword.type === "validate"
                    ? errors.cPassword?.message
                    : ""
                }
              />
            </div>

            {emailsent && (
              <span
                className={`text-lg max-md:text-sm font-bold text-[#2ba150fe]
                mt-0.5`}
              >
                {emailsent}
              </span>
            )}

            {isSubmitting ? (
              <Loading />
            ) : (
              <CustomButton
                type="submit"
                containerStyles={`inline-flex justify-center rounded-md bg-blue px-8 py-3 text-sm font-medium text-white outline-none`}
                title="Create Account"
              />
            )}
          </form>

          <p className="text-ascent-2 text-sm text-center">
            Already has an account?{" "}
            <Link
              to="/login"
              className="text-[#065ad8] font-semibold ml-2 cursor-pointer"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
