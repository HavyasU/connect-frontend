import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    chatMessages: [],
    rawFile: {
        type: null,
        file: null
    },
    UploadedFile: {
        fileType: null,
        fileLink: null
    }
};

const chatSlice = createSlice({
    name: "chats",
    initialState,
    reducers: {
        setMessages(state, action) {
            state.chatMessages.push(action.payload);
        },
        setConversationMessages(state, action) {
            state.chatMessages = action.payload;
        },
        setFileLink(state, action) {
            state.UploadedFile = action.payload;
        },
        setRawFile(state, action) {
            state.rawFile = action.payload;
        }
    }
});

export default chatSlice.reducer;

export function SetChatMessages(value) {
    return (dispatch) => {
        dispatch(chatSlice.actions.setMessages(value));
    };
}
export function SetConversationMessages(value) {
    return (dispatch) => {
        dispatch(chatSlice.actions.setConversationMessages(value));
    };
}
export function SetFileLInk(type, file) {
    return (dispatch) => {
        dispatch(chatSlice.actions.setFileLink({
            fileType: type,
            fileLink: file
        }));
    };
}
export function SetRawFile(type, file) {
    return (dispatch) => {
        dispatch(chatSlice.actions.setRawFile({
            type: type,
            file: file
        }));
    };
}