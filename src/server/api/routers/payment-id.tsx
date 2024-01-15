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
      return await ctx.db.loans
        .findFirst({
          where: {
            referenceNo: {
              equals: input.refNo,
            },
            OR: [{ status: "active" }, { status: "done" }],
          },
          include: {
            Borrower: true,
            LoanPlan: true,
            LoanType: true,
            Payment: {
              orderBy: {
                deadline: "asc",
              },
            },
          },
        })
        .then((data) => {
          const paid = data?.Payment.filter((data) => !!data.datePaid).map(
            (data, index) => {
              return { ...data, index };
            },
          );
          const notPaid = data?.Payment.filter((data) => !data.datePaid).map(
            (data, index) => {
              return { ...data, index };
            },
          );
          const totalPaid = paid?.reduce((accumulator, data) => {
            const penalty = data.penalty ? data.penaltyValue : 0;
            return accumulator + data.amountValue + penalty;
          }, 0);
          if (data) {
            return {
              ...data,
              Paid: paid,
              NotPaid: notPaid,
              totalPaid,
            };
          }
        });
    }),
  createPayment: publicProcedure
    .input(
      z.object({
        id: z.number(),
        datePaid: z.date(),
        penalty: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.payment
        .update({
          where: {
            id: input.id,
          },
          data: {
            datePaid: input.datePaid,
            penalty: input.penalty,
          },
        })
        .then((data) => {
          return ctx.db.loans
            .findFirst({
              where: {
                id: data.loanId,
                Payment: {
                  some: {
                    datePaid: { equals: null },
                  },
                },
              },
            })
            .then((hasUnPaidPayments) => {
              console.log("maui", hasUnPaidPayments);
              if (!hasUnPaidPayments) {
                ctx.db.loans
                  .update({
                    where: {
                      id: data.loanId,
                    },
                    data: {
                      status: "done",
                    },
                  })
                  .then(() => console.log("done"));
                return data;
              } else {
                return data;
              }
            });
        });
    }),
});
