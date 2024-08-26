import { combineReducers } from "@reduxjs/toolkit";

import userSlice from "./userSlice";
import themeSlice from "./themeSlice";
import postSlice from "./postSlice";
import chatSlice from "./ChatSlice";

const rootReducer = combineReducers({
    user: userSlice,
    theme: themeSlice,
    posts: postSlice,
    chats: chatSlice,
});

export { rootReducer };