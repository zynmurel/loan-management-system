"use client";

const PaymentByLoanPage = ({ params: { id } }: { params: { id: string } }) => {
  const tabList = [
    {
      key: "active",
      tab: "Active Loans",
    },
    {
      key: "approved",
      tab: "Approved Loans",
    },
    {
      key: "request",
      tab: "Loan Requests",
    },
    {
      key: "done",
      tab: "Completed Loans",
    },
  ];
  console.log(id);
  return <>{id}</>;
};

export default PaymentByLoanPage;
