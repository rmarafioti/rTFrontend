//endpoints for owner features
import api from "../../store/api";

const ownerApi = api.injectEndpoints({
  endpoints: (builder) => ({
    //getMe query to gets the logged in owner
    getMe: builder.query({
      query: () => "/owner/me",
      providesTags: ["owner"],
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

export const { useGetMeQuery, useCreateBusinessMutation } = ownerApi;
