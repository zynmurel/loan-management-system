import { useForm } from "antd/es/form/Form";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const loginRouter = createTRPCRouter({
  login: publicProcedure
    .input(
      z.object({
        username: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.borrower.findFirst({
        where: {
          AND: [
            { OR: [{ email: input.username }, { contact: input.username }] },
            { password: input.password },
          ],
        },
      });
      const admin = await ctx.db.admin.findFirst({
        where: {
          AND: [{ username: input.username }, { password: input.password }],
        },
      });

      if (user) {
        return {
          userId: user.id,
          userType: "borrower",
          adminType: "",
        };
      } else if (admin) {
        return {
          userId: admin.id,
          userType: "admin",
          adminType: admin.type,
        };
      } else {
        return {
          userId: "error",
        };
      }
    }),
});
