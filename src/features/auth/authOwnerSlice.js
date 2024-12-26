import { createSlice } from "@reduxjs/toolkit";
import api from "../../store/api"; // Import api, not hooks

const TOKEN_KEY = "ownerToken";

// Authentication owner endpoints
const authOwnerApi = api.injectEndpoints({
  endpoints: (builder) => ({
    registerOwner: builder.mutation({
      query: (credentials) => ({
        url: "/auth/owner/register",
        method: "POST",
        body: credentials,
      }),
      transformErrorResponse: (response) => response.data,
      invalidatesTags: ["Owner"],
    }),
    loginOwner: builder.mutation({
      query: (credentials) => ({
        url: "/auth/owner/login",
        method: "POST",
        body: credentials,
      }),
      transformErrorResponse: (response) => response.data,
      invalidatesTags: ["Owner"],
    }),
  }),
});

export const { useRegisterOwnerMutation, useLoginOwnerMutation } = authOwnerApi;

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
