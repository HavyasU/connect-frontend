import React from "react";
import { CustomButton, TextInput } from "../elementComponents";
import { useForm } from "react-hook-form";

const MobileSeachBox = ({ handleSearch }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });
  return (
    <div>
      <div className="w-full flex justify-center items-center gap-0">
        <form
          action="#"
          className="hidden max-md:flex w-full py-3
           justify-center items-center gap-0 px-6"
          onChange={handleSubmit(handleSearch)}
        >
          <TextInput
            placeholder="Search.."
            styles=" w-full h-[2.3rem] rounded-l-full h-full border border-black"
            containerStyle={"w-1/3 pl-2"}
            register={register("search")}
          />
          <CustomButton
            title={"Search"}
            type={"Submit"}
            containerStyles={`bg-[#0444a4]  flex justify-center items-center h-[2.3rem] w-1/4 px-5  text-white   rounded-r-full`}
          />
        </form>
      </div>
    </div>
  );
};

export default MobileSeachBox;
