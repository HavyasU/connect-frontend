import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TbSocial } from "react-icons/tb";
import { useForm } from "react-hook-form";
import { Loading, TextInput } from "../../components/elementComponents";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "../../components/elementComponents/CustomButton";
import { serverCon, ToastMessage } from "../../App";
import { userLogin } from "../../redux/userSlice";

const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    location: "",
    proffession: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const onSubmit = async (data) => {
    setSubmitting(true);
    serverCon
      .post("/auth/login", data)
      .then((res) => {
        ToastMessage(res.data?.message);
        {
          if (res?.data?.success) {
            let data = res?.data;
            let user = data?.user || {};
            user.token = data?.token || undefined;
            dispatch(userLogin(user));
            setTimeout(() => {
              navigate("/");
            }, 1000);
          }
          setSubmitting(false);
        }
      })
      .catch((err) => {
        ToastMessage(err?.response?.data?.message);
        setSubmitting(false);
      });
  };
  useEffect(() => {
    if (user?.firstName) {
      navigate("/");
    }
  }, []);

  return (
    <>
      <div className="bg-bgColor w-full h-[100vh] flex items-center justify-center p-6 ">
        <div className="w-full  md:w-2/3 h-fit lg:h-full 2xl:h-5/6 max-xl:h-full py-8 lg:py-0 flex bg-primary rounded-xl shadow-xl overflow-hidden ">
          <div className="w-full  lg:w-1/2 m-auto h-full p-10 2xl:px-20 flex flex-col justify-center  gap-1">
            <Link to={"/"} className="flex gap-2 items-center">
              <div className="w-full flex gap-2 items-center mb-6">
                <div className="logo p-2 bg-[#065ad8] rounded text-white">
                  <TbSocial />
                </div>
                <span className="text-2xl text-[white] font-bold">Connect</span>
              </div>
            </Link>

            <p className="text-ascent-1 text-base font-semibold">
              Log in to your Account
            </p>
            <span className="text-sm mt-2 text-ascent-2">Welcome...</span>
            <form
              className="py-8 flex flex-col gap-3 "
              onSubmit={handleSubmit(onSubmit)}
            >
              <TextInput
                name="name"
                placeholder="email@example.com"
                label={"Email Address"}
                type="email"
                register={register("email", {
                  required: "Email Address is required",
                })}
                styles="w-full rounded-full"
                labelStyle="ml-2"
                error={errors.email ? errors.email.message : ""}
              />
              <TextInput
                name="password"
                placeholder="password"
                label={"Password "}
                type="password"
                register={register("password", {
                  required: "password Address is required",
                })}
                styles="w-full rounded-full"
                labelStyle="ml-2"
                error={errors.password ? errors.password.message : ""}
              />
              <Link
                to={"/reset-password"}
                className="text-sm text-right text-blue font-semibold"
              >
                Forgot Password..?
              </Link>

              {submitting ? (
                <Loading />
              ) : (
                <CustomButton
                  type="submit"
                  containerStyles={`inline-flex justify-center rounded-md bg-blue px-8 py-3 text-sm font-medium text-white outline-none`}
                  title="Login"
                />
              )}
              <p className="text-ascent-2 text-sm text-center">
                Don't have an account?
                <Link
                  to="/register"
                  className="text-[#065ad8] font-semibold ml-2 cursor-pointer"
                >
                  Create Account
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
