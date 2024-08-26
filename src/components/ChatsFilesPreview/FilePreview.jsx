import React from "react";
import ImagePreview from "./PreviewFiles/ImagePreview";
import DocsPreview from "./PreviewFiles/DocsPreview";
import VideoPreview from "./PreviewFiles/VideoPreview";
import AudioPreview from "./PreviewFiles/AudioPreview";
import { baseUrlForUploads } from "../../App";

const FilePreview = ({ chat: { type: fileType, fileUrl: src } }) => {
  return (
    <div className="   w-full h-full">
      {fileType == "image" && (
        <ImagePreview src={`${baseUrlForUploads}/${src}`} />
      )}
      {fileType == "video" && (
        <VideoPreview src={`${baseUrlForUploads}/${src}`} />
      )}
      {fileType == "document" && (
        <DocsPreview src={`${baseUrlForUploads}/${src}`} />
      )}
      {fileType == "audio" && (
        <AudioPreview src={`${baseUrlForUploads}/${src}`} />
      )}
    </div>
  );
};

export default FilePreview;
