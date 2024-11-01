import { configureStore } from "@reduxjs/toolkit";
import authOwnerReducer from "../features/auth/authOwnerSlice";
import authMemberReducer from "../features/auth/authMemberSlice";
import api from "./api";

const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    authOwner: authOwnerReducer,
    authMember: authMemberReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export default store;
