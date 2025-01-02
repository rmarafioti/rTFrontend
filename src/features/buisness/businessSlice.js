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
    getDropsMonth: builder.query({
      query: (year) => ({
        url: `/business/drops/${year}`,
        method: "GET",
      }),
      providesTags: ["Business"],
    }),
  }),
});

export const { useGetBusinessQuery, useGetDropsQuery, useGetDropsMonthQuery } =
  businessApi;
