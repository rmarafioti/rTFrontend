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
      invalidatesTags: ["owner"],
    }),
  }),
});

export const { useGetOwnerQuery, useCreateBusinessMutation } = ownerApi;
