import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import React, { useEffect, useRef } from "react";

const EmojiPickerContainer = ({
  emojiContainerOpen,
  setEmojiContainerOpen,
  getValues,
  setValue,
}) => {
  const emojiRef = useRef(null);

  const windowClickHandler = (event) => {
    if (emojiRef.current && !emojiRef.current.contains(event.target)) {
      setEmojiContainerOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", windowClickHandler);
    return () => {
      document.removeEventListener("mousedown", windowClickHandler);
    };
  }, []);

  return emojiContainerOpen ? (
    <div
      ref={emojiRef}
      className="emoji-container max-md:w-64 max-md:h-64 w-fit   overflow-scroll absolute bottom-16 max-md:bottom-32 left-5"
    >
      <Picker
        data={data}
        theme="dark"
        onEmojiSelect={(emoji) => {
          setValue("chatInput", getValues("chatInput") + emoji?.native);
        }}
      />
    </div>
  ) : null;
};

export default EmojiPickerContainer;
