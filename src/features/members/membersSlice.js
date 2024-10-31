//endpoints for members features
import api from "../../store/api";

const memberApi = api.injectEndpoints({
  endpoints: (builder) => ({
    //getMe query to get the logged in member
    getMe: builder.query({
      query: () => "member/me",
      providesTags: ["member"],
    }),
    //member links to a business as part of the registration process
    linkBusiness: builder.mutation({
      query: ({ businessName, code }) => ({
        url: `/member/business`,
        method: "POST",
        body: { businessName, code },
      }),
      // Invalidates the "member" tag, so `getMe` refetches if necessary
      invalidatesTags: ["member"],
    }),
  }),
});

export const { useGetMeQuery, useLinkBusinessMutation } = memberApi;
