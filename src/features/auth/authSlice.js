import { createSlice } from "@reduxjs/toolkit";
import api from "../../store/api";

/** Authentication endpoints */
const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // owner registration
    register: builder.mutation({
      query: (credentials) => ({
        url: "/auth/owner/register",
        method: "POST",
        body: credentials,
      }),
      transformErrorResponse: (response) => response.data,
    }),
    // member registration
    registerMember: builder.mutation({
      query: (credentials) => ({
        url: "/auth/member/register",
        method: "POST",
        body: credentials,
      }),
      transformErrorResponse: (response) => response.data,
    }),
    //owner login
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/owner/login",
        method: "POST",
        body: credentials,
      }),
      transformErrorResponse: (response) => response.data,
    }),
    //member login
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

export const {
  useRegisterMutation,
  useRegisterMemberMutation,
  useLoginMutation,
  useLoginMemberMutation,
} = authApi;

/** Session storage key for auth token */
const TOKEN_KEY = "token";

/** Reducer that stores payload's token in state and session storage */
const storeToken = (state, { payload }) => {
  state.token = payload.token;
  sessionStorage.setItem(TOKEN_KEY, payload.token);
};

/** Keeps track of JWT sent from API */
const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: sessionStorage.getItem(TOKEN_KEY),
  },
  reducers: {
    /** Logging out means wiping the stored token */
    logout: (state) => {
      state.token = null;
      sessionStorage.removeItem(TOKEN_KEY);
    },
  },
  extraReducers: (builder) => {
    // Store token when register or login succeeds
    builder.addMatcher(api.endpoints.register.matchFulfilled, storeToken);
    builder.addMatcher(api.endpoints.login.matchFulfilled, storeToken);
  },
});

export const { logout } = authSlice.actions;

export const selectToken = (state) => state.auth.token;
export const selectCurrentOwner = (state) => state.auth.owner;

export default authSlice.reducer;
