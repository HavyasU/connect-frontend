import React from "react";
import { baseUrlForUploads } from "../../../App";

const VideoPreview = ({ src }) => {
  return (
    <div className="w-full my-2 overflow-hidden rounded-lg">
      <video className="max-w-64 h-full" loop muted autoPlay src={src}></video>
    </div>
  );
};

export default VideoPreview;
