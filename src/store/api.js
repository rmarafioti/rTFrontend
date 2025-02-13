// api.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl:
      process.env.NODE_ENV === "production"
        ? "https://rtbackend-9d8f08c0e69e.herokuapp.com/api"
        : "http://localhost:3000/api",
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
