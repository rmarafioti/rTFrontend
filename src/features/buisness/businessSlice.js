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
    //fetch drop data by year
    getAllDrops: builder.query({
      query: (memberId) => ({
        url: memberId ? `/business/alldrops/${memberId}` : `/business/alldrops`,
        method: "GET",
      }),
      providesTags: (result, error, memberId) => [
        { type: "Business", id: memberId || "ALL" }, // Unique tag for each member
      ],
    }),
  }),
});

export const { useGetBusinessQuery, useGetDropsQuery, useGetAllDropsQuery } =
  businessApi;
