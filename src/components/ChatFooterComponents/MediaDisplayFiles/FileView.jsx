// ImageView Component
import React, { useEffect, useState } from "react";
import { CiVolumeHigh, CiVolumeMute } from "react-icons/ci";
import { CustomButton } from "../../elementComponents";
import { IoSend } from "react-icons/io5";
import { uploadFile } from "./filleUtils";
import { useDispatch, useSelector } from "react-redux";
import { SetFileLInk } from "../../../redux/ChatSlice";
import ImagePreview from "../../ChatsFilesPreview/PreviewFiles/ImagePreview";
import VideoPreview from "../../ChatsFilesPreview/PreviewFiles/VideoPreview";
import DocsPreview from "../../ChatsFilesPreview/PreviewFiles/DocsPreview";
import AudioPreview from "../../ChatsFilesPreview/PreviewFiles/AudioPreview";

const FileView = ({ type, file, handleFileSet }) => {
  const dispatch = useDispatch();
  const FileObjectUrl = URL.createObjectURL(file);
  const [volumeHigh, setVolumeHigh] = useState(true);
  const { user } = useSelector((state) => state.user);
  const [fileUploading, setFiileUploading] = useState(false);
  const GetUploadFileLink = async () => {
    let res = await uploadFile(file, user);
    if (res.success) {
      dispatch(SetFileLInk(type, res.fileUrl || null));
      setFiileUploading(false);
    } else {
      handleFileSet(null, null);
      setFiileUploading(false);
    }
  };
  useEffect(() => {
    setFiileUploading(true);
    GetUploadFileLink();
  }, [file]);

  return (
    <div className="w-full overflow-hidden max-md:h-fit   relative h-full flex flex-col justify-center items-center">
      {/* // <img
          //   src={URL.createObjectURL(file)}
          //   alt={type}
          //   className="w-full h-full object-contain"
          // /> */}
      {type == "image" && <ImagePreview src={FileObjectUrl} />}
      {type == "video" && <VideoPreview src={FileObjectUrl} />}
      {type == "document" && <DocsPreview src={FileObjectUrl} />}
      {type == "audio" && <AudioPreview src={FileObjectUrl} />}
    </div>
  );
};

export default FileView;

// <div className="w-full relative">
// <video
//   src={file}
//   muted={volumeHigh}
//   autoPlay
//   loop
//   className="w-full h-full bg-blue "
// ></video>
// {!volumeHigh ? (
//   <CiVolumeHigh
//     size={25}
//     onClick={() => setVolumeHigh(!volumeHigh)}
//     fontWeight={"900"}
//     className="absolute bottom-2 font-extrabold right-3 text-blue"
//   />
// ) : (
//   <CiVolumeMute
//     size={25}
//     fontWeight={"900"}
//     onClick={() => setVolumeHigh(!volumeHigh)}
//     className="absolute font-extrabold bottom-2 right-3 text-blue"
//   />
// )}
// </div>
