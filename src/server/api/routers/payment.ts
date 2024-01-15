import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const paymentRouter = createTRPCRouter({
  getSearchLoans: publicProcedure
    .input(
      z.object({
        searchText: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.loans
        .findMany({
          where: {
            AND: [
              { referenceNo: { contains: input.searchText } },
              { status: "active" },
            ],
          },
          include: {
            Borrower: true,
          },
          take: 10,
          orderBy: {
            referenceNo: "asc",
          },
        })
        .then((data) => {
          return data.map((dt) => {
            return {
              value: dt.referenceNo,
              id: dt.id,
              label: `${dt.referenceNo} - Borrower : ${dt.Borrower.firstName} ${dt.Borrower.middleName} ${dt.Borrower.lastName}`,
            };
          });
        });
    }),
  getSearchedLoanByRefNo: publicProcedure
    .input(
      z.object({
        refNo: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.loans.findFirst({
        where: {
          referenceNo: {
            equals: input.refNo,
          },
          status: "active",
        },
        include: {
          Borrower: true,
          LoanPlan: true,
          LoanType: true,
          Payment: {
            where: {
              NOT: [{ datePaid: { equals: null } }],
            },
            orderBy: { datePaid: "desc" },
          },
        },
      });
    }),
});
