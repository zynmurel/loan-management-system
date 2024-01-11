import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const loanRouter = createTRPCRouter({
  getLoanByStatus: publicProcedure
    .input(
      z.object({
        searchText: z.string(),
        status: z.string(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.loans.findMany({
        where: {
          OR: [
            {
              referenceNo: {
                contains: input.searchText,
              },
            },
          ],
          status: {
            equals: input.status,
          },
        },
        include: {
          Payment: true,
          LoanPlan: true,
          LoanType: true,
        },
      });
    }),
  getAllLoanTypes: publicProcedure.query(({ ctx }) => {
    return ctx.db.loanTypes.findMany();
  }),
  getAllLoanPlans: publicProcedure.query(({ ctx }) => {
    return ctx.db.loanPlans.findMany();
  }),
  createLoan: publicProcedure
    .input(
      z.object({
        amount: z.number(),
        status: z.string(),
        borrowerId: z.number(),
        referenceNo: z.string(),
        loanPlanId: z.number(),
        loanTypeId: z.number(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const loan = ctx.db.loans.create({
        data: {
          ...input,
        },
      });
      return loan;
    }),

  deleteLoan: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.loans.delete({
        where: {
          id: input.id,
        },
      });
    }),

  editLoan: publicProcedure
    .input(
      z.object({
        id: z.number(),
        amount: z.number(),
        loanPlanId: z.number(),
        loanTypeId: z.number(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.loans.update({
        where: {
          id: input.id,
        },
        data: {
          amount: input.amount,
          loanPlanId: input.loanPlanId,
          loanTypeId: input.loanTypeId,
        },
      });
    }),

  changeLoanStatus: publicProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.loans.update({
        where: {
          id: input.id,
        },
        data: {
          status: input.status,
        },
      });
    }),
});
