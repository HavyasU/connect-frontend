import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./reducers";


const store = configureStore({
    reducer: rootReducer
});

const { dispatch } = store;

export { store, dispatch };