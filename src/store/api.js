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
    // member create drop
    memberCreateDrop: builder.mutation({
      query: () => ({
        url: `/member/createdrop`,
        method: "POST",
      }),
      invalidatesTags: ["Member"],
    }),
    // member create a service
    memberCreateService: builder.mutation({
      query: ({
        dropId,
        description,
        cash,
        credit,
        deposit,
        giftCertAmount,
      }) => ({
        url: `/member/createservice/${dropId}`, // use dropId from the function call
        method: "POST",
        body: { description, cash, credit, deposit, giftCertAmount },
      }),
      invalidatesTags: ["Member"],
    }),

    // member get all services by id
    memberGetDropServices: builder.query({
      query: (drop_id) => ({
        url: `/member/allservices/` + drop_id,
        method: "GET",
      }),
      providesTags: ["Member"],
    }),
    //member delete service
    memberDeleteService: builder.mutation({
      query: (service_id) => ({
        url: `/member/deleteservice/` + service_id,
        method: "DELETE",
      }),
      invalidatesTags: ["Member"],
    }),
    // member edit service
    memberEditService: builder.mutation({
      query: ({
        service_id,
        description,
        cash,
        credit,
        deposit,
        giftCertAmount,
      }) => ({
        url: `/member/updateservice/${service_id}`,
        method: "PATCH",
        body: { description, cash, credit, deposit, giftCertAmount },
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
  useMemberCreateDropMutation,
  useMemberCreateServiceMutation,
  useMemberGetDropServicesQuery,
  useMemberEditServiceMutation,
  useMemberDeleteServiceMutation,
} = api;

export default api;
