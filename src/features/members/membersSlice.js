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

    //link member to a business
    linkMemberToBusiness: builder.mutation({
      query: ({ businessName, code }) => ({
        url: `/member/business`,
        method: "POST",
        body: { businessName, code },
      }),
      invalidatesTags: ["Member"],
    }),

    //member create drop
    memberCreateDrop: builder.mutation({
      query: () => ({
        url: `/member/createdrop`,
        method: "POST",
      }),
      invalidatesTags: ["Member"],
    }),

    //member create a service
    memberCreateService: builder.mutation({
      query: ({
        dropId,
        description,
        cash,
        credit,
        deposit,
        giftCertAmount,
      }) => ({
        url: `/member/createservice/${dropId}`,
        method: "POST",
        body: { description, cash, credit, deposit, giftCertAmount },
      }),
      invalidatesTags: ["Member"],
    }),

    //member fetch all drops
    getAllDrops: builder.query({
      query: () => ({
        url: `/member/memberdrops`,
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
        url: `/member/drops/${dropId}`,
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
      invalidatesTags: ["Member", "Owner"],
    }),

    // member delete a drop
    memberDeleteDrop: builder.mutation({
      query: (dropId) => ({
        url: `/member/drops/${dropId}`,
        method: "Delete",
      }),
      invalidatesTags: ["Member"],
    }),

    // member posts a pay notice
    memberPayNotice: builder.mutation({
      query: ({ payee, paidMessage, amount, dropIds }) => ({
        url: `member/paynotice`,
        method: "POST",
        body: {
          payee,
          paidMessage,
          amount,
          dropIds,
        },
      }),
      invalidatesTags: ["Member", "Owner"],
    }),
  }),
});

export const {
  useGetMemberQuery,
  useGetAllDropsQuery,
  useLinkMemberToBusinessMutation,
  useMemberCreateDropMutation,
  useMemberCreateServiceMutation,
  useMemberUpdateDropMutation,
  useMemberDeleteDropMutation,
  useMemberPayNoticeMutation,
} = memberApi;
