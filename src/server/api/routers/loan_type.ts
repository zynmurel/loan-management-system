import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const loanTypeRouter = createTRPCRouter({
  createLoanType: publicProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const loanType = ctx.db.loanTypes.create({
        data: {
          description: input.description,
          name: input.name,
        },
      });
      return loanType;
    }),

  getAllLoanTypes: publicProcedure
    .input(
      z.object({
        searchText: z.string(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.loanTypes.findMany({
        where: {
          name: {
            contains: input.searchText,
          },
        },
        include: {
          Loans: true,
        },
      });
    }),
  deleteLoanType: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.loanTypes.delete({
        where: {
          id: input.id,
        },
      });
    }),
  editLoanType: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string(),
        description: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.loanTypes.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          description: input.description,
        },
      });
    }),
});
