import React from "react";
import { baseUrlForUploads } from "../../../App";

const AudioPreview = ({ src }) => {
  return (
    <div className="w-full my-2 p-3  bg-blue rounded-lg">
      <audio controls src={src} className="max-w-52   object-contain"></audio>
    </div>
  );
};

export default AudioPreview;
