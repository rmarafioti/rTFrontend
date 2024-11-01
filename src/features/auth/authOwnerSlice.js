// authOwnerSlice.js

import { createSlice } from "@reduxjs/toolkit";
import api from "../../store/api";

/** Authentication endpoints for owner */
const authOwnerApi = api.injectEndpoints({
  endpoints: (builder) => ({
    registerOwner: builder.mutation({
      query: (credentials) => ({
        url: "/auth/owner/register",
        method: "POST",
        body: credentials,
      }),
      transformErrorResponse: (response) => response.data,
    }),
    loginOwner: builder.mutation({
      query: (credentials) => ({
        url: "/auth/owner/login",
        method: "POST",
        body: credentials,
      }),
      transformErrorResponse: (response) => response.data,
    }),
  }),
});

export const { useRegisterOwnerMutation, useLoginOwnerMutation } = authOwnerApi;

/** Session storage key for auth token */
const TOKEN_KEY = "ownerToken";

/** Reducer that stores payload's token and owner data in state and session storage */
const storeOwnerToken = (state, { payload }) => {
  state.token = payload.token;
  state.owner = payload.ownerData; // Adjust if different in response
  sessionStorage.setItem(TOKEN_KEY, payload.token);
};

/** Auth slice to manage owner authentication */
const authOwnerSlice = createSlice({
  name: "authOwner",
  initialState: {
    token: sessionStorage.getItem(TOKEN_KEY),
    owner: null,
  },
  reducers: {
    /** Logging out clears the token and owner data */
    logoutOwner: (state) => {
      state.token = null;
      state.owner = null;
      sessionStorage.removeItem(TOKEN_KEY);
    },
  },
  extraReducers: (builder) => {
    // Store token and owner data on successful owner registration/login
    builder.addMatcher(
      authOwnerApi.endpoints.registerOwner.matchFulfilled,
      storeOwnerToken
    );
    builder.addMatcher(
      authOwnerApi.endpoints.loginOwner.matchFulfilled,
      storeOwnerToken
    );
  },
});

export const { logoutOwner } = authOwnerSlice.actions;

// Selector to access owner states
export const selectOwnerToken = (state) => state.authOwner.token;
export const selectCurrentOwner = (state) => state.authOwner.owner;

export default authOwnerSlice.reducer;
