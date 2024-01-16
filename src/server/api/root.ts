import { postRouter } from "~/server/api/routers/post";
import { createTRPCRouter } from "~/server/api/trpc";
import { loginRouter } from "./routers/login";
import { signUpRouter } from "./routers/signup";
import { loanTypeRouter } from "./routers/loan_type";
import { loanPlanRouter } from "./routers/loan_plan";
import { adminAccountsRouter } from "./routers/admins";
import { borrowerRouter } from "./routers/borrower";
import { loanRouter } from "./routers/loans";
import { homeRouter } from "./routers/home";
import { paymentRouter } from "./routers/payment";
import { paymentIdRouter } from "./routers/payment-id";
import { borrowerLoansRouter } from "./routers/borrower_loan";
import { reportsRouter } from "./routers/reports";

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
  loans: loanRouter,
  admin: adminAccountsRouter,
  borrower: borrowerRouter,
  home: homeRouter,
  payment: paymentRouter,
  payment_id: paymentIdRouter,
  borrower_loan: borrowerLoansRouter,
  reports: reportsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
