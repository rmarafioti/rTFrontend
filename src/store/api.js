// api.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api", // Replace with your backend URL and port
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
