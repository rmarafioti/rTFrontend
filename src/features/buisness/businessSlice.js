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
  }),
});

export const { useGetBusinessQuery } = businessApi;
