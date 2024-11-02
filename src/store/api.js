// api.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api", // Replace with your backend URL and port
    prepareHeaders: (headers, { getState }) => {
      const ownerToken = getState().authOwner?.token;
      const memberToken = getState().authMember?.token;

      const token = ownerToken || memberToken;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Owner auth endpoints
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
    // Member auth endpoints
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
    // fetch owner data
    getOwner: builder.query({
      query: () => "/owner",
    }),

    // fetch member data
    getMember: builder.query({
      query: () => "/member",
    }),
    // owner to create a business
    createBusiness: builder.mutation({
      query: ({ businessName, code }) => ({
        url: `/owner/business`,
        method: "POST",
        body: { businessName, code },
      }),
      invalidatesTags: ["Owner", "Business"],
    }),
    // link member to a business
    linkMemberToBusiness: builder.mutation({
      query: ({ businessName, code }) => ({
        url: `/member/business`,
        method: "POST",
        body: { businessName, code },
      }),
      invalidatesTags: ["Member"],
    }),
  }),
});

export const {
  useRegisterOwnerMutation,
  useLoginOwnerMutation,
  useRegisterMemberMutation,
  useLoginMemberMutation,
  useGetOwnerQuery,
  useGetMemberQuery,
  useCreateBusinessMutation,
  useLinkMemberToBusinessMutation,
} = api;

export default api;
