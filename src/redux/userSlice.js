import { createSlice } from "@reduxjs/toolkit";
import { user } from "../assets/data";
const initialState = {
    user: JSON.parse(localStorage.getItem('user')) ?? null,
    edit: false,
    MobileProfileView: false,
    MobileNotificationView: false,
    friendRequests: [],
    suggestedFriends: [],
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        login(state, action) {
            state.user = action.payload;
            localStorage.setItem("user", JSON.stringify(action.payload));
        },
        logout(state, action) {
            state.user = null;
            localStorage.removeItem("user");
        },
        updateProfile(state, action) {
            state.edit = action.payload;
        },
        updateMobileProfile(state, action) {
            console.log(action.payload);
            state.MobileProfileView = action.payload;
        },
        updateMobileNotification(state, action) {
            state.MobileNotificationView = action.payload;
        },
        updateSuggestedFriends(state, action) {
            state.suggestedFriends = action.payload;
        },
        updateFriendRequests(state, action) {
            state.friendRequests = action.payload;
        },

    }
});

export default userSlice.reducer;

export const userLogin = (user) => {
    return (dispatch, action) => {
        dispatch(userSlice.actions.login(user));
    };
};
export const userLogout = (user) => {
    return (dispatch, action) => {
        dispatch(userSlice.actions.logout(user));
    };
};

export const updateProfile = (val) => {
    return (dispatch, action) => {
        dispatch(userSlice.actions.updateProfile(val));
    };
};
export const setMobileProfile = (val) => {
    return (dispatch, action) => {
        dispatch(userSlice.actions.updateMobileProfile(val));
    };
};
export const setMobileNotification = (val) => {
    return (dispatch, action) => {
        dispatch(userSlice.actions.updateMobileNotification(val));
    };
};
export const setSuggestedFriends = (val) => {
    return (dispatch, action) => {
        dispatch(userSlice.actions.updateSuggestedFriends(val));
    };
};
export const setFriendRequets = (val) => {
    return (dispatch, action) => {
        dispatch(userSlice.actions.updateFriendRequests(val));
    };
};
