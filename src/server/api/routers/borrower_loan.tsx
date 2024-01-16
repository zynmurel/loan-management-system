import dayjs from "dayjs";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const borrowerLoansRouter = createTRPCRouter({
  getLoanByStatus: publicProcedure
    .input(
      z.object({
        searchText: z.string(),
        status: z.string(),
        id: z.number(),
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
          borrowerId: input.id,
        },
        orderBy: {
          updatedAt: "desc",
        },
        include: {
          Payment: true,
          LoanPlan: true,
          LoanType: true,
          Borrower: true,
        },
      });
    }),
  getAllLoanTypes: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.loanTypes.findMany().then((data) => {
      return data.map((dt) => {
        return {
          value: dt.id,
          label: `${dt.name} - ${dt.description}`,
        };
      });
    });
  }),
  getAllLoanPlans: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.loanPlans.findMany().then((data) => {
      return data.map((dt) => {
        return {
          value: dt.id,
          label: `${dt.planMonth} Month/s , ${dt.interest}% Interest , ${dt.penalty}% Monthly Overdue Penalty`,
          penalty: dt.penalty,
          planMonth: dt.planMonth,
          interest: dt.interest,
        };
      });
    });
  }),
  getBorrowers: publicProcedure
    .input(
      z.object({
        searchText: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.borrower
        .findMany({
          where: {
            OR: [
              // { firstName: { contains: input.searchText } },
              // { middleName: { contains: input.searchText } },
              // { lastName: { contains: input.searchText } },
              { borrowerIdNo: { contains: input.searchText } },
            ],
          },
          take: 10,
        })
        .then((data) => {
          return data.map((dt) => {
            return {
              value: dt.id,
              label: `${dt.borrowerIdNo} - ${dt.firstName} ${dt.middleName} ${dt.lastName}`,
            };
          });
        });
    }),
  createLoan: publicProcedure
    .input(
      z.object({
        amount: z.number(),
        status: z.string(),
        borrowerId: z.number(),
        loanPlanId: z.number(),
        loanTypeId: z.number(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const randomId = Math.floor(100000000 + Math.random() * 900000000);
      const loan = ctx.db.loans.create({
        data: {
          ...input,
          referenceNo: randomId.toString(),
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
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.loans.update({
        where: {
          id: input.id,
        },
        data: {
          status: input.status,
        },
      });
    }),
  getBorrowerById: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.borrower.findUnique({
        where: {
          id: input.id,
        },
      });
    }),
  changeLoanToActive: publicProcedure
    .input(
      z.object({
        id: z.number(),
        months: z.number(),
        monthlyAmount: z.number(),
        monthlyPenalty: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const dateNow = dayjs();
      return await ctx.db.loans
        .update({
          where: {
            id: input.id,
          },
          data: {
            status: "active",
            startDate: dateNow.toDate(),
          },
        })
        .then(async (data) => {
          type PaymentType = {
            penalty: boolean;
            loanId: number;
            deadline: Date;
            penaltyValue: number;
            amountValue: number;
          }[];
          const payments: PaymentType = [];
          for (let x = 1; x <= input.months; x++) {
            payments.push({
              penalty: false,
              loanId: data.id,
              deadline: dateNow.add(x, "month").toDate(),
              penaltyValue: input.monthlyPenalty,
              amountValue: input.monthlyAmount,
            });
          }
          return await ctx.db.payment
            .createMany({
              data: [...payments],
              skipDuplicates: true, // Skip 'Bobo'
            })
            .then((data) => {
              return {
                data,
                message: "success",
              };
            });
        });
    }),
});
