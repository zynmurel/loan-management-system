import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const borrowerRouter = createTRPCRouter({
  createBorrower: publicProcedure
    .input(
      z.object({
        imageBase64: z.string(),
        firstName: z.string(),
        middleName: z.string(),
        lastName: z.string(),
        status: z.string(),
        contact: z.string(),
        address: z.string(),
        email: z.string(),
        taxNo: z.string(),
        password: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      try {
        const newBorrower = ctx.db.borrower.create({
          data: {
            ...input,
          },
        });
        return newBorrower;
      } catch (e) {
        throw {
          error: new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message:
              "This Email or Phone Number is already used! Please use another.",
            // optional: pass the original error to retain stack trace
          }),
          data: e,
        };
      }
    }),

  getBorrowersByStatus: publicProcedure
    .input(
      z.object({
        searchText: z.string(),
        status: z.string(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.borrower.findMany({
        where: {
          OR: [
            { firstName: { contains: input.searchText } },
            { middleName: { contains: input.searchText } },
            { lastName: { contains: input.searchText } },
            { contact: { contains: input.searchText } },
            { email: { contains: input.searchText } },
          ],
          status: input.status,
        },
      });
    }),

  deleteBorrower: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.borrower.delete({
        where: {
          id: input.id,
        },
      });
    }),

  approvedBorrower: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.borrower.update({
        where: {
          id: input.id,
        },
        data: {
          status: "approved",
        },
      });
    }),

  editBorrower: publicProcedure
    .input(
      z.object({
        id: z.number(),
        imageBase64: z.string(),
        firstName: z.string(),
        middleName: z.string(),
        lastName: z.string(),
        contact: z.string(),
        address: z.string(),
        email: z.string(),
        taxNo: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.borrower.update({
        where: {
          id: input.id,
        },
        data: {
          imageBase64: input.imageBase64,
          firstName: input.firstName,
          middleName: input.middleName,
          lastName: input.lastName,
          contact: input.contact,
          address: input.address,
          email: input.email,
          taxNo: input.taxNo,
        },
      });
    }),
});
