//endpoints for business information
import api from "../../store/api";

const businessApi = api.injectEndpoints({
  endpoints: (builder) => ({
    //fetch business data
    getBusiness: builder.query({
      query: () => ({
        url: "/business",
        method: "GET",
      }),
      providesTags: ["Business"],
    }),
    //fetch drop data
    getDrops: builder.query({
      query: (dropId) => ({
        url: `/business/drops/${dropId}`,
        method: "GET",
      }),
      providesTags: ["Business"],
    }),

    getDropsByMemberId: builder.query({
      query: (memberId) => ({
        url: `/business/memberdrops/${memberId}`,
        method: "GET",
      }),
      providesTags: (result, error, memberId) => [
        { type: "MemberDrops", id: memberId },
      ],
    }),
  }),
});

export const {
  useGetBusinessQuery,
  useGetDropsQuery,
  useGetDropsByMemberIdQuery, // move this to owner slice
} = businessApi;
