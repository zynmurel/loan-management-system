"use client";

import { Modal } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import toast from "react-hot-toast";
import { PesoFormat } from "~/app/_utils/helpers/phpFormatter";
import { api } from "~/trpc/react";

const PaymentByLoanPage = ({ params: { id } }: { params: { id: string } }) => {
  const [paymentData, setPaymentData] = useState<any | null>(null);
  const {
    data: loan,
    isLoading: loanIsLoading,
    refetch,
  } = api.payment_id.getLoanByRefNo.useQuery({
    refNo: id,
  });
  const { mutate: createPayment, isLoading: createPaymentLoading } =
    api.payment_id.createPayment.useMutation({
      onSuccess: (data) => {
        toast.success(
          `Payment for month of ${dayjs(data.deadline).format(
            "MMMM YYYY",
          )} success!`,
        );
        refetch();
        setPaymentData(null);
      },
    });
  const notPaid =
    loan?.NotPaid?.map((data) => {
      return {
        month: dayjs(data.deadline).format("MMMM - YYYY"),
        ...data,
      };
    }) || [];
  const paid =
    loan?.Paid?.map((data) => {
      return {
        month: dayjs(data.deadline).format("MMMM - YYYY"),
        ...data,
      };
    }) || [];
  const columns: ColumnsType<any> = [
    {
      title: "For the Month of",
      dataIndex: "month",
      render: (data) => (
        <div className=" text-lg font-medium uppercase text-gray-700">
          {data}
        </div>
      ),
    },
    {
      title: "Action",
      dataIndex: "index",
      width: 200,
      align: "center",
      render: (_, data) => {
        return (
          <button
            onClick={() => setPaymentData(data)}
            disabled={_ !== 0}
            className={`rounded bg-green-500 p-1 px-5 text-white hover:brightness-105 disabled:bg-gray-200`}
          >
            Pay
          </button>
        );
      },
    },
  ];
  const columnsPaid: ColumnsType<any> = [
    {
      title: "Month of",
      dataIndex: "month",
      render: (data) => <div>{data}</div>,
    },
    {
      title: "Date Paid",
      dataIndex: "datePaid",
      render: (data) => <div>{dayjs(data).format("MM/DD/YY")}</div>,
    },
    {
      title: "",
      dataIndex: "penalty",
      render: (data) =>
        data ? (
          <div className=" flex items-center justify-center">
            <div className="rounded border border-orange-500 px-3 text-orange-500">
              {"penalized"}
            </div>
          </div>
        ) : (
          <></>
        ),
    },
    {
      title: "Sub Total",
      dataIndex: "penalty",
      render: (_, data) =>
        _ ? (
          <div className="">
            {`${PesoFormat.format(data.amountValue + data.penaltyValue)}`}
          </div>
        ) : (
          <div className="">{`${PesoFormat.format(data.amountValue)}`}</div>
        ),
    },
  ];
  const onClosePayment = () => {
    setPaymentData(null);
  };
  const onCreatePayment = () => {
    if (paymentData) {
      createPayment({
        id: paymentData.id,
        datePaid: dayjs().toDate(),
        penalty:
          dayjs(paymentData.deadline).hour(0).minute(0).diff(dayjs()) >= 0
            ? false
            : true,
      });
    }
    console.log(paymentData);
  };
  return (
    <div className=" flex w-full flex-col">
      {loan ? (
        <div className="flex flex-col gap-2">
          <div className=" flex-1 rounded bg-white p-3 px-6 text-gray-600 shadow">
            <div className=" flex flex-row items-center text-xl font-medium text-emerald-600">
              ID {loan.Borrower?.borrowerIdNo}{" "}
              <span
                className={`${
                  loan.status === "done" ? "text-cyan-500" : " text-green-500"
                } pl-1 text-base uppercase`}
              >{`( ${loan.status} )`}</span>
            </div>
            <div className=" text-4xl font-medium uppercase ">
              {`${loan.Borrower?.firstName} ${loan.Borrower?.middleName} ${loan.Borrower?.lastName}`}
            </div>
            <div className=" -mb-1 mt-1 text-2xl font-medium uppercase text-cyan-700">
              LOAN PLAN - {loan.LoanType?.name}
            </div>
            <div className=" text-base font-medium text-cyan-700">
              {loan.LoanPlan?.planMonth} Months , {loan.LoanPlan?.interest}%
              Interest , {loan.LoanPlan?.penalty}% Monthly Overdue Penalty
            </div>
            <div className=" text-base font-medium text-cyan-700">
              Loan Start Date : {dayjs(loan.startDate).format("MMMM D, YYYY")}
            </div>
            <div className=" flex flex-none flex-row items-center gap-1 text-base text-cyan-700">
              Loan Amount :{" "}
              <div className=" flex-none">
                <span className="rounded text-2xl">
                  {PesoFormat.format(loan?.amount || 0)}
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
              {loan.status === "active" ? (
                <div className=" flex-1 rounded-md bg-green-500 p-4 text-white shadow-sm">
                  <div className=" mb-2 text-xl font-bold">To Pay</div>
                  <div className=" overflow-hidden rounded-md">
                    <Table
                      size="large"
                      columns={columns}
                      dataSource={notPaid}
                      scroll={{ y: 300 }}
                      pagination={false}
                    />
                  </div>
                </div>
              ) : (
                <></>
              )}
              <div className=" flex-1 p-4">
                <div className=" mb-2 text-xl font-bold">Payment Record</div>
                <div className=" overflow-hidden rounded-md">
                  <Table
                    columns={columnsPaid}
                    dataSource={paid}
                    scroll={{ y: 250 }}
                    pagination={false}
                  />
                  <div className=" mt-6 flex justify-end gap-3 pr-16 text-xl font-bold text-black">
                    <div>Total Amount Paid :</div>
                    <div>{PesoFormat.format(loan.totalPaid || 0)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className=" flex-none rounded border bg-white p-3 px-6 text-gray-600 shadow"></div>
      )}
      <Modal
        title={`Confirm Payment`}
        open={!!paymentData}
        onCancel={onClosePayment}
        width={450}
        footer={[]}
      >
        <div className=" flex flex-col ">
          <div className=" flex-col rounded bg-white text-base text-gray-700">
            {paymentData && (
              <div className=" w-full">
                <div className=" flex flex-col">
                  {`Payment for the month of
            ${dayjs(paymentData?.deadline).format("MMMM YYYY")}`}
                </div>
                <div className=" flex flex-col">
                  {`Overdue Date : 
              ${dayjs(paymentData?.deadline).format("MMMM DD YYYY")}`}
                </div>
                <div className=" flex flex-col">
                  {`This Month to Pay : 
              ${PesoFormat.format(paymentData.amountValue)}`}
                </div>
                <div className=" flex flex-col">
                  {`Penalty : 
              ${
                dayjs(paymentData.deadline).hour(0).minute(0).diff(dayjs()) >= 0
                  ? "No Penalty"
                  : PesoFormat.format(paymentData.penaltyValue)
              }`}
                </div>
                <div className=" my-2 flex w-full justify-between font-bold text-gray-900">
                  <div>Total Amount </div>
                  <div>- - -</div>
                  <div>
                    {PesoFormat.format(
                      dayjs(paymentData.deadline)
                        .hour(0)
                        .minute(0)
                        .diff(dayjs()) >= 0
                        ? 0 + paymentData.amountValue
                        : paymentData.penaltyValue + paymentData.amountValue,
                    )}
                  </div>
                </div>
                <div className=" flex w-full flex-row justify-end gap-2">
                  <button
                    onClick={onClosePayment}
                    className=" rounded border border-gray-200 px-5 py-1 shadow-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onCreatePayment}
                    disabled={createPaymentLoading}
                    className=" rounded border bg-green-500 px-5 py-1 text-white shadow-sm disabled:bg-green-200"
                  >
                    {`${
                      createPaymentLoading
                        ? "Submitting..."
                        : "Payment Received"
                    }`}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PaymentByLoanPage;
