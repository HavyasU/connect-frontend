import React from "react";
import { baseUrlForUploads } from "../../../App";

const ImagePreview = ({ src }) => {
  return (
    <div className="w-full h-full max-md:w-44 max-md:h-fit flex justify-center items-center  rounded-lg  m-3 overflow-hidden ">
      <img
        src={src}
        alt={src}
        className="w-full h-full max-w-60 overflow-hidden object-contain"
      />
    </div>
  );
};

export default ImagePreview;
