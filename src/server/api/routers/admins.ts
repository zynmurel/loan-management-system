import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const adminAccountsRouter = createTRPCRouter({
  createAccount: publicProcedure
    .input(
      z.object({
        name: z.string(),
        username: z.string(),
        password: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      try {
        const newAdmin = ctx.db.admin.create({
          data: {
            ...input,
            type: "admin",
          },
        });
        return newAdmin;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "This username is already used! Please use another username.",
          // optional: pass the original error to retain stack trace
        });
      }
    }),

  getAllAdmin: publicProcedure
    .input(
      z.object({
        searchText: z.string(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.admin.findMany({
        where: {
          OR: [
            { name: { contains: input.searchText } },
            { username: { contains: input.searchText } },
          ],
        },
      });
    }),

  getAdmin: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.admin.findUnique({
        where: {
          id: input.id,
        },
      });
    }),

  deleteAdmin: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.admin.delete({
        where: {
          id: input.id,
        },
      });
    }),

  editAdmin: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string(),
        username: z.string(),
        password: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.admin.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          username: input.username,
          password: input.password,
        },
      });
    }),
});
