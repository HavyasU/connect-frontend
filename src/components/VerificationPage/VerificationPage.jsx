import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  CustomButton,
  Loading,
  TextInput,
} from "../../components/elementComponents";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { serverCon, ToastMessage } from "../../App";

const VerificationPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { type, userId, otp } = useParams();
  const verify = async (data) => {
    const endpoint = type === "verifyEmail" ? "verify-email" : "resetpassword";
    serverCon
      .post("/users/" + endpoint, {
        userId,
        otp,
        ...data,
      })
      .then((res) => {
        ToastMessage(res.data.message);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
        // setInterval(() => {
        //   {
        //     if (res?.data?.status) {
        //       navigate("/login");
        //     }
        //     navigate("/register");
        //   }
        // }, 2000);
      })
      .catch((err) => {
        ToastMessage(JSON.stringify(err));
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      });
  };
  useEffect(() => {
    if (type == "verifyEmail") {
      verify();
    }
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  return (
    <div className="w-full h-[100vh] bg-bgColor flex items-center justify-center p-6">
      <div className="bg-primary w-full md:w-1/3 2xl:w-1/4 px-6 py-8 shadow-md rounded-lg">
        {type && type === "verifyEmail" ? (
          <>
            <p className="text-ascent-1 text-2xl font-semibold text-center my-3">
              Verifying...
            </p>
            <span className="text-sm text-ascent-2">
              <Loading />
            </span>
          </>
        ) : (
          <>
            <form
              onSubmit={handleSubmit(verify)}
              className="py-4 flex flex-col gap-5"
            >
              <TextInput
                name="email"
                placeholder="New Password"
                type="password"
                register={register("password", {
                  required: "Password  is required!",
                  minLength: {
                    value: 6,
                    message: "Password length should be more than 6",
                  },
                })}
                styles="w-full rounded-lg"
                labelStyle="ml-2"
                error={errors.password ? errors.password.message : ""}
              />

              {isSubmitting ? (
                <Loading />
              ) : (
                <CustomButton
                  type="submit"
                  containerStyles={`inline-flex justify-center rounded-md bg-blue px-8 py-3 text-sm font-medium text-white outline-none`}
                  title="Submit"
                />
              )}
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default VerificationPage;
