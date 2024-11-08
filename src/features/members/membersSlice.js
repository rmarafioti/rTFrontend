//endpoints for members features
import api from "../../store/api";

const memberApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // fetch member data
    getMember: builder.query({
      query: () => ({
        url: "/member",
        method: "GET",
      }),
      providesTags: ["Member"],
    }),

    // link member to a business
    linkMemberToBusiness: builder.mutation({
      query: ({ businessName, code }) => ({
        url: `/member/business`,
        method: "POST",
        body: { businessName, code },
      }),
      invalidatesTags: ["Member"],
    }),

    // member create drop
    memberCreateDrop: builder.mutation({
      query: () => ({
        url: `/member/createdrop`,
        method: "POST",
      }),
      invalidatesTags: ["Member"],
    }),

    // member create a service
    memberCreateService: builder.mutation({
      query: ({
        dropId,
        description,
        cash,
        credit,
        deposit,
        giftCertAmount,
      }) => ({
        url: `/member/createservice/${dropId}`, // use dropId from the function call
        method: "POST",
        body: { description, cash, credit, deposit, giftCertAmount },
      }),
      invalidatesTags: ["Member"],
    }),

    // member get drop by id
    memberGetDrop: builder.query({
      query: (dropId) => ({
        url: `member/getdrop/${dropId}`,
        method: "GET",
      }),
      providesTags: ["Member"],
    }),

    // member update a drop
    memberUpdateDrop: builder.mutation({
      query: ({
        dropId,
        date,
        total,
        memberCut,
        businessCut,
        memberOwes,
        businessOwes,
      }) => ({
        url: `/member/updatedrop/${dropId}`,
        method: "POST",
        body: {
          date,
          total,
          memberCut,
          businessCut,
          memberOwes,
          businessOwes,
        },
      }),
      invalidatesTags: ["Member"],
    }),
  }),
});

export const {
  useGetMemberQuery,
  useMemberGetDropQuery,
  useLinkMemberToBusinessMutation,
  useMemberCreateDropMutation,
  useMemberCreateServiceMutation,
  useMemberUpdateDropMutation,
} = memberApi;
