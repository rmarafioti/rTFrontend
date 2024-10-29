import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/**
 * @description Empty central API slice. Endpoints should be injected in their own slices. If available, an auth token is added to all request headers.
 */
const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || "/api", // Vite-style env variable
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: () => ({}),
});

export default api;
