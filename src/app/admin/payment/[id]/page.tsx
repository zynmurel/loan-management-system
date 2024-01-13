"use client";

const PaymentByLoanPage = ({ params: { id } }: { params: { id: string } }) => {
  console.log(id);
  return <>{id}</>;
};

export default PaymentByLoanPage;
