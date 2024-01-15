"use client";

import dayjs from "dayjs";
import { PesoFormat } from "~/app/_utils/helpers/phpFormatter";
import { api } from "~/trpc/react";

const PaymentByLoanPage = ({ params: { id } }: { params: { id: string } }) => {
  const { data: loan, isLoading: loanIsLoading } =
    api.payment_id.getLoanByRefNo.useQuery({
      refNo: id,
    });

  return (
    <div className=" flex w-full flex-col">
      {loan ? (
        <div className="flex flex-col gap-2">
          <div className=" flex-1 rounded bg-white p-3 px-6 text-gray-600 shadow">
            <div className="-mb-2 text-xl font-medium text-emerald-600">
              ID {loan.Borrower.borrowerIdNo}
            </div>
            <div className=" text-4xl font-medium uppercase ">
              {`${loan.Borrower.firstName} ${loan.Borrower.middleName} ${loan.Borrower.lastName}`}
            </div>
            <div className=" -mb-1 mt-1 text-2xl font-medium uppercase text-cyan-700">
              LOAN PLAN - {loan.LoanType.name}
            </div>
            <div className=" text-base font-medium text-cyan-700">
              {loan.LoanPlan.planMonth} Months , {loan.LoanPlan.interest}%
              Interest , {loan.LoanPlan.penalty}% Monthly Overdue Penalty
            </div>
            <div className=" text-base font-medium text-cyan-700">
              Loan Start Date : {dayjs(loan.startDate).format("MMMM D, YYYY")}
            </div>
            <div className=" flex flex-none flex-row items-center gap-1 text-base text-cyan-700">
              Loan Amount :{" "}
              <div className=" flex-none">
                <span className="rounded text-2xl">
                  {PesoFormat.format(loan.amount)}
                </span>
              </div>
            </div>
          </div>
          <div className=" flex flex-1 flex-col gap-5 rounded bg-white p-3 px-6 text-gray-600 shadow">
            <div className=" flex flex-col items-center justify-center">
              <div className=" mb-2 text-xl font-medium uppercase text-gray-500">
                Payment
              </div>
              <div className=" flex flex-row gap-3">
                <div className=" flex flex-row">
                  <div className=" flex min-w-48 flex-col items-center justify-center text-teal-600">
                    Total
                    <div className=" flex w-full items-center justify-center rounded border border-teal-600 p-1 px-3 text-base">
                      {PesoFormat.format(
                        loan.Payment[0]?.amountValue
                          ? loan.Payment[0].amountValue *
                              loan.LoanPlan.planMonth
                          : 0,
                      )}
                    </div>
                  </div>
                </div>
                <div className=" flex flex-row">
                  <div className=" flex min-w-48 flex-col items-center justify-center text-teal-600">
                    Monthly
                    <div className=" flex w-full items-center justify-center rounded border border-teal-600 p-1 px-3 text-base">
                      {PesoFormat.format(loan.Payment[0]?.amountValue || 0)}
                    </div>
                  </div>
                </div>
                <div className=" flex flex-row">
                  <div className=" flex min-w-48 flex-col items-center justify-center text-teal-600">
                    Penalty(Per month)
                    <div className=" flex w-full items-center justify-center rounded border border-teal-600 p-1 px-3 text-base">
                      {PesoFormat.format(loan.Payment[0]?.penaltyValue || 0)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-row gap-3">
              <div className=" flex-1 rounded-md bg-green-100 shadow-sm">
                Sample
              </div>
              <div className=" flex-1">Sample</div>
            </div>
          </div>
        </div>
      ) : (
        <div className=" flex-none rounded border bg-white p-3 px-6 text-gray-600 shadow"></div>
      )}
    </div>
  );
};

export default PaymentByLoanPage;
