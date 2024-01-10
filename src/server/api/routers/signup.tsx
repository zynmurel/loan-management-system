import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const signUpRouter = createTRPCRouter({
  register: publicProcedure
    .input(
      z.object({
        firstName: z.string(),
        middleName: z.string(),
        lastName: z.string(),
        address: z.string(),
        email: z.string(),
        contact: z.string(),
        taxNo: z.string(),
        password: z.string(),
        imageBase64: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const hasBorrower = await ctx.db.borrower.findFirst({
        where: {
          OR: [
            {
              email: { equals: input.email },
            },
            {
              contact: { equals: input.contact },
            },
          ],
        },
      });
      if (hasBorrower) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "This email or contact number is already used",
        });
      } else {
        return await ctx.db.borrower.create({
          data: {
            ...input,
            status: "pending",
          },
        });
      }
    }),
});
