import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const paymentIdRouter = createTRPCRouter({
  getLoanByRefNo: publicProcedure
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
          Payment: true,
        },
      });
    }),
});
