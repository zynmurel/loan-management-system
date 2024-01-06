import { postRouter } from "~/server/api/routers/post";
import { createTRPCRouter } from "~/server/api/trpc";
import { loginRouter } from "./routers/login";
import { signUpRouter } from "./routers/signup";
import { loanTypeRouter } from "./routers/loan_type";
import { loanPlanRouter } from "./routers/loan_plan";
import { adminAccountsRouter } from "./routers/admins";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  login: loginRouter,
  signup: signUpRouter,
  loanType: loanTypeRouter,
  loanPlan: loanPlanRouter,
  admin: adminAccountsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
