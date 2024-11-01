import { createSlice } from "@reduxjs/toolkit";
import api from "../../store/api"; // Import api, not hooks

const TOKEN_KEY = "ownerToken";

const storeOwnerToken = (state, { payload }) => {
  state.token = payload.token;
  state.owner = payload.ownerData;
  sessionStorage.setItem(TOKEN_KEY, payload.token);
};

const authOwnerSlice = createSlice({
  name: "authOwner",
  initialState: {
    token: sessionStorage.getItem(TOKEN_KEY),
    owner: null,
  },
  reducers: {
    logoutOwner: (state) => {
      state.token = null;
      state.owner = null;
      sessionStorage.removeItem(TOKEN_KEY);
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      api.endpoints.registerOwner.matchFulfilled,
      storeOwnerToken
    );
    builder.addMatcher(
      api.endpoints.loginOwner.matchFulfilled,
      storeOwnerToken
    );
  },
});

export const { logoutOwner } = authOwnerSlice.actions;
export const selectOwnerToken = (state) => state.authOwner?.token;

export default authOwnerSlice.reducer;
