import { TRPCError } from "@trpc/server";
import dayjs from "dayjs";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const homeRouter = createTRPCRouter({
  getHomeDatas: publicProcedure.query(async ({ ctx }) => {
    const dayNow = dayjs().hour(0).minute(0).second(0).toDate();
    const approvedBorrowersCount = await ctx.db.borrower.count({
      where: {
        status: "approved",
      },
    });

    const thisDayPaymentSum = await ctx.db.payment.aggregate({
      where: {
        AND: [
          {
            datePaid: {
              gte: dayNow,
            },
          },
        ],
      },
      _sum: {
        amountValue: true,
      },
    });
    const thisDayPenaltySum = await ctx.db.payment.aggregate({
      where: {
        AND: [
          {
            datePaid: {
              gte: dayNow,
            },
          },
          { penalty: true },
        ],
      },
      _sum: {
        penaltyValue: true,
      },
    });

    const activeLoans = await ctx.db.loans.count({
      where: {
        status: "active",
      },
    });
    return {
      borrowers: approvedBorrowersCount,
      payments:
        (thisDayPaymentSum._sum.amountValue || 0) +
        (thisDayPenaltySum._sum.penaltyValue || 0),
      loans: activeLoans,
    };
  }),
});
