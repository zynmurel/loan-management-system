import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const reportsRouter = createTRPCRouter({
  loanReport: publicProcedure
    .input(
      z.object({
        startDate: z.date(),
        endDate: z.date(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.loans
        .findMany({
          where: {
            AND: [
              { startDate: { gte: input.startDate } },
              { startDate: { lte: input.endDate } },
            ],
          },
          include: {
            Borrower: true,
            LoanPlan: true,
            LoanType: true,
          },
        })
        .then((data) => {
          return data.map((dt) => {
            return {
              referenceNo: dt.referenceNo,
              status: dt.status,
              loanType: dt.LoanType.name,
              loanPlan: `${dt.LoanPlan.planMonth} mons / ${dt.LoanPlan.interest}% interest  / ${dt.LoanPlan.penalty}% penalty`,
              name: `${dt.Borrower.firstName} ${dt.Borrower.middleName} ${dt.Borrower.lastName}`,
            };
          });
        });
    }),
  paymentReport: publicProcedure
    .input(
      z.object({
        startDate: z.date(),
        endDate: z.date(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const payment = await ctx.db.payment.findMany({
        where: {
          AND: [
            { datePaid: { gte: input.startDate } },
            { datePaid: { lte: input.endDate } },
          ],
        },
        include: {
          Loan: {
            include: {
              Borrower: true,
            },
          },
        },
      });
      const paidTotalAmount = await ctx.db.payment.aggregate({
        where: {
          AND: [
            { datePaid: { gte: input.startDate } },
            { datePaid: { lte: input.endDate } },
          ],
        },
        _sum: {
          amountValue: true,
        },
      });
      const penaltyTotalAmount = await ctx.db.payment.aggregate({
        where: {
          AND: [
            { datePaid: { gte: input.startDate } },
            { datePaid: { lte: input.endDate } },
            { penalty: true },
          ],
        },
        _sum: {
          penaltyValue: true,
        },
      });
      const paid = paidTotalAmount?._sum.amountValue
        ? paidTotalAmount._sum.amountValue
        : 0;
      const penalty = penaltyTotalAmount?._sum.penaltyValue
        ? penaltyTotalAmount._sum.penaltyValue
        : 0;
      return {
        payment: payment.map((dt) => {
          return {
            name: `${dt.Loan.Borrower.firstName} ${dt.Loan.Borrower.middleName} ${dt.Loan.Borrower.lastName}`,
            penalty: dt.penalty,
            penaltyValue: dt.penaltyValue,
            amountValue: dt.amountValue,
            referenceNo: dt.Loan.referenceNo,
          };
        }),
        totalAmount: paid + penalty,
      };
    }),
});
