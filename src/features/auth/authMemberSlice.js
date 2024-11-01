import { createSlice } from "@reduxjs/toolkit";
import api from "../../store/api"; // Import api, not hooks

const TOKEN_KEY = "memberToken";

const storeMemberToken = (state, { payload }) => {
  state.token = payload.token;
  state.member = payload.memberData;
  sessionStorage.setItem(TOKEN_KEY, payload.token);
};

const authMemberSlice = createSlice({
  name: "authMember",
  initialState: {
    token: sessionStorage.getItem(TOKEN_KEY),
    member: null,
  },
  reducers: {
    logoutMember: (state) => {
      state.token = null;
      state.member = null;
      sessionStorage.removeItem(TOKEN_KEY);
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      api.endpoints.registerMember.matchFulfilled,
      storeMemberToken
    );
    builder.addMatcher(
      api.endpoints.loginMember.matchFulfilled,
      storeMemberToken
    );
  },
});

export const { logoutMember } = authMemberSlice.actions;
export const selectMemberToken = (state) => state.authMember?.token;

export default authMemberSlice.reducer;
