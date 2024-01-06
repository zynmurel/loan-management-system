import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const loanPlanRouter = createTRPCRouter({
  createLoanPlan: publicProcedure
    .input(
      z.object({
        planMonth: z.number(),
        interest: z.number(),
        penalty: z.number(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const loanType = ctx.db.loanPlans.create({
        data: {
          ...input,
        },
      });
      return loanType;
    }),

  getAllLoanPlans: publicProcedure
    .input(
      z.object({
        sort: z.string(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.loanPlans.findMany({
        orderBy: {
          planMonth: input.sort as any,
        },
        include: {
          Loans: true,
        },
      });
    }),
  deleteLoanPlan: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.loanPlans.delete({
        where: {
          id: input.id,
        },
      });
    }),
  editLoanPlan: publicProcedure
    .input(
      z.object({
        id: z.number(),
        planMonth: z.number(),
        interest: z.number(),
        penalty: z.number(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.loanPlans.update({
        where: {
          id: input.id,
        },
        data: {
          planMonth: input.planMonth,
          interest: input.interest,
          penalty: input.penalty,
        },
      });
    }),
});
