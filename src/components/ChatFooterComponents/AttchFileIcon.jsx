// AttchFileIcon Component
import React, { useState } from "react";
import { MdAttachFile } from "react-icons/md";
import {
  TbFile,
  TbFile3D,
  TbImageInPicture,
  TbMusic,
  TbVideo,
} from "react-icons/tb";
import FileView from "./MediaDisplayFiles/FileView";
import { useDispatch, useSelector } from "react-redux";
import { SetRawFile } from "../../redux/ChatSlice";

const AttachItems = [
  {
    icon: <TbImageInPicture />,
    name: "image",
    acceptable: "image/*",
  },
  {
    icon: <TbVideo />,
    name: "video",
    acceptable: "video/*",
  },
  {
    icon: <TbFile />,
    name: "document",
    acceptable: ".docs,.docx,.pdf,.word",
  },
  {
    icon: <TbMusic />,
    name: "audio",
    acceptable: ".mp3,.mp4",
  },
];

const AttchFileIcon = () => {
  const [openFileDrawer, setOpenFileDrawer] = useState(false);
  const dispatch = useDispatch();
  const { rawFile: file } = useSelector((state) => state.chats);

  const handleFileSet = (type, file) => {
    dispatch(SetRawFile(type, file));
  };

  return (
    <div className="h-full  relative">
      {file.file && (
        <div className="min-w-96 max-md:h-fit max-md:w-fit max-md:min-w-fit h-72 bg-primary absolute bottom-14 right-20 max-md:-right-12 rounded shadow-black shadow-md">
          <FileView
            type={file.type}
            file={file.file}
            handleFileSet={handleFileSet}
          />
        </div>
      )}
      {openFileDrawer && (
        <div className="absolute bottom-16 -right-16 px-3 shadow-[#212121] text-ascent-1 shadow-lg py-6 bg-secondary rounded">
          {AttachItems.map((ele) => (
            <React.Fragment key={ele.name}>
              <label htmlFor={`fileUpload-${ele.name}`}>
                <div className="flex justify-start items-center hover:bg-primary cursor-pointer gap-2 px-5 py-2 font-bold">
                  <h1 className="text-xl">{ele.icon}</h1>
                  <h1>{ele.name}</h1>
                </div>
              </label>
              <input
                onChange={(e) => {
                  if (e.target.files.length > 0) {
                    handleFileSet(ele.name, e.target.files[0]);
                    setOpenFileDrawer(false);
                  }
                }}
                accept={ele?.acceptable}
                hidden
                type="file"
                name="fileUpload"
                id={`fileUpload-${ele.name}`}
              />
            </React.Fragment>
          ))}
        </div>
      )}

      <div
        className="relative text-ascent-1 w-12 hover:bg-primary h-12 cursor-pointer flex justify-center items-center bg-secondary rounded"
        onClick={() => setOpenFileDrawer(!openFileDrawer)}
      >
        <MdAttachFile fontSize={25} />
      </div>
    </div>
  );
};

export default AttchFileIcon;
