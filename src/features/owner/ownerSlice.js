//endpoints for owner features
import api from "../../store/api";

const ownerApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // fetch owner data
    getOwner: builder.query({
      query: () => ({
        url: "/owner",
        method: "GET",
      }),
      providesTags: ["Owner"],
    }),

    //owner creates a buisness as part of the register onboarding process
    createBusiness: builder.mutation({
      query: ({ businessName, code }) => ({
        url: `/owner/business`,
        method: "POST",
        body: { businessName, code },
      }),
      invalidatesTags: ["Owner"],
    }),

    // owner get members drops by id
    ownerGetDrop: builder.query({
      query: (dropId) => ({
        url: `/owner/drops/${dropId}`,
        method: "GET",
      }),
      providesTags: ["Owner"],
    }),

    //owner posts a drop paid
    ownerPayDrops: builder.mutation({
      query: ({ payee, paidMessage, amount, dropIds, memberId }) => ({
        url: `owner/paydrops`,
        method: "POST",
        body: {
          payee,
          paidMessage,
          amount,
          dropIds,
          memberId,
        },
      }),
      invalidatesTags: ["Owner", "Member"],
    }),
  }),
});

export const {
  useGetOwnerQuery,
  useOwnerGetDropQuery,
  useCreateBusinessMutation,
  useOwnerPayDropsMutation,
} = ownerApi;
