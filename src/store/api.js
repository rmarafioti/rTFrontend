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
  endpoints: () => ({}),
});

export default api;

/*endpoints: (builder) => ({

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
  useMemberUpdateDropMutation,
  useMemberCreateServiceMutation,
  useMemberGetDropQuery,
  useMemberGetDropServicesQuery,
  useMemberEditServiceMutation,
  useMemberDeleteServiceMutation,
} = api;

export default api;*/
