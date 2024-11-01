// authMemberSlice.js

import { createSlice } from "@reduxjs/toolkit";
import api from "../../store/api";

/** Authentication endpoints for member */
const authMemberApi = api.injectEndpoints({
  endpoints: (builder) => ({
    registerMember: builder.mutation({
      query: (credentials) => ({
        url: "/auth/member/register",
        method: "POST",
        body: credentials,
      }),
      transformErrorResponse: (response) => response.data,
    }),
    loginMember: builder.mutation({
      query: (credentials) => ({
        url: "/auth/member/login",
        method: "POST",
        body: credentials,
      }),
      transformErrorResponse: (response) => response.data,
    }),
  }),
});

export const { useRegisterMemberMutation, useLoginMemberMutation } =
  authMemberApi;

/** Session storage key for auth token */
const TOKEN_KEY = "memberToken";

/** Reducer that stores payload's token and member data in state and session storage */
const storeMemberToken = (state, { payload }) => {
  state.token = payload.token;
  state.member = payload.memberData; // Adjust if different in response
  sessionStorage.setItem(TOKEN_KEY, payload.token);
};

/** Auth slice to manage member authentication */
const authMemberSlice = createSlice({
  name: "authMember",
  initialState: {
    token: sessionStorage.getItem(TOKEN_KEY),
    member: null,
  },
  reducers: {
    /** Logging out clears the token and member data */
    logoutMember: (state) => {
      state.token = null;
      state.member = null;
      sessionStorage.removeItem(TOKEN_KEY);
    },
  },
  extraReducers: (builder) => {
    // Store token and member data on successful member registration/login
    builder.addMatcher(
      authMemberApi.endpoints.registerMember.matchFulfilled,
      storeMemberToken
    );
    builder.addMatcher(
      authMemberApi.endpoints.loginMember.matchFulfilled,
      storeMemberToken
    );
  },
});

export const { logoutMember } = authMemberSlice.actions;

// Selector to access member states
export const selectMemberToken = (state) => state.authMember.token;
export const selectCurrentMember = (state) => state.authMember.member;

export default authMemberSlice.reducer;
