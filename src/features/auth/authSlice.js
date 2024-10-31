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

/** Reducer that stores payload's token and user data in state and session storage */
const storeOwnerToken = (state, { payload }) => {
  state.token = payload.token;
  state.owner = payload.ownerData; // Adjust if different in response
  state.member = null; // Clear member data if switching roles
  sessionStorage.setItem(TOKEN_KEY, payload.token);
};

const storeMemberToken = (state, { payload }) => {
  state.token = payload.token;
  state.member = payload.memberData; // Adjust if different in response
  state.owner = null; // Clear owner data if switching roles
  sessionStorage.setItem(TOKEN_KEY, payload.token);
};

/** Auth slice to manage owner and member authentication */
const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: sessionStorage.getItem(TOKEN_KEY),
    owner: null,
    member: null,
  },
  reducers: {
    /** Logging out clears the token and both user data */
    logout: (state) => {
      state.token = null;
      state.owner = null;
      state.member = null;
      sessionStorage.removeItem(TOKEN_KEY);
    },
  },
  extraReducers: (builder) => {
    // Store token and owner data on successful owner registration/login
    builder.addMatcher(
      authApi.endpoints.register.matchFulfilled,
      storeOwnerToken
    );
    builder.addMatcher(authApi.endpoints.login.matchFulfilled, storeOwnerToken);

    // Store token and member data on successful member registration/login
    builder.addMatcher(
      authApi.endpoints.registerMember.matchFulfilled,
      storeMemberToken
    );
    builder.addMatcher(
      authApi.endpoints.loginMember.matchFulfilled,
      storeMemberToken
    );
  },
});

export const { logout } = authSlice.actions;

// Selectors to access token, owner, and member states
export const selectToken = (state) => state.auth.token;
export const selectCurrentOwner = (state) => state.auth.owner;
export const selectCurrentMember = (state) => state.auth.member;

export default authSlice.reducer;
